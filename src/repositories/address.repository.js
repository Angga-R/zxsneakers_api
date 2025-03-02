import { prismaClient } from "../config/mysql.config.js";

class AddressRepository {
  async add(email, data) {
    const queryData = {
      user_email: email,
      ...data,
    };

    await prismaClient.address.create({
      data: queryData,
    });
  }

  async findByEmail(email) {
    return prismaClient.address.findMany({
      where: {
        user_email: email,
      },
    });
  }

  async findByIdAndEmail(id, email) {
    return prismaClient.address.findFirst({
      where: {
        id: id,
        user_email: email,
      },
    });
  }

  async update(id, email, data) {
    await prismaClient.address.update({
      where: {
        id: id,
        user_email: email,
      },
      data: data,
    });
  }

  async delete(id, email) {
    await prismaClient.address.delete({
      where: {
        id: id,
        user_email: email,
      },
    });
  }
}

export { AddressRepository };
