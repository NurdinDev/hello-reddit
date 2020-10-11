import { User } from "src/entities/User";
import { FieldError } from "src/resolvers/FieldError";
import { EmailOrUsernameInput } from "../resolvers/InputFields";
import argon2 from "argon2";

export const validateRegister = async (
  options: EmailOrUsernameInput,
  user: User | null,
  isLogin = false
): Promise<FieldError[] | []> => {
  const { username, email, password } = options;
  const errors = [];
  // check if the username
  if (username && username?.length <= 2) {
    errors.push({
      field: "username",
      message: "length must grater than 2",
    });
  }

  if (email && !email.includes("@")) {
    errors.push({
      field: "email",
      message: "email must contain @",
    });
  }

  // check if the password
  if (password.length <= 3) {
    errors.push({
      field: "password",
      message: "length must grater than 3",
    });
  }

  if (isLogin && user) {
    // check password.
    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      errors.push({
        field: "password",
        message: "incorrect password!",
      });
    }
  } else if (!isLogin && user) {
    // check if username is exist in the database
    errors.push({
      field: "username",
      message: "this username is already exist!",
    });
  }

  return errors;
};
