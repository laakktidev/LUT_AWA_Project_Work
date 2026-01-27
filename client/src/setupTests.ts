import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Start MSW before all tests
beforeAll(() => server.listen());

// Reset handlers after each test (so tests don’t leak state)
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
