import { Queue } from "bullmq"
import { randomUUID } from "crypto";
import { redis } from "../config/redis"

const queue = new Queue("question-generation", {
    connection: redis
});

export interface JobPayload {
    userId: string;
    title: string;
    subject: string;
    dueDate: Date;
    questionTypes: "mcq" | "short" | "long" | "true_false";
    numberOfQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    fileUrl?: string;
    status: "pending" | "processing" | "completed" | "failed";
    generatedPaper?: {
        sections: [{
            title: string;
            instruction: string;
            questions: [{
                number: number;
                text: string;
                difficulty: "easy" | "medium" | "hard";
                marks: number;
                type: string;
                options?: string[];
            }]
        }]
    };
    jobId?: string;
    errorMessage?: string;
}



export async function addJob(data: JobPayload) {
    await queue.add(`question-generation-${randomUUID()}`, data, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: true,
    });
}