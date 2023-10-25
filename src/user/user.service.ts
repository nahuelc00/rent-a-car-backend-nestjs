import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getById(userId: number): Promise<User> {
    const user = this.usersRepository.findOneBy({ id: userId });
    return user;
  }

  async getEmail(userEmail: string) {
    const emails = await this.usersRepository.find({
      select: {
        email: true,
      },
    });

    const email = emails.find((email) => email.email === userEmail);
    return email;
  }

  async getByEmail(
    userEmail: string,
  ): Promise<{ email: string; password: string; id: number }> {
    const user = await this.usersRepository.findOneBy({ email: userEmail });

    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }

  async save(user: CreateUserDto): Promise<User> {
    const userSaved = await this.usersRepository.save(user);
    return userSaved;
  }
}
