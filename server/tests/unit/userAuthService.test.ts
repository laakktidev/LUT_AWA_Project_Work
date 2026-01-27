import { connectTestDb, disconnectTestDb } from "../helpers/testDb";
import { User } from "../../src/models/User";
import {
  findUserByEmail,
  registerUserInDb,
  validatePassword,
  createJwtToken
} from "../../src/services/userAuthService";

describe("userAuthService", () => {

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("registerUserInDb creates a new user", async () => {
    const email = "test@example.com";
    const password = "secret123";
    const username = "tester";

    const user = await registerUserInDb(email, password, username);

    expect(user.email).toBe(email);
    expect(user.username).toBe(username);

    const found = await User.findOne({ email });
    expect(found).not.toBeNull();
  });

  test("findUserByEmail returns the correct user", async () => {
    await User.create({
      email: "findme@example.com",
      password: "hashed",
      username: "findme"
    });

    const user = await findUserByEmail("findme@example.com");
    expect(user?.email).toBe("findme@example.com");
  });

  test("validatePassword returns true for correct password", async () => {
    const email = "pass@example.com";
    const password = "mypassword";

    const user = await registerUserInDb(email, password, "passuser");

    const isValid = await validatePassword(password, user.password);
    expect(isValid).toBe(true);
  });

  test("validatePassword returns false for incorrect password", async () => {
    const email = "wrongpass@example.com";
    const password = "correct";

    const user = await registerUserInDb(email, password, "wrongpass");

    const isValid = await validatePassword("incorrect", user.password);
    expect(isValid).toBe(false);
  });

  test("createJwtToken returns a valid JWT string", () => {
    const fakeUser = {
      _id: "123456789012",
      username: "jwtuser"
    };

    const token = createJwtToken(fakeUser);

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);
  });

});
