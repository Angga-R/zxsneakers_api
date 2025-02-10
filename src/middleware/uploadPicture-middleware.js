import multer from "multer";
import { ResponseError } from "../utils/error_handler/response.error.js";

const filterImg = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // limit file 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ResponseError(400, "not image file"));
    }
  },
});

export { filterImg };
