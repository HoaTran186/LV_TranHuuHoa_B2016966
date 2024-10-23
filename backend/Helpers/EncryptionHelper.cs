using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace backend.Helpers
{
    public class EncryptionHelper
    {
        private readonly string _key = "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef";

        // Hàm mã hóa
        public string Encrypt(string plainText)
        {
            using (Aes aesAlg = Aes.Create())
            {
                // Chuyển đổi khóa sang 256-bit thông qua SHA256
                using (var sha256 = SHA256.Create())
                {
                    aesAlg.Key = sha256.ComputeHash(Encoding.UTF8.GetBytes(_key));
                }

                aesAlg.GenerateIV();
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                    }

                    var iv = aesAlg.IV;
                    var encrypted = msEncrypt.ToArray();

                    var result = new byte[iv.Length + encrypted.Length];
                    Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                    Buffer.BlockCopy(encrypted, 0, result, iv.Length, encrypted.Length);

                    return Convert.ToBase64String(result);
                }
            }
        }

        // Hàm giải mã
        public string Decrypt(string cipherText)
        {
            if (!IsBase64String(cipherText))
            {
                throw new FormatException("The input is not a valid Base-64 string.");
            }

            using (Aes aesAlg = Aes.Create())
            {
                byte[] fullCipher = Convert.FromBase64String(cipherText);
                byte[] iv = new byte[aesAlg.BlockSize / 8];
                byte[] cipher = new byte[fullCipher.Length - iv.Length];

                Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
                Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, cipher.Length);

                // Sử dụng cùng cách tạo khóa như trong hàm Encrypt
                using (var sha256 = SHA256.Create())
                {
                    aesAlg.Key = sha256.ComputeHash(Encoding.UTF8.GetBytes(_key));
                }

                aesAlg.IV = iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipher))
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                {
                    return srDecrypt.ReadToEnd();
                }
            }
        }

        // Kiểm tra chuỗi có hợp lệ Base64 hay không
        private bool IsBase64String(string base64)
        {
            Span<byte> buffer = new Span<byte>(new byte[base64.Length]);
            return Convert.TryFromBase64String(base64, buffer, out _);
        }
    }
}
