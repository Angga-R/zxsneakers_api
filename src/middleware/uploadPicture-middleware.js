import multer from "multer";
import { ResponseError } from "../error-handler/response-error.js";

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ResponseError(400, "not image file"));
  }
};

export const uploadPicture = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // limit file 3MB
});
