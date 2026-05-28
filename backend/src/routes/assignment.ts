import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { AssignmentModel } from "../models/assignment";
import { getCloudFrontUrl, uploadFile } from "../services/s3.service";
import { addJob } from "../queues/generation.queue";
import { uploadMiddleware } from "../middleware/upload.middleware";

const assignmentRouter = Router();

assignmentRouter.use(authMiddleware);

assignmentRouter.post("/", uploadMiddleware, async (req, res) => {
    let fileUrl: string | undefined;
    if (req.file) {
        const key = `${Date.now()}-${req.file.originalname}`;
        fileUrl = await uploadFile(req.file.buffer, key, req.file.mimetype);
    }

    const { title, subject, assignedDate, dueDate, questionTypes, numberOfQuestions, totalMarks, timeAllowed, additionalInstructions } = req.body;

    const parseDateString = (dateStr: any): Date | undefined => {
        if (!dateStr) return undefined;
        const match = String(dateStr).match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (match) {
            const [, day, month, year] = match;
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    let parsedQuestionTypes = questionTypes;
    if (typeof questionTypes === "string") {
        try {
            parsedQuestionTypes = JSON.parse(questionTypes);
        } catch {
            parsedQuestionTypes = questionTypes;
        }
    }

    const assignment = new AssignmentModel({
        userId: res.locals.session.session.userId,
        title,
        subject,
        dueDate: parseDateString(dueDate),
        assignedDate: parseDateString(assignedDate),
        questionTypes: parsedQuestionTypes,
        numberOfQuestions,
        totalMarks,
        timeAllowed,
        additionalInstructions,
        fileUrl
    });


    await assignment.save();
    addJob({
        userId: res.locals.session.session.userId,
        title: assignment.title!,
        subject: assignment.subject!,
        dueDate: assignment.dueDate!,
        assignedDate: assignment.assignedDate!,
        questionTypes: assignment.questionTypes!,
        numberOfQuestions: assignment.numberOfQuestions!,
        totalMarks: assignment.totalMarks!,
        timeAllowed: (assignment as any).timeAllowed,
        additionalInstructions: assignment.additionalInstructions!,
        fileUrl: assignment.fileUrl!,
        status: "pending",
        jobId: assignment._id.toString()
    })

    const responseData = assignment.toObject();
    if (responseData.fileUrl) {
        responseData.fileUrl = await getCloudFrontUrl(responseData.fileUrl);
    }
    res.status(201).json(responseData);
});


assignmentRouter.get("/", async (req, res) => {
    const { userId } = res.locals.session.session
    const assignments = await AssignmentModel.find({ userId }).sort({ dueDate: -1 }).lean();

    const signedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
            if (assignment.fileUrl) {
                assignment.fileUrl = await getCloudFrontUrl(assignment.fileUrl);
            }
            if (assignment.pdfUrl) {
                assignment.pdfUrl = await getCloudFrontUrl(assignment.pdfUrl);
            }
            return assignment;
        })
    );

    res.status(200).json(signedAssignments);
})

assignmentRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = res.locals.session.session

    const assignment = await AssignmentModel.findOne({ _id: id, userId }).lean();

    if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.fileUrl) {
        assignment.fileUrl = await getCloudFrontUrl(assignment.fileUrl);
    }
    if (assignment.pdfUrl) {
        assignment.pdfUrl = await getCloudFrontUrl(assignment.pdfUrl);
    }

    return res.status(200).json(assignment);
})


// TODO
assignmentRouter.post("/:id/regenerate", async (req, res) => {
    const { id } = req.params;
    const { userId } = res.locals.session.session

    const assignment = await AssignmentModel.findOne({ _id: id, userId })

    if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
    }

    await AssignmentModel.updateOne({ _id: id }, {
        $set: { status: "pending" },
        $unset: { generatedPaper: 1, pdfUrl: 1, errorMessage: 1 }
    });
    await addJob({
        userId: res.locals.session.session.userId,
        title: assignment.title!,
        subject: assignment.subject!,
        dueDate: assignment.dueDate!,
        assignedDate: assignment.assignedDate!,
        questionTypes: assignment.questionTypes!,
        numberOfQuestions: assignment.numberOfQuestions!,
        totalMarks: assignment.totalMarks!,
        timeAllowed: (assignment as any).timeAllowed,
        additionalInstructions: assignment.additionalInstructions!,
        fileUrl: assignment.fileUrl!,
        jobId: id,
        status: "pending"
    });
    return res.status(200).json({ message: "Regeneration started" });
})

assignmentRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = res.locals.session.session;

    const result = await AssignmentModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Assignment not found or unauthorized" });
    }

    return res.status(200).json({ message: "Assignment deleted successfully" });
})

export default assignmentRouter