const CryptoJS = require("crypto-js");
const secretKey = "mySecretKey123456";

export function setDataOnLocalStorage(key, data) {
  localStorage.setItem(key, encrypt(JSON.stringify(data)));
}

export function getDataFromLocalStorage(key) {
  let decryptedText;
  const data = localStorage.getItem(key);
  if (data) {
    decryptedText = decrypt(data);
  }
  return decryptedText;
}

export function removeStorageItem(key) {
  localStorage.removeItem(key);
}

export function encrypt(data) {
  return CryptoJS.AES.encrypt(data, secretKey);
}

// export function decrypt(data) {
//   let decrypted = CryptoJS.AES.decrypt(data, secretKey);
//   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
// }

export function decrypt(data) {
  try {
    if (!data) {
      console.warn("No data provided for decryption");
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      console.warn("Decryption failed: Empty decrypted string");
      return null;
    }

    return JSON.parse(decryptedText); // Ensure the decrypted text is valid JSON
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null if decryption fails
  }
}
