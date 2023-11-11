import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IUserMappedToDb } from './interfaces/user-mapped-to-db.interface';

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

  async getByEmail(
    userEmail: string,
  ): Promise<{ email: string; password: string; id: number }> {
    const user = await this.usersRepository.findOneBy({ email: userEmail });

    return {
      id: user?.id,
      email: user?.email,
      password: user?.password,
    };
  }

  async save(user: IUserMappedToDb): Promise<User> {
    const userSaved = await this.usersRepository.save(user);
    return userSaved;
  }
}
