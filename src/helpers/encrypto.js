import CryptoJS from "crypto-js";
import { VITE_CRYPTO_SECRET, VITE_IV } from "./envData";

export const newEncryptData = (text) => {
	const encrypted = CryptoJS.AES.encrypt(
		JSON.stringify(text),
		CryptoJS.enc.Utf8.parse(VITE_CRYPTO_SECRET),
		{
			iv: CryptoJS.enc.Utf8.parse(VITE_IV), // parse the IV
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC,
		}
	).toString();

	return encrypted;
};

export const newDecryptData = (encryptedText) => {
	const decrypted = CryptoJS.AES.decrypt(
		encryptedText,
		CryptoJS.enc.Utf8.parse(VITE_CRYPTO_SECRET),
		{
			iv: CryptoJS.enc.Utf8.parse(VITE_IV), // parse the IV
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC,
		}
	);

	const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
	const parsedDecryptedData = JSON.parse(decryptedText);

	return parsedDecryptedData;
};
