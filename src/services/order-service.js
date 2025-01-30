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
        created_at: new Date(),
      });
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

export { createOrderService, transactionSuccessService };
