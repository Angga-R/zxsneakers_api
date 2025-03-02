import { prismaClient } from "../config/mysql.config.js";

class AdminRepository {
  async getData() {
    return prismaClient.admin.findFirst();
  }

  async updatePassword(email, password) {
    await prismaClient.admin.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
  }
}

export { AdminRepository };
