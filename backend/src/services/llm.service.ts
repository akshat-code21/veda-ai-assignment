import OpenAI from "openai";
import { env } from "../config/env";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
})

const QuestionSchema = z.object({
    number: z.number(),
    text: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    marks: z.number(),
    type: z.string(),
    options: z.array(z.string()).optional(),
    answer: z.string().optional(),
});

const SectionSchema = z.object({
    title: z.string(),
    instruction: z.string(),
    questions: z.array(QuestionSchema),
});

const GeneratedPaperSchema = z.object({
    sections: z.array(SectionSchema),
});

export type GeneratedPaper = z.infer<typeof GeneratedPaperSchema>;

export interface GenerationInput {
    title: string;
    subject: string;
    dueDate: Date;
    questionTypes: any;
    numberOfQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    fileUrl?: string;
}

export async function generateQuestions(input: GenerationInput): Promise<GeneratedPaper> {
    const marksPerQuestion = Math.round(input.totalMarks / input.numberOfQuestions);

    let formattedQuestionTypes = input.questionTypes;
    if (Array.isArray(input.questionTypes)) {
        formattedQuestionTypes = input.questionTypes
            .map((qt: any) => `${qt.numQuestions} ${qt.label} (${qt.marks} mark${qt.marks > 1 ? "s" : ""} each)`)
            .join(", ");
    }

    const systemPrompt = `You are an expert teacher and question paper designer. 
Your task is to generate a structured question paper in valid JSON format only — no markdown, no explanation, just raw JSON.
The JSON must strictly match this schema:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "difficulty": "easy" | "medium" | "hard",
          "marks": 2,
          "type": "mcq" | "short" | "long" | "true_false" | "diagram" | "numerical" | "other",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],  // only for MCQ
          "answer": "Ideal model answer or answer key explanation for this question"
        }
      ]
    }
  ]
}
Always include "options" only for MCQ type questions. Never include it for other types. Always provide an answer in the "answer" field for all questions.`;

    let structureInstruction = "";
    if (Array.isArray(input.questionTypes)) {
        const sectionsList = input.questionTypes
            .map((qt: any, index: number) => {
                const letter = String.fromCharCode(65 + index);
                return `- Section ${letter}: Title MUST be exactly "${qt.label}". It MUST contain exactly ${qt.numQuestions} questions, each worth exactly ${qt.marks} mark${qt.marks > 1 ? "s" : ""}. The questions in this section must be of type "${qt.label}".`;
            })
            .join("\n");

        structureInstruction = `You MUST organize the question paper into exactly ${input.questionTypes.length} sections in this precise order:
${sectionsList}

Ensure the number of questions and marks in each section match this specification exactly. Within each section, distribute the questions such that you have a healthy mix of easy, medium, and hard difficulty levels where appropriate.`;
    } else {
        structureInstruction = `Organise questions into logical sections (e.g. Section A, Section B) based on difficulty:
- Easy questions first (~30% of total)
- Medium questions next (~50% of total)
- Hard questions last (~20% of total)`;
    }

    const userPrompt = `Generate a question paper with the following requirements:

- Subject: ${input.subject}
- Title: ${input.title}
- Question Type: ${formattedQuestionTypes}
- Total Questions: ${input.numberOfQuestions}
- Total Marks: ${input.totalMarks}${String(formattedQuestionTypes).includes("each") ? " (allocate marks as specified in the Question Type specification below)" : ` (approx ${marksPerQuestion} marks per question)`}
- Due Date: ${new Date(input.dueDate).toLocaleDateString()}
${input.additionalInstructions ? `- Additional Instructions: ${input.additionalInstructions}` : ""}

${structureInstruction}

${input.fileUrl ? "A reference document has been provided. Base questions on its content where possible." : "Generate questions appropriate for the subject and level."}

Return ONLY valid JSON matching the schema. No preamble, no markdown.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: input.fileUrl
                ? `${userPrompt}\n\nReference Document URL: ${input.fileUrl}`
                : userPrompt,
        },
    ];

    let response;
    try {
        response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            response_format: { "type": "json_object" }
        })
    } catch (err: any) {
        console.error("Error calling OpenAI:", err);
        throw err;
    }

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("LLM returned an empty response");

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error(`LLM returned invalid JSON: ${raw.slice(0, 200)}`);
    }

    const validated = GeneratedPaperSchema.safeParse(parsed);
    if (!validated.success) {
        throw new Error(`LLM output failed schema validation: ${validated.error.message}`);
    }

    return validated.data;
}