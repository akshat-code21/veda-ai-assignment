import multer from "multer";
import { env } from "../config/env";
import type { Request } from "express";
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    try {
        console.log(`[Upload Middleware] Received file: "${file.originalname}", MIME: "${file.mimetype}"`);

        const allowedMimeTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream'
        ];

        const allowedExtensions = /\.(pdf|txt|doc|docx)$/i;

        const ext = path.extname(file.originalname).toLowerCase();
        const isMimeValid = allowedMimeTypes.includes(file.mimetype) || !file.mimetype;
        const isExtValid = allowedExtensions.test(ext);

        if (isMimeValid && isExtValid) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type! Only PDF, TXT, DOC, and DOCX are allowed.`));
        }
    } catch (error) {
        console.error(error)
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },

})

export const uploadMiddleware = upload.single("source_file")