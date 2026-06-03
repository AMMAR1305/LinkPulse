const crypto = require('crypto');

// Base32 decode helper (since TOTP secrets are base32 encoded)
function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let length = base32.length;
  // strip padding
  while (length > 0 && base32[length - 1] === '=') {
    length--;
  }
  
  let buffer = Buffer.alloc(Math.floor((length * 5) / 8));
  let bits = 0;
  let value = 0;
  let index = 0;
  
  for (let i = 0; i < length; i++) {
    const val = alphabet.indexOf(base32[i].toUpperCase());
    if (val === -1) throw new Error('Invalid base32 character');
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      buffer[index++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return buffer;
}

// Generate base32 secret helper
function generateSecret(length = 20) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const randomBytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += alphabet[randomBytes[i] % 32];
  }
  return secret;
}

// Verify TOTP token helper (with 1 timestep window of drift leeway)
function verifyTOTP(token, secret, window = 1) {
  try {
    const key = base32Decode(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const currentStep = Math.floor(epoch / timeStep);
    
    for (let i = -window; i <= window; i++) {
      const step = currentStep + i;
      // convert step to 8-byte hex buffer
      const buf = Buffer.alloc(8);
      let tmp = step;
      for (let j = 7; j >= 0; j--) {
        buf[j] = tmp & 0xff;
        tmp = tmp >> 8;
      }
      
      const hmac = crypto.createHmac('sha1', key).update(buf).digest();
      // dynamic truncation
      const offset = hmac[hmac.length - 1] & 0xf;
      const code = (
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)
      ) % 1000000;
      
      const padToken = code.toString().padStart(6, '0');
      if (padToken === token) {
        return true;
      }
    }
  } catch (error) {
    console.error('Error verifying TOTP:', error);
  }
  return false;
}

module.exports = {
  generateSecret,
  verifyTOTP,
};
