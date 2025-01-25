import multer from "multer";
import { ResponseError } from "../error-handler/response-error.js";
import { bucketName, s3 } from "../app/cloud-config.js";

const filterImg = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // limit file 3MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ResponseError(400, "not image file"));
    }
  },
});

const upload = (req, res, next) => {
  try {
    const parameter = {
      Bucket: bucketName,
      Key: `uploads/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.upload(parameter, (err, data) => {
      if (!err) {
        req.file.cloudUrl = data.Location;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};

export { filterImg, upload };
