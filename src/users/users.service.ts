import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from '../types';

const DATA_PATH = join(__dirname, '..', '..', 'data.json');

@Injectable()
export class UsersService {
  private readonly users: ReadonlyMap<string, User>;

  constructor() {
    const users = JSON.parse(readFileSync(DATA_PATH, 'utf-8')) as User[];
    this.users = new Map(users.map((user) => [user.id, user]));
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}
