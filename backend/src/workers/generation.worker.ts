import { Worker, QueueEvents } from "bullmq";
import { redis } from "../config/redis";
import { generateQuestions } from '../services/llm.service';
import { AssignmentModel } from "../models/assignment";
import { broadcastToUser } from "../websocket/ws-manager";
import { generatePdfBuffer } from "../services/pdf.service";
import { uploadReportToS3, getPresignedUrl } from "../services/s3.service";

const worker = new Worker("question-generation", async (job) => {
    const { jobId: assignmentId, userId, ...input } = job.data;
    try {
        await AssignmentModel.updateOne({ _id: assignmentId }, { status: "processing" });
        broadcastToUser(userId, { type: "assignment:processing", payload: { assignmentId } });

        let processedInput = { ...input };
        if (input.fileUrl && input.fileUrl.includes("amazonaws.com")) {
            const match = input.fileUrl.match(/\/uploads\/(.+)$/);
            if (match) {
                const key = decodeURIComponent(match[1]);
                const { getSignedUrlFromS3 } = await import("../services/s3.service");
                processedInput.fileUrl = await getSignedUrlFromS3(key);
                console.log(`[Worker] Generated presigned URL for S3 key: "${key}"`);
            }
        }

        const generatedPaper = await generateQuestions(processedInput);

        console.log(`[Worker] Generating PDF for assignment: ${assignmentId}`);
        const pdfBuffer = await generatePdfBuffer(
            processedInput.title,
            processedInput.subject,
            processedInput.totalMarks,
            generatedPaper
        );

        console.log(`[Worker] Uploading PDF to S3 for assignment: ${assignmentId}`);
        const pdfUrl = await uploadReportToS3(pdfBuffer, `${assignmentId}.pdf`);
        console.log(`[Worker] PDF uploaded to S3: ${pdfUrl}`);

        await AssignmentModel.updateOne({ _id: assignmentId }, {
            status: "completed",
            generatedPaper,
            pdfUrl,
        });
        const signedPdfUrl = await getPresignedUrl(pdfUrl);
        broadcastToUser(userId, { type: "assignment:completed", payload: { assignmentId, pdfUrl: signedPdfUrl } });
        return signedPdfUrl;
    } catch (error) {
        await AssignmentModel.updateOne({ _id: assignmentId }, {
            status: "failed",
            errorMessage: String(error)
        });
        broadcastToUser(userId, { type: "assignment:failed", payload: { assignmentId, error: String(error) } });
        throw error;
    }
}, {
    connection: redis
})


const queueEvents = new QueueEvents("question-generation", { connection: redis });

queueEvents.on('waiting', ({ jobId }) => {
    console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
    console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.log(`${jobId} has failed with reason ${failedReason}`);
});


queueEvents.on('progress', ({ jobId, data }, timestamp) => {
    console.log(`${jobId} reported progress ${data} at ${timestamp}`);
});
