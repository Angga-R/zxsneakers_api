import {
  getAvatarService,
  updateAvatarService,
  updateNameService,
  updatePasswordService,
} from "../services/user-service.js";
import path from "path";

const updatePasswordController = async (req, res, next) => {
  try {
    await updatePasswordService(req.body, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateNameController = async (req, res, next) => {
  try {
    await updateNameService(req.body.newName, req.userEmail);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateAvatarController = async (req, res, next) => {
  try {
    await updateAvatarService(req.file, req.userEmail);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getAvatarController = async (req, res, next) => {
  try {
    const result = await getAvatarService(req.userEmail);
    if (!result) {
      // send default profile image
      const photoPath = path.join(
        process.cwd(),
        "assets",
        "user-profile-image",
        "default-profile-photo.jpg"
      );

      res.sendFile(photoPath);
    } else {
      res.setHeader("Content-Type", result.format);
      res.send(result.data_image);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  updatePasswordController,
  updateNameController,
  updateAvatarController,
  getAvatarController,
};
