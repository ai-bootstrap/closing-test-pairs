// file-utils.ts
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

export const getMD5Hash = async (fileUri: string): Promise<string> => {
  try {
    // 1. Read file as base64 string
    const base64Content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. Convert base64 to binary string
    const binaryStr = atob(base64Content);

    // 3. Create array buffer from binary string
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // 4. Calculate MD5 hash (using expo-crypto v9+ syntax)
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      binaryStr,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    return hash;
  } catch (error) {
    console.error('Error calculating MD5 hash:', error);
    throw new Error('Failed to generate MD5 hash');
  }
};
