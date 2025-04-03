import { RepositoryTestUtil } from "../util/repository.test.util.js";

const test = new RepositoryTestUtil();

describe("admin", () => {
  beforeAll(async () => {
    await test.db.admin.create({
      data: {
        email: "testEmailAdmin",
        password: "testPassword",
      },
    });
  });

  afterAll(async () => {
    await test.db.admin.delete({
      where: {
        email: "testEmailAdmin",
      },
    });
  });

  it("Should can get data admin", async () => {
    const result = await test.admin.getData();

    console.info(result);

    expect(result).toBeDefined();
  });

  it("should can update password admin", async () => {
    await test.admin.updatePassword("testEmailAdmin", "newTestPassword");

    const result = await test.admin.getData();

    console.info(result);

    expect(result).toBeDefined();
  });
});
