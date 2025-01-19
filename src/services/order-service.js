import Midtrans from "midtrans-client";
import { prismaClient, redisClient } from "../app/database.js";
import { createOrderValidation } from "../validation/order-validation.js";
import { validate } from "../validation/validate.js";
import "dotenv";
import moment from "moment";
import { ResponseError } from "../error-handler/response-error.js";
import { v4 as uuid } from "uuid";

const createOrderService = async (request, userEmail) => {
  const validatedData = validate(createOrderValidation, request);
  const data = [];
  let product;

  for (let i = 0; i < validatedData.items.length; i++) {
    product = await prismaClient.product.findFirst({
      where: {
        sku: validatedData.items[i].sku,
      },
      include: {
        id: false,
        created_at: false,
        updated_at: false,
        Product_color: {
          select: {
            color: true,
          },
          where: {
            color: validatedData.items[i].color,
          },
        },
        Product_size: {
          select: {
            size: true,
          },
          where: {
            size: validatedData.items[i].size,
          },
        },
      },
    });
    if (product.stock < validatedData.items[i].quantity) {
      throw new ResponseError(400, "quantity more than available stock");
    }
    data.push(product);
  }
  // find user include address
  const user = await prismaClient.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      password: false,
      addresses: {
        where: {
          id: validatedData.addressId,
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
      first_name: user.name,
      email: user.email,
      phone: user.addresses[0].no_telp,
      billing_address: {
        address: user.addresses[0].street + " " + user.addresses[0].sub_distric,
        city: user.addresses[0].city,
        postal_code: user.addresses[0].postal_code,
      },
      shipping_address: {
        address: user.addresses[0].street + " " + user.addresses[0].sub_distric,
        city: user.addresses[0].city,
        postal_code: user.addresses[0].postal_code,
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
      id_order: order_id,
      email_user: user.email,
      sku_product: data[i].sku,
      price: data[i].price,
      quantity: validatedData.items[i].quantity,
      price_total: gross_amount[i],
      time: new Date(),
      color: data[i].Product_color[0].color,
      size: data[i].Product_size[0].size,
    });
    await redisClient.expire(key, 3660);
  }

  return {
    snap_token: token,
    snap_url: snap_url,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  };
};

const transactionSuccessService = async (order_id) => {
  // check in redis order_id with data order
  const checkOrderData = await redisClient.keys(`${order_id}*`);

  if (checkOrderData.length > 0) {
    let data;
    // add data order from redis to tb order_detail
    for (const key of checkOrderData) {
      data = await redisClient.hgetall(key);
      data.price = Number(data.price);
      data.quantity = Number(data.quantity);
      data.price_total = Number(data.price_total);
      data.size = Number(data.size);
      data.time = new Date();
      const addToDatabase = await prismaClient.order_detail.create({
        data: data,
      });

      if (addToDatabase) {
        // update stock
        await prismaClient.product.update({
          where: {
            sku: data.sku_product,
          },
          data: {
            stock: {
              decrement: data.quantity,
            },
          },
        });
        // delete data order from redis
        await redisClient.del(key);
      }
    }
  } else {
    throw new ResponseError(404, "data not found");
  }
};

export { createOrderService, transactionSuccessService };
