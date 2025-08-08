import {
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidationOptions,
  registerDecorator,
} from "class-validator";
export function IsImageFile(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(mimeType) {
          const acceptMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
          const fileType = acceptMimeTypes.find((type) => type === mimeType);
          return !fileType;
        },
      },
    });
  };
}

export class ManualSignupDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsDateString()
  public dateOfBirth: Date;
  /*
  @IsNumberString()
  @Length(8, 20)
  public phone: String;
  */
  @IsEmail()
  public email: string;

  @IsString()
  @Length(8, 20)
  public password: string;

  @IsBooleanString()
  public isTermsAnConditionAccepted: boolean;
}

export class VerifyEmailDto {
  @IsEmail()
  public email: string;
}

export class LoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  @Length(8, 20)
  public password: string;
}

export class UpdateProfileDto {
  @IsString()
  public username: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsDateString()
  public dateOfBirth: Date;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  public password: string;
}
