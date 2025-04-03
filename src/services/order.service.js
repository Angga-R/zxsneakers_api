import { redisClient } from "../config/redis.config.js";
import { validate } from "../utils/validations/validate.js";
import orderValidation from "../utils/validations/order.validation.js";
import "dotenv";
import { ResponseError } from "../utils/error_handler/response.error.js";
import { v4 as uuid } from "uuid";
import { OrderRepository } from "../repositories/order.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { AddressRepository } from "../repositories/address.repository.js";
import { MidtransPG } from "../libs/midtrans.pg.js";

class OrderService {
  #order = new OrderRepository();
  #product = new ProductRepository();
  #address = new AddressRepository();
  #midtrans = new MidtransPG();

  async create(request, email) {
    const validatedData = validate(orderValidation.create, request);
    const data = [];
    let product;
    const item_details = [];
    const gross_amount = [];
    const orderId = "zxs-" + uuid().toString();

    validatedData.items.map(async (item) => {
      product = await this.#product.findById(item.productId, false);

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
    const address = await this.#address.findById(
      validatedData.addressId,
      email,
      true
    );

    for (let i = 0; i < validatedData.items.length; i++) {
      item_details.push({
        name: data[i].name,
        price: data[i].price,
        quantity: validatedData.items[i].quantity,
      });
      gross_amount.push(data[i].price * validatedData.items[i].quantity);
    }

    const transaction_details = {
      order_id: orderId,
      gross_amount: gross_amount.reduce((acc, curr) => acc + curr),
    };

    const customer_details = {
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
    };

    const createTransaction = await this.#midtrans.createTransaction(
      item_details,
      transaction_details,
      customer_details,
      validatedData.finishUrl
    );

    if (!createTransaction) {
      throw new Error();
    }

    // add data order to redis
    for (let i = 0; i < data.length; i++) {
      const key = `${orderId}-${i + 1}`;
      await redisClient.hset(key, {
        product_id: data[i].id,
        price_item: data[i].price,
        quantity: validatedData.items[i].quantity,
        subtotal: gross_amount[i],
        address_id: address.id,
      });
      await redisClient.expire(key, 3660);
    }

    return createTransaction;
  }

  async transactionSuccess(orderId, email) {
    // check in redis order_id with data order
    const checkOrderKeys = await redisClient.keys(`${orderId}*`);

    if (checkOrderKeys.length > 0) {
      const queryData = {
        id: orderId,
        user_email: email,
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
      for (const key of checkOrderKeys) {
        const data = await redisClient.hgetall(key);
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

      const addToDatabase = await this.#order.add(queryData);

      if (addToDatabase) {
        // update stock
        for (let i = 0; i < checkOrderKeys.length; i++) {
          const updateProductData = {
            stock: {
              decrement: queryData.Order_detail.createMany.data[i].quantity,
            },
          };
          await this.#product.update(
            queryData.Order_detail.createMany.data[i].product_id,
            updateProductData
          );
          // delete data order from redis
          await redisClient.del(checkOrderKeys[i]);
        }
      }
    } else {
      throw new ResponseError(404, "data not found");
    }
  }

  async changeStatus(orderId, status) {
    if (
      status === "rejected" ||
      status === "process" ||
      status === "shipping" ||
      status === "delivered"
    ) {
      await this.#order.updateStatus(orderId, status);
    } else {
      throw new ResponseError(400, "invalid status");
    }
  }

  async getHistory(email) {
    const response = [];
    const orders = await this.#order.findByEmail(email);

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
  }

  async detailOrder(orderId, email) {
    const order = await this.#order.findByIdAndEmail(orderId, email);

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
  }

  async getAllOrder(status) {
    const orders = await this.#order.findByStatus(status);

    if (orders.length < 1) {
      throw new ResponseError(404, "empty data");
    }

    const response = [];

    orders.map((order) => {
      const data = {
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
  }
}

export default new OrderService();
