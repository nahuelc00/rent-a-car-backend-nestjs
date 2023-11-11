import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { assignDatabaseConfig } from './config';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
    }),
    CarsModule,
    UserModule,
    ClientModule,
  ],
})
export class AppModule {}
