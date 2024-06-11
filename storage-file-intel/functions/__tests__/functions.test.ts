import mockedEnv, { type RestoreFn } from "mocked-env";

describe("extension", () => {
  let restore: RestoreFn;

  beforeEach(() => {
    restore = mockedEnv({
      PANGEA_DOMAIN: "test-domain",
      PANGEA_FILE_INTEL_TOKEN: "test-token",
    });
  });

  afterEach(() => restore());

  test("functions are exported", () => {
    const exportedFunctions = jest.requireActual("../src");
    expect(exportedFunctions.checkFileReputation).toBeInstanceOf(Function);
  });
});
