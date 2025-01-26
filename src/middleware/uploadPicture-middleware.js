import multer from "multer";
import { ResponseError } from "../error-handler/response-error.js";
import { bucketName, s3 } from "../app/cloud-config.js";

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

const upload = async (req, res, next) => {
  try {
    if (req.file) {
      const parameter = {
        Bucket: bucketName,
        Key: `uploads/avatar/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      s3.upload(parameter, (err, data) => {
        if (!err) {
          req.file.cloudUrl = data.Location;
        }
      });
    } else if (req.files) {
      const urls = [];

      const uploadPromises = req.files.map((file) => {
        const parameter = {
          Bucket: bucketName,
          Key: `uploads/product-images/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        return new Promise((resolve, reject) => {
          s3.upload(parameter, (err, data) => {
            if (!err) {
              urls.push(data.Location);
              resolve(data.Location);
            } else {
              reject(err);
            }
          });
        });
      });

      await Promise.all(uploadPromises);
      req.files.cloudUrl = urls;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { filterImg, upload };
