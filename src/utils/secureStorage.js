import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-secret-key';
const COOKIE_OPTIONS = {
  secure: import.meta.env.PROD,
  sameSite: 'strict',
  expires: 7 // 7 days
};

export const secureStorage = {
  encrypt: (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  },

  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  },

  setItem: (key, value) => {
    const encryptedValue = secureStorage.encrypt(value);
    Cookies.set(key, encryptedValue, COOKIE_OPTIONS);
  },

  getItem: (key) => {
    const encryptedValue = Cookies.get(key);
    if (!encryptedValue) return null;
    return secureStorage.decrypt(encryptedValue);
  },

  removeItem: (key) => {
    Cookies.remove(key);
  },

  clear: () => {
    Object.keys(Cookies.get()).forEach(key => {
      Cookies.remove(key);
    });
  }
}; 