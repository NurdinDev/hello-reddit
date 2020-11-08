import { FieldError } from "src/resolvers/FieldError";
import { EmailAndUsernameInput } from "../resolvers/InputFields";

export const validateRegister = async (
  options: EmailAndUsernameInput
): Promise<FieldError[] | []> => {
  const { username, email, password } = options;
  const errors = [];
  // check if the username
  if (username.length <= 2) {
    errors.push({
      field: "username",
      message: "length must grater than 2",
    });
  }

  if (username.includes("@")) {
    errors.push({
      field: "username",
      message: "username should not contain @",
    });
  }

  if (email.length <= 2) {
    errors.push({
      field: "email",
      message: "length must grater than 2",
    });
  }

  if (!email.includes("@")) {
    errors.push({
      field: "usernameOrEmail",
      message: "invalid email!",
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
