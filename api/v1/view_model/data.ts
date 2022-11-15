
import { Expose } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class ZoneDataViewModel {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  color: string;
}

export class AddAreaViewModel {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  zone: number;
}
