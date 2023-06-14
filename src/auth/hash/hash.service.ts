import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
