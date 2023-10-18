/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapUserFromDB } from './mappers/mapUserFromDB';
import { mapUserToDB } from './mappers/mapUserToDB';
import { LoginUserDto } from './dto/login-user-dto';
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = 'asd123$%&';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: Request & { headers: { authorization: string } }) {
    try {
      const tokenAuth = req.headers.authorization;
      const decoded = jwt.verify(tokenAuth, PRIVATE_KEY);
      const user = await this.userService.getById(Number(decoded.id));
      const userMapped = mapUserFromDB(user);

      return userMapped;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<{ registered: string }> {
    const userMappedToDB = mapUserToDB(user);
    const existEmail = await this.userService.getEmail(userMappedToDB.email);

    if (existEmail)
      throw new HttpException('This email already exists', HttpStatus.CONFLICT);

    const userSaved = await this.userService.save(userMappedToDB);
    return {
      registered: userSaved.email,
    };
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto): Promise<{ token: string }> {
    try {
      const email = userData.email;
      const password = userData.password;

      const user = await this.userService.getByEmail(email);

      const validCredentials =
        user.email === email && user.password === password;

      if (validCredentials) {
        const token = jwt.sign({ id: user.id }, PRIVATE_KEY, {
          expiresIn: '2 days',
        });

        return { token };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
