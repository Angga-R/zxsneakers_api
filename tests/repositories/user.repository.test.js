import { RepositoryTestUtil } from "../util/repository.test.util.js";
const test = new RepositoryTestUtil();

describe("add user", () => {
  afterEach(async () => {
    await test.db.user.delete({
      where: {
        email: "testEmail",
      },
    });
  });

  it("should can add new user", async () => {
    await test.user.add("testEmail", "testName", "testPassword");

    const result = await test.user.findByEmail("testEmail");

    console.info(result);

    expect(result).toBeDefined();
  });
});

describe("update and find user", () => {
  beforeAll(async () => {
    await test.user.add("testEmail", "testName", "testPassword");
  });

  afterAll(async () => {
    await test.db.user.delete({
      where: {
        email: "testEmail",
      },
    });
  });

  describe("find user", () => {
    it("should can find user by email", async () => {
      const result = await test.user.findByEmail("testEmail");

      expect(result).toBeDefined();
      expect(result.email).toBe("testEmail");
      expect(result.name).toBe("testName");
      expect(result.password).toBe("testPassword");
    });

    it("should get null when email not found", async () => {
      const result = await test.user.findByEmail("nothing");

      expect(result).toBeNull();
    });
  });

  describe("update user", () => {
    it("should can update name", async () => {
      await test.user.updateName("testEmail", "newName");
      const result = await test.user.findByEmail("testEmail");
      console.info(result.name);

      expect(result.name).toBe("newName");
    });

    it("should can update password", async () => {
      await test.user.updatePassword("testEmail", "newPassword");
      const result = await test.user.findByEmail("testEmail");
      console.info(result.password);

      expect(result.password).toBe("newPassword");
    });

    it("should can update avatar", async () => {
      await test.user.updateAvatar("testEmail", "newAvatar");
      const result = await test.user.findByEmail("testEmail");
      console.info(result.avatar);

      expect(result.avatar).toBe("newAvatar");
    });
  });
});
