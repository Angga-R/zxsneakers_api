import AWS from "aws-sdk";
import "dotenv";

const s3 = new AWS.S3({
  endpoint: process.env.CLOUD_R2_ENDPOINT,
  accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
  secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
  region: "auto",
});

const bucketName = "zx-sneakers-bucket";

export { s3, bucketName };
