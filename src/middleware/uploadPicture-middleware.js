import multer from "multer";
import { ResponseError } from "../error-handler/response-error.js";
import moment from "moment";

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ResponseError(400, "not image file"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/assets/");
  },
  filename: (req, file, cb) => {
    cb(null, `${moment().format("yyyy-MM-DD")}-name-${file.originalname}`);
  },
});

export const uploadPicture = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // limit file 3MB
});
