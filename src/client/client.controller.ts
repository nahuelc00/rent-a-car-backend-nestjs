/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Req,
  Res,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { mapClientToDB } from './mappers/map-client-to-db';
import { mapClientFromDB } from './mappers/map-client-from-db';
import { UserService } from 'src/user/user.service';

const jwt = require('jsonwebtoken');

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async getClient(
    @Param('id') id: string,
    @Res() response,
    @Req() req: Request & { headers: { authorization: string } },
  ) {
    try {
      const tokenAuth = req.headers.authorization;
      const decoded = jwt.verify(tokenAuth, process.env.PRIVATE_KEY_JWT);
      const user = await this.userService.getById(Number(decoded.id));
      const isUserAdmin = user.roles.includes('admin');

      if (isUserAdmin) {
        const client = await this.clientService.getById(Number(id));
        const clientMapped = mapClientFromDB(client);
        response.status(HttpStatus.OK).send(clientMapped);
      } else {
        response.status(HttpStatus.UNAUTHORIZED).send({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Only for admin user',
        });
      }
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/register')
  async registerClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<{ registered: string }> {
    const clients = await this.clientService.getAll();

    clients.forEach((client) => {
      const isEmailExistent = client.email === createClientDto.email;
      const isDniExistent =
        client.document_number === createClientDto.documentNumber;

      if (isEmailExistent)
        throw new HttpException(
          'This email already exists',
          HttpStatus.CONFLICT,
        );

      if (isDniExistent)
        throw new HttpException(
          'This document number already exists',
          HttpStatus.CONFLICT,
        );
    });

    const clientToDB = mapClientToDB(createClientDto);

    const clientRegistered = await this.clientService.register(clientToDB);

    return { registered: clientRegistered.email };
  }

  @Delete()
  async reset() {
    const isTestingE2E = process.env.NODE_ENV === 'test-e2e';
    if (isTestingE2E) return this.clientService.removeAll();
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
