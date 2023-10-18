const crypto = require('crypto');

function getSHA1ofPassword(password: string) {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(password))
    .digest('hex');
}

export { getSHA1ofPassword };
