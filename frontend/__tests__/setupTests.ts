import { server } from "./mocks/server";
import { beforeAll, afterEach, afterAll } from "@jest/globals";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());