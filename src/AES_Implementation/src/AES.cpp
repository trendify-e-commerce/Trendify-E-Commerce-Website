#include "AES.hpp"

AES::AES (string key){
     KeyScheduler obj (key);
     roundKeys = obj.getRoundKey();
     
     //Debugging
     cout<<"Initial Round Key : ";
     for (const array <uint8_t, 4> & j : roundKeys[0]) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]); cout<<endl;
     // int k = 0;
     // for (auto & i : roundKeys){
     //      cout<<"Round "<<k++<<" : ";
     //      for (const array <uint8_t, 4> & j : i) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]);
     //      cout<<endl;
     // }
}

string AES::encrypt (const string& plainText){
     string encryptedText = "", prevRoundCipherText = "";
     int size = plainText.size(); string plainTextPart = "";
     for (int i = 0; i < size; i += 16){
          try {
               plainTextPart = plainText.substr(i, 16);
          } catch (out_of_range &e) {
               plainTextPart = plainText.substr(i);
               while (plainTextPart.size() != 16) plainTextPart += 'x';
          } AES_Encrypt AES(roundKeys, plainTextPart, prevRoundCipherText);
          prevRoundCipherText = AES.encrypt();
          encryptedText += prevRoundCipherText;
     } return encryptedText;
}