import PDFDocument from "pdfkit";
import type { GeneratedPaper } from "./llm.service";
import fs from "fs";
import path from "path";

const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");

async function ensureFontsExist() {
    if (!fs.existsSync(FONTS_DIR)) {
        fs.mkdirSync(FONTS_DIR, { recursive: true });
    }

    const fontUrls = {
        "Inter-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
        "Inter-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
        "Inter-Italic.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Italic%5Bopsz%2Cwght%5D.ttf"
    };

    for (const [filename, url] of Object.entries(fontUrls)) {
        const filePath = path.join(FONTS_DIR, filename);
        if (!fs.existsSync(filePath)) {
            console.log(`[Fonts] Downloading ${filename} from Google Fonts...`);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to download ${filename}: ${res.statusText}`);
            const buffer = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            console.log(`[Fonts] Downloaded ${filename} successfully.`);
        }
    }
}

function getDifficultyTag(diff: string): string {
    switch (diff.toLowerCase()) {
        case "easy": return "[Easy]";
        case "medium": return "[Moderate]";
        case "hard": return "[Challenging]";
        default: return "[Moderate]";
    }
}

export async function generatePdfBuffer(
    title: string,
    subject: string,
    totalMarks: number,
    paper: GeneratedPaper
): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
        try {
            // Ensure font files exist before creating the PDF document
            await ensureFontsExist();

            const doc = new PDFDocument({ margin: 50, bufferPages: true });
            const buffers: Buffer[] = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));

            doc.registerFont("Inter", path.join(FONTS_DIR, "Inter-Regular.ttf"));
            doc.registerFont("Inter-Bold", path.join(FONTS_DIR, "Inter-Bold.ttf"));
            doc.registerFont("Inter-Italic", path.join(FONTS_DIR, "Inter-Italic.ttf"));

            doc.fillColor("#222222");
            doc.fontSize(18).font("Inter-Bold").text(title, { align: "center" });
            doc.moveDown(0.2);
            doc.fontSize(12).font("Inter-Bold").text(`Subject: ${subject}`, { align: "center" });
            doc.moveDown(0.2);

            const titleClassMatch = title.match(/class\s*:\s*([^\s]+)/i) || title.match(/class\s+([^\s]+)/i);
            const classText = titleClassMatch ? `Class: ${titleClassMatch[1]}` : "";
            doc.fontSize(12).font("Inter-Bold").text(classText, { align: "center" });
            doc.moveDown(1);

            const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const timeAllowed = totalQuestions <= 5 ? "30 minutes" : totalQuestions <= 10 ? "45 minutes" : "1 Hour";

            const startY = doc.y;
            doc.fontSize(10.5).font("Inter-Bold")
                .text(`Time Allowed: ${timeAllowed}`, 50, startY, { align: "left" });
            doc.text(`Maximum Marks: ${totalMarks}`, 50, startY, { align: "right" });
            doc.moveDown(1.5);

            doc.fontSize(10.5).font("Inter-Bold").text("All questions are compulsory unless stated otherwise.", { align: "left" });
            doc.moveDown(1.2);

            doc.fontSize(10.5).font("Inter-Bold");
            doc.text("Name: ______________________");
            doc.moveDown(0.3);
            doc.text("Roll Number: ________________");
            doc.moveDown(0.3);
            doc.text(`${classText} Section: ___________`);
            doc.moveDown(2);

            for (const section of paper.sections) {
                if (doc.y > 650) doc.addPage();
                doc.fontSize(14).font("Inter-Bold").text(section.title, { align: "center" });
                doc.moveDown(0.6);

                const isMcq = section.questions.some(q => q.type === "mcq");
                const sectionDesc = isMcq ? "Multiple Choice Questions" : "Short Answer Questions";

                doc.fontSize(11).font("Inter-Bold").text(sectionDesc);
                if (section.instruction) {
                    doc.fontSize(9.5).font("Inter-Italic").fillColor("#555555").text(section.instruction, { lineGap: 3 });
                }
                doc.fillColor("#222222");
                doc.moveDown(0.8);

                for (const question of section.questions) {
                    if (doc.y > 700) doc.addPage();

                    doc.fontSize(10).font("Inter");
                    doc.text(`${question.number}. `, { continued: true });
                    doc.text(`${getDifficultyTag(question.difficulty)} `, { continued: true });
                    doc.text(question.text, { continued: true });
                    doc.font("Inter-Bold").text(`   [${question.marks} Marks]`);
                    doc.moveDown(0.4);

                    if (question.options && question.options.length > 0) {
                        for (const option of question.options) {
                            if (doc.y > 730) doc.addPage();
                            doc.fontSize(9.5).font("Inter").fillColor("#444444").text(`      ${option}`, { lineGap: 2 });
                        }
                        doc.fillColor("#222222");
                        doc.moveDown(0.4);
                    }
                    doc.moveDown(0.5);
                }
                doc.moveDown(1);
            }

            if (doc.y > 720) doc.addPage();
            doc.fontSize(10).font("Inter-Bold").text("End of Question Paper");
            doc.moveDown(2);

            doc.addPage();
            doc.fontSize(14).font("Inter-Bold").text("Answer Key:", { align: "left" });
            doc.moveDown(1);

            for (const section of paper.sections) {
                for (const question of section.questions) {
                    if (doc.y > 700) doc.addPage();

                    doc.fontSize(10).font("Inter-Bold").text(`${question.number}. `, { continued: true });
                    doc.font("Inter").fillColor("#333333");
                    if (question.answer) {
                        doc.text(question.answer);
                    } else {
                        doc.font("Inter-Italic").text("No ideal answer provided.");
                    }
                    doc.fillColor("#222222");
                    doc.moveDown(0.8);
                }
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
