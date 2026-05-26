import { Worker } from "bullmq";
import { redis } from "../config/redis"
import { QueueEvents } from 'bullmq';
import { generateQuestions } from '../services/llm.service';
import { AssignmentModel } from "../models/assignment";
import { broadcastToUser } from "../websocket/ws-manager";

const worker = new Worker("question-generation", async (job) => {
    const { jobId: assignmentId, userId, ...input } = job.data;
    try {
        await AssignmentModel.updateOne({ _id: assignmentId }, { status: "processing" });
        broadcastToUser(userId, { type: "assignment:processing", payload: { assignmentId } });

        const generatedPaper = await generateQuestions(input);

        await AssignmentModel.updateOne({ _id: assignmentId }, {
            status: "completed",
            generatedPaper,
        });
        broadcastToUser(userId, { type: "assignment:completed", payload: { assignmentId } });
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


const queueEvents = new QueueEvents("question-generation");

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
