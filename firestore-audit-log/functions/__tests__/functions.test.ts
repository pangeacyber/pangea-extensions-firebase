import mockedEnv, { type RestoreFn } from "mocked-env";

describe("extension", () => {
  let restore: RestoreFn;

  beforeEach(() => {
    restore = mockedEnv({
      PANGEA_DOMAIN: "test-domain",
      PANGEA_AUDIT_TOKEN: "test-token",
    });
  });

  afterEach(() => restore());

  test("functions are exported", () => {
    const exportedFunctions = jest.requireActual("../src");
    expect(exportedFunctions.fslog).toBeInstanceOf(Function);
    expect(exportedFunctions.onusercreated).toBeInstanceOf(Function);
    expect(exportedFunctions.onuserdeleted).toBeInstanceOf(Function);
  });
});
