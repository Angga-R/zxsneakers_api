import { CloudS3 } from "../libs/cloud.s3.js";
import { ResponseError } from "../utils/error_handler/response.error.js";
import userValidation from "../utils/validations/user.validation.js";
import { validate } from "../utils/validations/validate.js";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";

class UserService {
  #user = new UserRepository();
  #cloudStorage = new CloudS3();

  async getUserDetail(email) {
    return this.#user.findByEmail(email, false);
  }

  async updatePassword(request, email) {
    // check old password
    const user = await this.#user.findByEmail(email, true);

    let comparePassword = await bcrypt.compare(
      request.oldPassword,
      user.password
    );

    if (!comparePassword) {
      throw new ResponseError(400, "incorrect old password", "oldPassword");
    }

    const password = validate(userValidation.updatePassword, request);

    // check confirmPassword
    if (password.confirmPassword !== password.newPassword) {
      throw new ResponseError(
        400,
        "confirm password not same",
        "confirmPassword"
      );
    }

    comparePassword = await bcrypt.compare(password.newPassword, user.password);

    // if newPassword = current password, dont do query
    if (comparePassword) {
      return;
    }

    // encrypt new password
    const encryptedPassword = await bcrypt.hash(password.newPassword, 10);

    await this.#user.updatePassword(email, encryptedPassword);
  }

  async updateName(email, newName) {
    newName = validate(userValidation.updateName, newName);

    await this.#user.updateName(email, newName);
  }

  async updateAvatar(email, image) {
    if (!image) {
      throw new ResponseError(400, "image required");
    }

    const user = await this.#user.findByEmail(email, false);

    // delete old avatar in cloud storage
    if (user.avatar) {
      await this.#cloudStorage.deleteAvatarUser(user.avatar);
    }

    // upload new avatar to cloud storage
    const url = await this.#cloudStorage.uploadAvatarUser(image);

    // update avatar url
    await this.#user.updateAvatar(email, url);
  }
}

export default new UserService();
