import { RepositoryTestUtil } from "../util/repository.test.util.js";

const test = new RepositoryTestUtil();

beforeAll(async () => {
  await test.user.add("testEmail", "testName", "testPassword");
  await test.address.add("testEmail", test.addressMockData());
});

afterAll(async () => {
  const address = await test.address.findByEmail("testEmail");
  await test.address.delete(address[0].id, "testEmail");
  await test.db.user.delete({
    where: {
      email: "testEmail",
    },
  });
});

it("should can use address repository", async () => {
  let addressBeforeUpdate = await test.address.findByEmail("testEmail");

  expect(addressBeforeUpdate[0].city).toBe("test city");

  await test.address.update(addressBeforeUpdate[0].id, "testEmail", {
    city: "new Test City",
  });

  const addressAfterUpdate = await test.address.findByIdAndEmail(
    addressBeforeUpdate[0].id,
    "testEmail"
  );

  expect(addressAfterUpdate.city).toBe("new Test City");
});
