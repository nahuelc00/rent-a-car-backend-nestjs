import { getSHA1ofPassword } from './utilities';

describe('User utilities', () => {
  it('Should get sha1 of string', () => {
    const string = '123123';
    const stringHashed = getSHA1ofPassword(string);
    expect(stringHashed).toBe('56c822093944d8b7e0568ebda02a06c300ee96bc');
  });
});
