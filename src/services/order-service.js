import Midtrans from "midtrans-client";
import { prismaClient } from "../config/mysql.config.js";
import { redisClient } from "../config/redis.config.js";
import { validate } from "../utils/validations/validate.js";
import orderValidation from "../utils/validations/order.validation.js";
import "dotenv";
import moment from "moment";
import { ResponseError } from "../utils/error_handler/response.error.js";
import { v4 as uuid } from "uuid";

const createOrderService = async (request, userEmail) => {
  const validatedData = validate(orderValidation.create, request);
  const data = [];
  let product;

  validatedData.items.map(async (item) => {
    product = await prismaClient.product.findFirst({
      where: {
        id: item.productId,
      },
      include: {
        created_at: false,
        updated_at: false,
      },
    });
    if (product.stock < item.quantity) {
      throw new ResponseError(
        400,
        "quantity more than available stock",
        "quantity"
      );
    }
    data.push(product);
  });
  // find user include address
  const address = await prismaClient.address.findUnique({
    where: {
      id: validatedData.addressId,
      user_email: userEmail,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // connect to Midtrans
  const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const item_details = [];
  const gross_amount = [];

  for (let i = 0; i < validatedData.items.length; i++) {
    item_details.push({
      name: data[i].name,
      price: data[i].price,
      quantity: validatedData.items[i].quantity,
    });
    gross_amount.push(data[i].price * validatedData.items[i].quantity);
  }

  const order_id = uuid().toString();

  const parameter = {
    item_details: item_details,
    transaction_details: {
      order_id: order_id,
      gross_amount: gross_amount.reduce((acc, curr) => acc + curr),
    },
    customer_details: {
      first_name: address.user.name,
      email: address.user_email,
      phone: address.no_telp,
      billing_address: {
        address: address.street + " " + address.sub_distric,
        city: address.city,
        postal_code: address.postal_code,
      },
      shipping_address: {
        address: address.street + " " + address.sub_distric,
        city: address.city,
        postal_code: address.postal_code,
      },
    },

    enabled_payments: [
      "bca_va",
      "bni_va",
      "bri_va",
      "gopay",
      "indomaret",
      "shopeepay",
      "other_qris",
    ],

    shopeepay: {
      callback_url: "http://shopeepay.com",
    },
    gopay: {
      enable_callback: true,
      callback_url: "http://gopay.com",
    },
    callbacks: {
      finish: validatedData.finishUrl,
      error: "https://demo.midtrans.com",
    },
    expiry: {
      start_time: moment().format("yyyy-MM-DD HH:mm:ss Z"),
      unit: "minutes",
      duration: 5,
    },
    page_expiry: {
      duration: 5,
      unit: "minutes",
    },
  };

  const token = await snap.createTransactionToken(parameter);
  const snap_url = "https://app.sandbox.midtrans.com/snap/snap.js";

  // add data order to redis
  let key;
  for (let i = 0; i < data.length; i++) {
    key = `${order_id}-${i + 1}`;
    await redisClient.hset(key, {
      product_id: data[i].id,
      price_item: data[i].price,
      quantity: validatedData.items[i].quantity,
      subtotal: gross_amount[i],
      address_id: address.id,
    });
    await redisClient.expire(key, 3660);
  }

  return {
    snap_token: token,
    snap_url: snap_url,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  };
};

const transactionSuccessService = async (order_id, userEmail) => {
  // check in redis order_id with data order
  const checkOrderKeys = await redisClient.keys(`${order_id}*`);

  if (checkOrderKeys.length > 0) {
    const queryData = {
      id: order_id,
      user_email: userEmail,
      price_total: 0,
      created_at: new Date(),
      status: "accepting",
      address_id: 0,
      Order_detail: {
        createMany: {
          data: [],
        },
      },
    };
    let data;
    for (const key of checkOrderKeys) {
      data = await redisClient.hgetall(key);
      queryData.Order_detail.createMany.data.push({
        product_id: Number(data.product_id),
        price_item: Number(data.price_item),
        quantity: Number(data.quantity),
        subtotal: Number(data.subtotal),
      });
      queryData.address_id = Number(data.address_id);
    }

    const priceTotal = queryData.Order_detail.createMany.data.reduce(
      (prevValue, currValue) => prevValue + currValue.subtotal,
      0
    );

    queryData.price_total = priceTotal;

    const addToDatabase = await prismaClient.order.create({
      data: queryData,
    });

    if (addToDatabase) {
      // update stock
      for (let i = 0; i < checkOrderKeys.length; i++) {
        await prismaClient.product.update({
          where: {
            id: queryData.Order_detail.createMany.data[i].product_id,
          },
          data: {
            stock: {
              decrement: queryData.Order_detail.createMany.data[i].quantity,
            },
          },
        });
        // delete data order from redis
        await redisClient.del(checkOrderKeys[i]);
      }
    }
  } else {
    throw new ResponseError(404, "data not found");
  }
};

const changeStatusService = async (orderId, status) => {
  if (
    status === "rejected" ||
    status === "process" ||
    status === "shipping" ||
    status === "delivered"
  ) {
    await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });
  } else {
    throw new ResponseError(400, "invalid status");
  }
};

const getHistoryService = async (userEmail) => {
  const response = [];
  const orders = await prismaClient.order.findMany({
    where: {
      user_email: userEmail,
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

  if (orders.length < 1) {
    throw new ResponseError(404, "empty data");
  }

  orders.map((order) => {
    response.push({
      order_id: order.id,
      price_total: order.price_total,
      status: order.status,
      created_at: order.created_at,
      product: {
        total_product: order.Order_detail.length,
        product_name: order.Order_detail.map(
          (orderDetail) => orderDetail.product.name
        ),
      },
    });
  });

  return response;
};

const detailOrderService = async (userEmail, orderId) => {
  const order = await prismaClient.order.findFirst({
    where: {
      id: orderId,
      user_email: userEmail,
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

  if (!order) {
    throw new ResponseError(404, "order not found");
  }

  const response = {
    order_id: order.id,
    price_total: order.price_total,
    created_at: order.created_at,
    status: order.status,
    address: order.address,
    product: [],
  };

  order.Order_detail.map((detailProduct) => {
    response.product.push({
      product_id: detailProduct.product_id,
      price_item: detailProduct.price_item,
      quantity: detailProduct.quantity,
      name: detailProduct.product.name,
      color: detailProduct.product.color,
      size: detailProduct.product.size,
      product_image: detailProduct.product.Product_image[0].link,
    });
  });

  return response;
};

const getAllOrderService = async (status) => {
  const queryData = {
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
  };

  if (!status) {
    delete queryData.where;
  }
  const orders = await prismaClient.order.findMany(queryData);

  if (orders.length < 1) {
    throw new ResponseError(404, "empty data");
  }

  const response = [];
  let data;

  orders.map((order) => {
    data = {
      order_id: order.id,
      price_total: order.price_total,
      created_at: order.created_at,
      status: order.status,
      address: order.address,
      product: [],
    };

    order.Order_detail.map((detailProduct) => {
      data.product.push({
        product_id: detailProduct.product_id,
        price_item: detailProduct.price_item,
        quantity: detailProduct.quantity,
        name: detailProduct.product.name,
        color: detailProduct.product.color,
        size: detailProduct.product.size,
        product_image: detailProduct.product.Product_image[0].link,
      });
    });
    response.push(data);
  });

  return response;
};

export {
  createOrderService,
  transactionSuccessService,
  changeStatusService,
  getHistoryService,
  detailOrderService,
  getAllOrderService,
};
