import { RepositoryTestUtil } from "../util/repository.test.util.js";

const test = new RepositoryTestUtil();

describe("cart", () => {
  beforeAll(async () => {
    await test.user.add("testEmail", "testName", "testPassword");
    await test.product.add("testSKU", test.productMockData(), [
      "linkImg1",
      "linkImg2",
    ]);
  });

  afterAll(async () => {
    const product = await test.product.findAll("testSKU");

    await test.product.delete(product[0].id);

    await test.db.user.delete({
      where: {
        email: "testEmail",
      },
    });
  });

  it("should can add, find, and delete product", async () => {
    const product = await test.product.findAll("testSKU");

    await test.cart.add("testEmail", product[0].id);

    let result = await test.cart.findByEmail("testEmail");

    console.info(result);

    expect(result).toBeDefined();

    await test.cart.delete("testEmail", product[0].id);

    result = await test.cart.findByEmail("testEmail");

    console.info(result);

    expect(result.length).toBe(0);
  });
});
