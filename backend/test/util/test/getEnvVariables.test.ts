import { getEnvVariables } from "../../../util/test/getEnvVariables";

test("works when all env variables required are present", () => {
  // setup env
  process.env.TEST_VALUE_ONE = "first_test_value";
  process.env.TEST_VALUE_TWO = "second_test_value";

  const requiredEnvVariables = ["TEST_VALUE_ONE", "TEST_VALUE_TWO"];
  expect(getEnvVariables(requiredEnvVariables)).toEqual({
    TEST_VALUE_ONE: process.env.TEST_VALUE_ONE,
    TEST_VALUE_TWO: process.env.TEST_VALUE_TWO,
  });
});

test("throws error when required env variables are missing", () => {
  // setup env
  process.env.TEST_VALUE_ONE = "first_test_value";
  process.env.TEST_VALUE_TWO = "second_test_value";

  const requiredEnvVariables = [
    "TEST_VALUE_ONE",
    "TEST_VALUE_TWO",
    "MISSING_VALUE",
  ];
  expect(() => getEnvVariables(requiredEnvVariables)).toThrow(Error);
});
