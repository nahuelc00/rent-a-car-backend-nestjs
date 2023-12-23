/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapUserFromDB } from './mappers/mapUserFromDB';
import { mapUserToDB } from './mappers/mapUserToDB';
import { LoginUserDto } from './dto/login-user-dto';
import { getSHA1ofPassword } from './utilities';

const jwt = require('jsonwebtoken');

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: Request & { headers: { authorization: string } }) {
    try {
      const tokenAuth = req.headers.authorization;
      const decoded = jwt.verify(tokenAuth, process.env.PRIVATE_KEY_JWT);
      const user = await this.userService.getById(Number(decoded.id));
      const userMapped = mapUserFromDB(user);

      return userMapped;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<{ registered: string }> {
    const userSearched = await this.userService.getByEmail(user.email);
    const existEmail = userSearched.email !== undefined;

    if (existEmail)
      throw new HttpException('This email already exists', HttpStatus.CONFLICT);

    const passwordHashed = getSHA1ofPassword(user.password);

    const userMappedToDB = mapUserToDB({
      ...user,
      password: passwordHashed,
    });

    const userSaved = await this.userService.save(userMappedToDB);

    return {
      registered: userSaved.email,
    };
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto): Promise<{ token: string }> {
    const email = userData.email;
    const password = getSHA1ofPassword(userData.password);

    const user = await this.userService.getByEmail(email);

    const validCredentials = user.email === email && user.password === password;

    if (validCredentials) {
      const token = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY_JWT, {
        expiresIn: '2 days',
      });

      return { token };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete()
  async reset() {
    const isTestingE2E = process.env.NODE_ENV === 'test-e2e';
    if (isTestingE2E) return this.userService.removeAll();
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
