import { Match } from '@/decorators/fieldMatch.decorator';
import { LowerCase } from '@/decorators/lowerCase.decorator';
import { Trim } from '@/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter valid email format' })
  @LowerCase()
  @Length(1, 30)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SignupDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 30)
  @Trim()
  @IsAlpha()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @LowerCase()
  @IsEmail({}, { message: 'Please enter valid email format' })
  @Length(1, 30)
  @Trim()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 30)
  @Match('password', { message: 'Password must match' })
  confirmPassword: string;
}

export class ForgetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter valid email format' })
  @LowerCase()
  @Length(1, 30)
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('password', { message: 'Password must match' })
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  passwordToken: string;
}
