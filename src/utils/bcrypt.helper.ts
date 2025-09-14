import * as bcrypt from 'bcrypt';

export async function hashPassword(plainText: string): Promise<any> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, 10, (error: unknown, hash: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });
}

export async function comparePassword(
  plainText: string,
  hash: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hash, (error: unknown, result: boolean) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
