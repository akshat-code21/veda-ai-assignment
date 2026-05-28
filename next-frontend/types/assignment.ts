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
    dueDate: string;
    questionTypes: QuestionTypeConfig[] | string;
    numberOfQuestions: number;
    totalMarks: number;
    timeAllowed?: string;
    additionalInstructions?: string;
    fileUrl?: string;
    pdfUrl?: string;
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
