import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Request, Response, NextFunction } from 'express';
import { FileArray, UploadedFile } from 'express-fileupload';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    format: string;
}

interface FileUploadRequest {
    files: FileArray | null | undefined;
    uploadedFiles?: string[];
}

const fileUpload = (folder: string) => {
    return async (req: Request & Partial<FileUploadRequest>, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.files || !req.files.files) {
                req.uploadedFiles = [];
                next();
                return;
            }

            const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

            const uploadPromises = files.map((file: UploadedFile) => {
                return new Promise<CloudinaryUploadResult>((resolve, reject) => {
                    const theTransformStream = cloudinary.uploader.upload_stream(
                        { folder: `TeamSync/${folder}` },
                        (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
                            if (error) {
                                reject(error);
                            } else if (result) {
                                resolve(result);
                            } else {
                                reject(new Error('Cloudinary upload failed with no error or result'));
                            }
                        }
                    );

                    const readableStream = Readable.from(file.data);
                    readableStream.pipe(theTransformStream);
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            console.log(uploadResults);

            req.uploadedFiles = uploadResults.map(result => `${result.public_id}.${result.format}`);
            console.log(req.uploadedFiles);
            next();
        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).send('File upload failed.');
        }
    };
};

export default fileUpload;