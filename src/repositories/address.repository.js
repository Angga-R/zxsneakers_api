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

  async findById(id, email, isIncludeName) {
    const query = {
      where: {
        id: id,
        user_email: email,
      },
    };

    if (isIncludeName) {
      query["include"] = {
        user: {
          select: {
            name: true,
          },
        },
      };
    }

    return prismaClient.address.findFirst(query);
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
