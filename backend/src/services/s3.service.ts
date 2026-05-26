import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3";
import { env } from "../config/env";

export async function uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string> {
    await s3Client.send(new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: `uploads/${key}`,
        Body: buffer,
        ContentType: mimetype,
    }));
    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/uploads/${key}`;
}

export async function getSignedUrlFromS3(key: string) {
    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: `uploads/${key}`
    })

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return url;
    } catch (err) {
        console.error("Error creating signed URL", err);
        throw err;
    }
}

export async function uploadReportToS3(buffer: Buffer, filename: string): Promise<string> {
    const key = `generated-pdfs/${filename}`;
    await s3Client.send(new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
    }));
    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

function getS3KeyFromUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        return decodeURIComponent(parsed.pathname.substring(1));
    } catch {
        return null;
    }
}

export async function getPresignedUrl(s3Url: string): Promise<string> {
    if (!s3Url) return s3Url;
    const key = getS3KeyFromUrl(s3Url);
    if (!key) return s3Url;

    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key
    });

    try {
        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (err) {
        console.error("Error creating signed URL for", s3Url, err);
        return s3Url;
    }
}