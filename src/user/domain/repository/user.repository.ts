import { UserGetData } from 'src/user/dto/user.get.dto';

export class User {
  private props: UserGetData;

  private constructor(props: UserGetData) {
    this.props = props;
  }

  public static fromData(props: UserGetData): User {
    return new User(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }
}
