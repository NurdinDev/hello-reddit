import { FieldError } from "src/resolvers/FieldError";
import { EmailOrUsernameInput } from "../resolvers/InputFields";

export const validateLogin = async (
  options: EmailOrUsernameInput
): Promise<FieldError[] | []> => {
  const { usernameOrEmail, password } = options;
  const errors = [];

  if (usernameOrEmail.length <= 2) {
    errors.push({
      field: "usernameOrEmail",
      message: "length must grater than 2",
    });
  }

  // check if the password
  if (password.length <= 3) {
    errors.push({
      field: "password",
      message: "length must grater than 3",
    });
  }

  return errors;
};
