import { Request, Response, NextFunction } from "express";
import multer from "multer";
declare const logger: (req: Request, _: Response, next: NextFunction) => void;
declare const storage: multer.StorageEngine;
declare const format_api_response: (data: any) => {
    licence_plate: any;
};
export { logger, storage, format_api_response };
