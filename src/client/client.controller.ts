import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { mapClientToDB } from './mappers/map-client-to-db';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/register')
  async registerClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<{ registered: string }> {
    const clients = await this.clientService.getAll();

    clients.forEach((client) => {
      const isEmailExistent = client.email === createClientDto.email;

      if (isEmailExistent)
        throw new HttpException(
          'This email already exists',
          HttpStatus.CONFLICT,
        );
    });

    const clientToDB = mapClientToDB(createClientDto);

    const clientRegistered = await this.clientService.register(clientToDB);

    return { registered: clientRegistered.email };
  }
}
