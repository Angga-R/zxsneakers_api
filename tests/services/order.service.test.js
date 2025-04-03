import { ServiceTestUtil } from "../util/service.test.util.js";
const service = new ServiceTestUtil();

describe("Create Order", () => {
  afterAll(async () => {
    await service.deleteUserTest();
    await service.deleteProductTest();
  });

  it("should can create new order", async () => {
    const testUser = await service.createUserAndAddressTest();
    const productId = await service.createProductTest();
    const orderRequest = {
      items: [
        {
          productId: productId,
          quantity: 2,
        },
      ],
      addressId: testUser.addressId,
      finishUrl: "http://example.com",
    };

    const response = await service.orderService.create(
      orderRequest,
      testUser.email
    );

    console.info(response);
  });
});
