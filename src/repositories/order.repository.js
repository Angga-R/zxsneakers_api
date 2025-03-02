import { prismaClient } from "../config/mysql.config.js";

class OrderRepository {
  async add(data) {
    await prismaClient.order.create({
      data: data,
    });
  }

  async updateStatus(id, status) {
    await prismaClient.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  }

  async findByEmail(email) {
    return prismaClient.order.findMany({
      where: {
        user_email: email,
      },
      include: {
        Order_detail: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findByStatus(status) {
    return prismaClient.order.findMany({
      where: {
        status: status,
      },
      include: {
        address: {
          select: {
            postal_code: true,
            street: true,
            sub_distric: true,
            city: true,
            province: true,
          },
        },
        Order_detail: {
          select: {
            product_id: true,
            price_item: true,
            quantity: true,
            product: {
              select: {
                name: true,
                color: true,
                size: true,
                Product_image: {
                  select: {
                    link: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByIdAndEmail(id, email) {
    return prismaClient.order.findUnique({
      where: {
        id: id,
        user_email: email,
      },
      include: {
        address: {
          select: {
            postal_code: true,
            street: true,
            sub_distric: true,
            city: true,
            province: true,
          },
        },
        Order_detail: {
          select: {
            product_id: true,
            price_item: true,
            quantity: true,
            product: {
              select: {
                name: true,
                color: true,
                size: true,
                Product_image: {
                  select: {
                    link: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}

export { OrderRepository };
