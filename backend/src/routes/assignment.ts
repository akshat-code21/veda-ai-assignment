import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { AssignmentModel } from "../models/assignment";
import { getPresignedUrl, uploadFile } from "../services/s3.service";
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

    const { title, subject, dueDate, questionTypes, numberOfQuestions, totalMarks, additionalInstructions } = req.body;

    const assignment = new AssignmentModel({
        userId: res.locals.session.session.userId,
        title,
        subject,
        dueDate,
        questionTypes,
        numberOfQuestions,
        totalMarks,
        additionalInstructions,
        fileUrl
    });


    await assignment.save();
    addJob({
        userId: res.locals.session.session.userId,
        title: assignment.title!,
        subject: assignment.subject!,
        dueDate: assignment.dueDate!,
        questionTypes: assignment.questionTypes!,
        numberOfQuestions: assignment.numberOfQuestions!,
        totalMarks: assignment.totalMarks!,
        additionalInstructions: assignment.additionalInstructions!,
        fileUrl: assignment.fileUrl!,
        status: "pending",
        jobId: assignment._id.toString()
    })

    const responseData = assignment.toObject();
    if (responseData.fileUrl) {
        responseData.fileUrl = await getPresignedUrl(responseData.fileUrl);
    }
    res.status(201).json(responseData);
});


assignmentRouter.get("/", async (req, res) => {
    console.log(res.locals.session.session);
    const { userId } = res.locals.session.session
    const assignments = await AssignmentModel.find({ userId }).lean();

    const signedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
            if (assignment.fileUrl) {
                assignment.fileUrl = await getPresignedUrl(assignment.fileUrl);
            }
            if (assignment.pdfUrl) {
                assignment.pdfUrl = await getPresignedUrl(assignment.pdfUrl);
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
        assignment.fileUrl = await getPresignedUrl(assignment.fileUrl);
    }
    if (assignment.pdfUrl) {
        assignment.pdfUrl = await getPresignedUrl(assignment.pdfUrl);
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

    await AssignmentModel.updateOne({ _id: id }, { status: "pending", generatedPaper: undefined });
    await addJob({
        userId: res.locals.session.session.userId,
        title: assignment.title!,
        subject: assignment.subject!,
        dueDate: assignment.dueDate!,
        questionTypes: assignment.questionTypes!,
        numberOfQuestions: assignment.numberOfQuestions!,
        totalMarks: assignment.totalMarks!,
        additionalInstructions: assignment.additionalInstructions!,
        fileUrl: assignment.fileUrl!,
        jobId: id,
        status: "pending"
    });
    return res.status(200).json({ message: "Regeneration started" });
})

export default assignmentRouter