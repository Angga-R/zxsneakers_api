import { RepositoryTestUtil } from "../util/repository.test.util.js";

const test = new RepositoryTestUtil();

describe("product image", () => {
  beforeAll(async () => {
    await test.product.add("testSKU", test.productMockData(), [
      "linkImg1",
      "linkImg2",
    ]);
  });

  afterAll(async () => {
    const products = await test.product.findAll("testSKU");
    await test.product.delete(products[0].id);
  });

  it("should can find product image by product id", async () => {
    const products = await test.product.findAll("testSKU");
    const results = await test.productImage.findByProductId(products[0].id);

    expect(results.length).toBe(2);
  });

  it("should can find product image by id", async () => {
    const products = await test.product.findAll("testSKU");
    const productImages = await test.productImage.findByProductId(
      products[0].id
    );
    const result = await test.productImage.findById(productImages[0].id);

    console.info(result);

    expect(result).toBeDefined();
  });

  it("should can delete product image by id", async () => {
    const products = await test.product.findAll("testSKU");
    let productImages = await test.productImage.findByProductId(products[0].id);

    expect(productImages.length).toBe(2);

    await test.productImage.delete(productImages[0].id);

    productImages = await test.productImage.findByProductId(products[0].id);

    expect(productImages.length).toBe(1);
  });
});
