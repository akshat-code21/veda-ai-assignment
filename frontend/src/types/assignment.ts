export interface QuestionTypeConfig {
    label: string;
    numQuestions: number;
    marks: number;
}

export interface Assignment {
    _id: string;
    userId: string;
    title: string;
    subject: string;
    assignedDate: string;
    dueDate: string;            // ISO date string
    questionTypes: QuestionTypeConfig[] | string;
    numberOfQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    fileUrl?: string;           // presigned S3 URL
    pdfUrl?: string;            // presigned S3 URL for generated PDF
    status: "pending" | "processing" | "completed" | "failed";
    errorMessage?: string;
    generatedPaper?: {
        sections: {
            title: string;
            instruction: string;
            questions: {
                number: number;
                text: string;
                difficulty: "easy" | "medium" | "hard";
                marks: number;
                type: string;
                options?: string[];
                answer?: string;
            }[];
        }[];
    };
}
