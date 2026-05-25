import multer from "multer";
import { env } from "../config/env";
import type { Request } from "express";
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, env.UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const allowedExtensions = /pdf|txt|doc|docx/;

    const isMimeValid = allowedMimeTypes.includes(file.mimetype);
    const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (isMimeValid && isExtValid) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only PDF, TXT, DOC, and DOCX are allowed.'));
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },

})

const uploadMiddleware = upload.single("source_file")