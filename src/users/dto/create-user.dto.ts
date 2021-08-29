import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @IsOptional()
  @IsString()
  @MaxLength(9)
  readonly cellphone: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @IsArray()
  @IsOptional()
  readonly modulesIds: number[];
}
