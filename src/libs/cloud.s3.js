import AWS from "aws-sdk";
import "dotenv";

class CloudS3 {
  s3 = new AWS.S3({
    endpoint: process.env.CLOUD_R2_ENDPOINT,
    accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
    region: "auto",
  });

  bucketName = "zx-sneakers-bucket";

  async uploadAvatarUser(image) {
    const parameter = {
      Bucket: this.bucketName,
      Key: `uploads/avatar/${Date.now()}_${image.originalname}`,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const url = await this.s3
      .upload(parameter, (err, data) => {
        if (!err) {
          return data;
        }
      })
      .promise();

    return url.Location;
  }

  async deleteAvatarUser(linkImg) {
    const key = linkImg.split(".com/")[1];

    const parameter = {
      Bucket: this.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(parameter).promise();
  }

  async uploadProductImages(images) {
    const urls = [];
    const uploadPromises = images.map((file) => {
      const parameter = {
        Bucket: this.bucketName,
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
    return urls;
  }

  async deleteProductImages(urls, isMoreThanOne) {
    if (isMoreThanOne) {
      urls.map(async (url) => {
        const parameter = {
          Bucket: this.bucketName,
          Key: url.split(".com/")[1],
        };
        await this.s3.deleteObject(parameter).promise();
      });
    } else {
      const key = urls.split(".com/")[1];

      const parameter = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(parameter).promise();
    }
  }
}

export const s3 = new AWS.S3({
  endpoint: process.env.CLOUD_R2_ENDPOINT,
  accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
  secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
  region: "auto",
});

export const bucketName = "zx-sneakers-bucket";

export { CloudS3 };
