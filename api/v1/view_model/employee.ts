
import { Expose } from "class-transformer";
import { IsArray, IsDefined,IsNumber, IsString  } from "class-validator";

enum Role {
  admin,
  employee,
  planner,
}

export class SignupViewModel {
  @Expose()
  @IsDefined()
  @IsString()
  name: string;

  @Expose()
  @IsDefined()
  @IsString()
  id_card_number: string;

  @Expose()
  @IsDefined()
  @IsString()
  username: string;

  @Expose()
  @IsDefined()
  @IsString()
  password: string;

  @Expose()
  @IsDefined()
  @IsString()
  address: string;

  @Expose()
  @IsDefined()
  @IsString()
  phone_number: string;

  @Expose()
  @IsDefined()
  designation: number;

  @Expose()
  @IsDefined()
  department: number;
}

export class LoginViewModel {
  @Expose()
  @IsDefined()
  @IsString()
  username: string;

  @Expose()
  @IsDefined()
  @IsString()
  password: string;
}

export class addQuestionsViewModel {
  @Expose()
  @IsDefined()
  @IsArray()
  questions: questionsViewModel[]
}

export class questionsViewModel {
  // @Expose()
  // @IsDefined()
  // @IsNumber()
  // employee_id!: number;

  @Expose()
  @IsDefined()
  @IsNumber()
  question: number;

  @Expose()
  @IsDefined()
  @IsString()
  answer: string;
}
export class ChangePassViewModel {
  @Expose()
  @IsDefined()
  @IsString()
  new_password: string;

  @Expose()
  @IsDefined()
  @IsString()
  old_password: string;
}
