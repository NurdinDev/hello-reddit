import { MyContext } from "../types";
import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKI_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { EmailOrUsernameInput, EmailAndUsernameInput } from "./InputFields";
import { FieldError } from "./FieldError";
import { validateRegister } from "../utils/validateRegister";
import { validateLogin } from "../utils/validateLogin";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { em, redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired!",
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists!",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);

    await em.persistAndFlush(user);

    // login user after change the password

    req.session.userId = user.id;

    await redis.del(FORGET_PASSWORD_PREFIX + token);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return false;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24
    ); // 1 day

    const html = `<a href="http:localhost:3000/change-password/${token}">reset password</a>`;

    await sendEmail(email, html);

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      // the user not logged in
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: EmailAndUsernameInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password, email } = options;

    const userByEmail = await em.findOne(User, { email });
    const userByUsername = await em.findOne(User, { username });

    const errors = [];

    if (userByEmail) {
      errors.push({
        field: "email",
        message: "this email is already registered!",
      });
    }

    if (userByUsername) {
      errors.push({
        field: "username",
        message: "this username is already exist!",
      });
    }

    errors.push(...(await validateRegister(options)));

    if (errors.length) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = em.create(User, {
      email,
      username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(newUser);
    } catch (error) {
      console.error(error);
    }

    // keep user login after register
    req.session!.userId = newUser.id;

    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: EmailOrUsernameInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { usernameOrEmail, password } = options;

    const isEmail = usernameOrEmail && usernameOrEmail.includes("@");

    const user = await em.findOne(
      User,
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
    );

    console.log({ user });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist!",
          },
        ],
      };
    }

    const errors = await validateLogin(options);

    if (errors.length) {
      return { errors };
    }

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password!",
          },
        ],
      };
    }

    // save user cookie
    req.session!.userId = user?.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKI_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
