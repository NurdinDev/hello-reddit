import { MyContext } from "../types";
import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

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
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;
    // check if the username
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must grater than 2",
          },
        ],
      };
    }

    // check if the password
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must grater than 3",
          },
        ],
      };
    }

    // check if username is exist in the database
    const userExist = await em.findOne(User, { username });
    if (userExist) {
      return {
        errors: [
          {
            field: "username",
            message: "this username is already exist!",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      console.error(error);
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    // check if the username
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must grater than 2",
          },
        ],
      };
    }

    // check if the password
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "username",
            message: "length must grater than 3",
          },
        ],
      };
    }

    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "this username doesn't exist",
          },
        ],
      };
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

    return {
      user,
    };
  }
}
