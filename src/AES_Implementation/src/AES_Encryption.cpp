#include "AES_Encryption.hpp"

void swap (uint8_t &a, uint8_t &b){int temp = a; a = b; b = temp;}

void reverse (array<uint8_t, 4>& arr, int i, int j){
     while (j > i) swap(arr[i++], arr[j--]);
}

uint8_t gMultiply(uint8_t a, uint8_t b){
     uint8_t p = 0;
     for (int counter = 0; counter < 8; ++counter) {
          if (b & 1) p ^= a;
          bool hi_bit_set = (a & 0x80);
          a <<= 1;
          if (hi_bit_set) a ^= 0x1b;
          b >>= 1;
     }
     return p;
}

inline uint8_t gMul(array <uint8_t, 4>& first, array <uint8_t, 4>& second){
     uint8_t result = 0x00;
     for (int i = 0; i < 4; ++i) result ^= gMultiply(first[i], second[i]);
     return result;
}

array<array<uint8_t, 4>, 4> AES_Encrypt::plainTextCalling(const string& plainText, const string& prevRoundCipherText){
     bool valid = true;
     if (prevRoundCipherText.size() < 16) valid = false;
     array<array<uint8_t, 4>, 4> w;
     for (int i = 0; i < 16; ++i)
          if (valid) w[i%4][i/4] = static_cast<uint8_t>(plainText[i] ^ prevRoundCipherText[i]);
          else w[i%4][i/4] = static_cast<uint8_t>(plainText[i]);
     //Debugging
     cout<<"Initial Text in uint_8 : "; for (const array <uint8_t, 4> & j : w) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]); cout<<endl;
     return w;
}

void AES_Encrypt::initialTransformation (void){
     for (int i = 0; i < 4; ++i)
          for (int j = 0; j < 4; ++j)
               plainText[i][j] ^= roundKeys[0][i][j];
}

array<array<uint8_t, 4>, 4> AES_Encrypt::permutation(void){
     array<array<uint8_t, 4>, 4> result;
     for (int i = 0; i < 4; ++i)
          for (int j = 0, k = i; j < 4; ++j)
               result[i][j] = plainText[k++%4][j];
     return result;
}

array<array<uint8_t, 4>, 4> AES_Encrypt::mixColumns(void){
     array<array<uint8_t, 4>, 4> mixColumns = {{{{0x02, 0x03, 0x01, 0x01}}, {{0x01, 0x02, 0x03, 0x01}}, {{0x01, 0x01, 0x02, 0x03}}, {{0x03, 0x01, 0x01, 0x02}}}};
     array<array<uint8_t, 4>, 4> newPlainText = {{{{0x00, 0x00, 0x00, 0x00}},{{0x00, 0x00, 0x00, 0x00}}, {{0x00, 0x00, 0x00, 0x00}}, {{0x00, 0x00, 0x00, 0x00}}}};
     for (int i = 0; i < 4; ++i)
          for (int j = 0; j < 4; ++j)
                    newPlainText[i][j] = gMul(plainText[i], mixColumns[j]);
     return newPlainText;
}

void AES_Encrypt::singleRound(int& round){
     for (int i = 0; i < 4; ++i){
          for (int j = 0; j < 4; ++j) //SBox
               plainText[i][j] = sBox[(uint8_t) plainText[i][j]];
     }
     plainText = permutation();
     if (round != 10) plainText = mixColumns(); //Mix Columns
     for (int i = 0; i < 4; ++i) //Key XOR
          for (int j = 0; j < 4; ++j)
               plainText[i][j] ^= roundKeys[round][i][j];
}

AES_Encrypt::AES_Encrypt (const array<array<array<uint8_t, 4>, 4>, 11>& roundKeys, const string& plainText, const string& prevRoundCipherText){
     this->roundKeys = roundKeys;
     initialize_aes_sbox(sBox);
     this->plainText = plainTextCalling(plainText, prevRoundCipherText);
}

string AES_Encrypt::encrypt (void){
     initialTransformation();
     for (int i = 1; i < 11; ++i) singleRound(i);

     //Debugging
     cout<<"Encrypted Text in uint_8 : "; for (const array <uint8_t, 4> & j : plainText) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]); cout<<endl;

     string cipherText;
     for (int i = 0; i < 16; ++i) cipherText += static_cast<char>(plainText[i/4][i%4]);
     return cipherText;
}