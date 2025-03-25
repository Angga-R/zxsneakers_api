import { prismaClient } from "../config/mysql.config.js";

class UserRepository {
  async add(email, name, encryptedPassword) {
    await prismaClient.user.create({
      data: {
        email: email,
        name: name,
        password: encryptedPassword,
      },
    });
  }

  async findAll() {
    return prismaClient.user.findMany();
  }

  async findByEmail(email) {
    return prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async updateName(email, newName) {
    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        name: newName,
      },
    });
  }

  async updatePassword(email, newPassword) {
    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async updateAvatar(email, newAvatar) {
    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        avatar: newAvatar,
      },
    });
  }
}

export { UserRepository };
