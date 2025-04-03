import { RepositoryTestUtil } from "../util/repository.test.util.js";

const test = new RepositoryTestUtil();

describe("order", () => {
  const addressId = async () => {
    const address = await test.address.findByEmail("testEmail");
    return address[0].id;
  };
  const productId = async () => {
    const product = await test.product.findAll("testSKU");
    return product[0].id;
  };

  beforeAll(async () => {
    await test.user.add("testEmail", "testName", "testPassword");
    await test.address.add("testEmail", test.addressMockData());
    await test.product.add("testSKU", test.productMockData(), [
      "linkImg1",
      "linkImg2",
    ]);
  });

  afterAll(async () => {
    await test.address.delete(await addressId(), "testEmail");

    await test.product.delete(await productId());

    await test.db.user.delete({
      where: {
        email: "testEmail",
      },
    });
  });

  describe("add order", () => {
    afterEach(async () => {
      const orderDetailId = await test.db.order.findFirst({
        where: {
          id: "testId",
        },
        select: {
          Order_detail: {
            select: {
              id: true,
            },
          },
        },
      });

      await test.db.order_detail.delete({
        where: {
          id: orderDetailId.Order_detail[0].id,
        },
      });

      await test.db.order.delete({
        where: {
          id: "testId",
        },
      });
    });

    it("should can add new order", async () => {
      await test.order.add(
        test.orderMockData(await addressId(), await productId())
      );

      const result = await test.order.findByEmail("testEmail");

      console.info(result);

      expect(result).toBeDefined();
    });
  });

  describe("update order status", () => {
    beforeEach(async () => {
      await test.order.add(
        test.orderMockData(await addressId(), await productId())
      );
    });

    afterEach(async () => {
      const orderDetailId = await test.db.order.findFirst({
        where: {
          id: "testId",
        },
        select: {
          Order_detail: {
            select: {
              id: true,
            },
          },
        },
      });

      await test.db.order_detail.delete({
        where: {
          id: orderDetailId.Order_detail[0].id,
        },
      });

      await test.db.order.delete({
        where: {
          id: "testId",
        },
      });
    });

    it("should can update order status", async () => {
      await test.order.updateStatus("testId", "testing");

      const order = await test.order.findByStatus("testing");

      console.info(order);

      expect(order).toBeDefined();
    });
  });

  describe("find order", () => {
    beforeAll(async () => {
      await test.order.add(
        test.orderMockData(await addressId(), await productId())
      );
    });

    afterAll(async () => {
      const orderDetailId = await test.db.order.findFirst({
        where: {
          id: "testId",
        },
        select: {
          Order_detail: {
            select: {
              id: true,
            },
          },
        },
      });

      await test.db.order_detail.delete({
        where: {
          id: orderDetailId.Order_detail[0].id,
        },
      });

      await test.db.order.delete({
        where: {
          id: "testId",
        },
      });
    });

    it("should can find order by email", async () => {
      const result = await test.order.findByEmail("testEmail");

      console.info(result);

      expect(result).toBeDefined();
    });

    it("should can find order by status", async () => {
      const result = await test.order.findByStatus("accepting");

      console.info(result);

      expect(result).toBeDefined();
    });

    it("should can find order by id and email", async () => {
      const result = await test.order.findByIdAndEmail("testId", "testEmail");

      console.info(result);

      expect(result).toBeDefined();
    });
  });
});
