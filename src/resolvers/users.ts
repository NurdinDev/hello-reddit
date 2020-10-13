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
import { COOKI_NAME } from "../constants";
import { EmailOrUsernameInput, EmailAndUsernameInput } from "./InputFields";
import { FieldError } from "./FieldError";
import { validateRegister } from "../utils/validateRegister";
import { validateLogin } from "../utils/validateLogin";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgetPassword(@Arg("email") email: string, @Ctx() { em }: MyContext) {
    const user = em.findOne(User, { email });
    return user;
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
