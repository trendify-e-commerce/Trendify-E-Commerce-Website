#include "AES_Decryption.hpp"

array<array<uint8_t, 4>, 4> AES_Decrypt::cipherTextCalling(const vector <uint8_t>& cipherText){
     bool valid = true;
     array<array<uint8_t, 4>, 4> w;
     for (int i = 0; i < 16; ++i) w[i%4][i/4] = static_cast<uint8_t>(cipherText[i]);
     //Debugging
     //cout<<"Initial Text in uint_8 : "; for (const array <uint8_t, 4> & j : w) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]); cout<<endl;
     return w;
}

void AES_Decrypt::initialTransformation (void){
     for (int i = 0; i < 4; ++i)
          for (int j = 0; j < 4; ++j)
               cipherText[i][j] ^= roundKeys[10][i][j];
}

array<array<uint8_t, 4>, 4> AES_Decrypt::inv_permutation(void){
     array<array<uint8_t, 4>, 4> result = cipherText;
     for (int i = 1; i < 4; ++i){
          reverse(result, 0, 3 - i, i);
          reverse(result, 4 - i, 3, i);
          reverse(result, 0, 3, i);
     }
     return result;
}

array<array<uint8_t,4>,4>AES_Decrypt::invMixColumns(void){
     array<array<uint8_t, 4>, 4> invMixColumnsArray = {{{{0x0E, 0x0B, 0x0D, 0x09}}, {{0x09, 0x0E, 0x0B, 0x0D}}, {{0x0D, 0x09, 0x0E, 0x0B}}, {{0x0B, 0x0D, 0x09, 0x0E}}}};
     array<array<uint8_t, 4>, 4> newcipherText = {{{{0x00, 0x00, 0x00, 0x00}},{{0x00, 0x00, 0x00, 0x00}}, {{0x00, 0x00, 0x00, 0x00}}, {{0x00, 0x00, 0x00, 0x00}}}};
     for (int i = 0; i < 4; ++i)
          for (int j = 0; j < 4; ++j)
               newcipherText[i][j] = gMul(cipherText[i], invMixColumnsArray[j]);
     return newcipherText;
}

void AES_Decrypt::singleRound(int& round){
     cipherText = inv_permutation(); //Shift Rows
     for (int i = 0; i < 4; ++i){
          for (int j = 0; j < 4; ++j) //SBox
               cipherText[i][j] = invSBox[(uint8_t) cipherText[i][j]];
     }
     for (int i = 0; i < 4; ++i) //Key XOR
          for (int j = 0; j < 4; ++j)
               cipherText[i][j] ^= roundKeys[10 - round][i][j];
     if (round != 10) cipherText = invMixColumns(); //Mix Columns
}

AES_Decrypt::AES_Decrypt (const array<array<array<uint8_t, 4>, 4>, 11>& roundKeys, const vector <uint8_t>& cipherText, const string & prevRoundCipherText = ""){
     this->roundKeys = roundKeys;
     uint8_t sBox[256];
     initialize_aes_sbox(sBox);
     initialize_aes_inv_sbox(sBox, invSBox);
     this->prevRoundCipherText = prevRoundCipherText;
     this->cipherText = cipherTextCalling(cipherText);
}

string AES_Decrypt::decrypt() {
     initialTransformation();
     for (int i = 1; i < 11; ++i) singleRound(i);
     string plainText = "";
     if (prevRoundCipherText != "")
          for (int i = 0; i < 16; ++i) plainText += ((static_cast<char>(cipherText[i%4][i/4])) ^ prevRoundCipherText[i]);
     else for (int i = 0; i < 16; ++i) plainText += static_cast<char>(cipherText[i%4][i/4]);
     return plainText;
}