import { OpenRouter } from "@openrouter/sdk";
import { env } from "../config/env";
import { z } from "zod";

const openrouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY
});

const QuestionSchema = z.object({
    number: z.number(),
    text: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    marks: z.number(),
    type: z.string(),
    options: z.array(z.string()).optional(),
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
    questionTypes: string;
    numberOfQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    fileUrl?: string;
}

export async function generateQuestions(input: GenerationInput): Promise<GeneratedPaper> {
    const marksPerQuestion = Math.round(input.totalMarks / input.numberOfQuestions);

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
          "type": "mcq" | "short" | "long" | "true_false",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."]  // only for MCQ
        }
      ]
    }
  ]
}
Always include "options" only for MCQ type questions. Never include it for other types.`;

    const userPrompt = `Generate a question paper with the following requirements:

- Subject: ${input.subject}
- Title: ${input.title}
- Question Type: ${input.questionTypes}
- Total Questions: ${input.numberOfQuestions}
- Total Marks: ${input.totalMarks} (approx ${marksPerQuestion} marks per question)
- Due Date: ${new Date(input.dueDate).toLocaleDateString()}
${input.additionalInstructions ? `- Additional Instructions: ${input.additionalInstructions}` : ""}

Organise questions into logical sections (e.g. Section A, Section B) based on difficulty:
- Easy questions first (~30% of total)
- Medium questions next (~50% of total)
- Hard questions last (~20% of total)

${input.fileUrl ? "A reference document has been provided. Base questions on its content where possible." : "Generate questions appropriate for the subject and level."}

Return ONLY valid JSON matching the schema. No preamble, no markdown.`;

    const messages: Parameters<typeof openrouter.chat.send>[0]["chatRequest"]["messages"] = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: input.fileUrl
                ? [
                    { type: "text" as const, text: userPrompt },
                    { type: "file" as const, file: { fileData: input.fileUrl } },
                ]
                : userPrompt,
        },
    ];

    const response = await openrouter.chat.send({
        chatRequest: {
            model: "google/gemma-3-27b-it:free",
            messages,
            responseFormat: { type: "json_object" },
        }
    });

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