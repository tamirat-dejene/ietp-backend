import multer from "multer";
import path from "path";
// logger middleware to log requests
const logger = (req, _, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("-----------------------------------------------");
    next();
};
// multer storage configuration for images uploaded from the ardunio client
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, path.join(path.resolve(), "public/uploads"));
    },
    filename: function (_, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const format_api_response = (data) => {
    let results = data.results;
    return {
        licence_plate: results.length === 0 ? "No plate detected" : results[0].plate,
    };
};
export { logger, storage, format_api_response };
