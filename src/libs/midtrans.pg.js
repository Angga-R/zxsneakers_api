import Midtrans from "midtrans-client";
import "dotenv";
import moment from "moment";

export class MidtransPG {
  async createTransaction(
    item_details = [
      {
        name: "",
        price: 0,
        quantity: 0,
      },
    ],
    transaction_details = { order_id: "", gross_amount: 0 },
    customer_details = {
      first_name: "",
      email: "",
      phone: "",
      billing_address: { address: "", city: "", postal_code: "" },
      shipping_address: { address: "", city: "", postal_code: "" },
    },
    finishUrl
  ) {
    const snap = new Midtrans.Snap({
      // isProduction: process.env.NODE_ENV === "production" ? true : false,
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      item_details: item_details,
      transaction_details: transaction_details,
      customer_details: customer_details,
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
        finish: finishUrl,
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

    return {
      snap_token: token,
      snap_url: "https://app.sandbox.midtrans.com/snap/snap.js", // sandbox
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    };
  }
}
