import mongoose from "mongoose"

const AssignmentSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String },
    subject: { type: String },
    dueDate: { type: Date },
    questionTypes: { type: String, enum: ["mcq", "short", "long", "true_false"], default: "mcq" },
    numberOfQuestions: { type: Number },
    totalMarks: { type: Number },
    additionalInstructions: { type: String },
    fileUrl: { type: String },
    status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
    generatedPaper: {
        sections: [{
            title: { type: String },
            instruction: { type: String },
            questions: [{
                number: { type: Number },
                text: { type: String },
                difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
                marks: { type: Number },
                type: { type: String },
                options: [String],
            }]
        }]
    },
    jobId: { type: String },
    errorMessage: { type: String },
}
)

export const AssignmentModel = mongoose.model("Assignment", AssignmentSchema);
