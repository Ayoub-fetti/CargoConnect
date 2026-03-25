import * as bcrypt from 'bcrypt';

export class HashingUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
