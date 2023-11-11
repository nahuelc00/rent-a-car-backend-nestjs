import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { IClientMappedToDb } from './interfaces/client-to-db.interface';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async register(client: IClientMappedToDb): Promise<Client> {
    const clientSaved = await this.clientsRepository.save(client);
    return clientSaved;
  }

  async getAll(): Promise<Client[]> {
    const clients = await this.clientsRepository.find();
    return clients;
  }
}
