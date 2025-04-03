import AWS from "aws-sdk";
import "dotenv";

const bucketName = "zx-sneakers-bucket";

async function uploadAvatarUser(image) {
  const s3 = new AWS.S3({
    endpoint: process.env.CLOUD_R2_ENDPOINT,
    accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
    region: "auto",
  });
  const parameter = {
    Bucket: bucketName,
    Key: `uploads/avatar/${Date.now()}_${image.originalname}`,
    Body: image.buffer,
    ContentType: image.mimetype,
  };

  const url = await s3
    .upload(parameter, (err, data) => {
      if (!err) {
        return data;
      }
    })
    .promise();

  return url.Location;
}

async function deleteAvatarUser(linkImg) {
  const s3 = new AWS.S3({
    endpoint: process.env.CLOUD_R2_ENDPOINT,
    accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
    region: "auto",
  });
  const key = linkImg.split(".com/")[1];

  const parameter = {
    Bucket: bucketName,
    Key: key,
  };

  await s3.deleteObject(parameter).promise();
}

async function uploadProductImages(images) {
  const s3 = new AWS.S3({
    endpoint: process.env.CLOUD_R2_ENDPOINT,
    accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
    region: "auto",
  });
  const urls = [];
  const uploadPromises = images.map((file) => {
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
  return urls;
}

async function deleteProductImages(urls, isMoreThanOne) {
  const s3 = new AWS.S3({
    endpoint: process.env.CLOUD_R2_ENDPOINT,
    accessKeyId: process.env.CLOUD_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_R2_SECRET_KEY,
    region: "auto",
  });
  if (isMoreThanOne) {
    urls.map(async (url) => {
      const parameter = {
        Bucket: bucketName,
        Key: url.split(".com/")[1],
      };
      await s3.deleteObject(parameter).promise();
    });
  } else {
    const key = urls.split(".com/")[1];

    const parameter = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(parameter).promise();
  }
}

export default {
  uploadAvatarUser,
  deleteAvatarUser,
  uploadProductImages,
  deleteProductImages,
};
