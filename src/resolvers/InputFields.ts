import { InputType, Field } from "type-graphql";

@InputType()
export class EmailOrUsernameInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  password: string;
}

@InputType()
export class EmailAndUsernameInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
