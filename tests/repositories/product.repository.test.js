import { RepositoryTestUtil } from "../util/repository.test.util.js";
const test = new RepositoryTestUtil();

describe("add product", () => {
  afterEach(async () => {
    const productTest = await test.product.findAll("testSKU");
    const id = productTest[0].id;
    await test.product.delete(id);
  });

  it("should can add new product", async () => {
    await test.product.add("testSKU", test.productMockData(), [
      "testLink1",
      "testLink2",
    ]);

    const result = await test.product.findAll("testSKU", null, 0, true);

    console.info(result);

    expect(result.length).toBe(1);
  });
});

describe("get product", () => {
  beforeAll(async () => {
    for (let i = 1; i <= 2; i++) {
      await test.product.add(`testSKU${i}`, test.productMockData(), [
        `testLink${i}`,
        `testLink${i + 1}`,
      ]);
    }
  });

  afterAll(async () => {
    for (let i = 1; i <= 2; i++) {
      const productTest = await test.product.findAll(`testSKU${i}`);
      const id = productTest[0].id;
      await test.product.delete(id);
    }
  });

  describe("FindAll Product", () => {
    it("should get all data product", async () => {
      const result = await test.product.findAll();

      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it("should get all data product with searchData", async () => {
      const result = await test.product.findAll("testSKU");

      expect(result.length).toBe(2);
    });

    it("should get all data product with limit, skip, and include productImage", async () => {
      // const result = await productRepository.findAll("", 2, 1, true);
      const result = await test.product.findAll("", 2, 1, true);

      console.info(result);
      expect(result).toBeDefined();
    });

    it("should not return data when searchData not found", async () => {
      const result = await test.product.findAll("kfjsdnfwofndsc");
      console.info("result : " + result);
      expect(result.length).toBe(0);
    });
  });

  describe("findById product", () => {
    it("should can find product by ID", async () => {
      const result = await test.product.findById(7);

      console.info(result);

      expect(result).toBeDefined();
    });

    it("should getting null when id not found", async () => {
      const result = await test.product.findById(346);

      console.info(result);

      expect(result).toBeNull();
    });
  });

  describe("count product", () => {
    it("should get total product", async () => {
      const result = await test.product.count();

      expect(result).toBe(5);
    });

    it("should get total product with searchData", async () => {
      const result = await test.product.count("Adi");

      expect(result).toBe(1);
    });

    it("should return 0 when searchData not found", async () => {
      const result = await test.product.count("kfjnfdsfknehrf");

      expect(result).toBe(0);
    });
  });
});

describe("update product", () => {
  beforeEach(async () => {
    await test.product.add("testSKU", test.productMockData(), [
      "testLink1",
      "testLink2",
    ]);
  });

  afterEach(async () => {
    const productTest = await test.product.findAll("testSKU");
    const id = productTest[0].id;
    await test.product.delete(id);
  });

  it("should can update data product", async () => {
    const productTest = await test.product.findAll("testSKU");

    console.info("before : ");
    console.info(productTest);

    const id = productTest[0].id;
    const data = {
      color: "green",
    };
    await test.product.update(id, data, ["newLink3", "newLink4"]);

    const afterUpdate = await test.product.findById(id, true);
    console.info("after : ");
    console.info(afterUpdate);

    expect(afterUpdate.color).toBe("green");
    expect(afterUpdate.Product_image.length).toBe(4);
  });
});
