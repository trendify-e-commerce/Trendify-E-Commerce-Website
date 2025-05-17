#include "AES.hpp"

AES::AES (string key){
     KeyScheduler obj (key);
     roundKeys = obj.getRoundKey();
     
     //Debugging
     // cout<<"Initial Round Key : ";
     // for (const array <uint8_t, 4> & j : roundKeys[0]) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]); cout<<endl;
     // int k = 0;
     // for (auto & i : roundKeys){
     //      cout<<"Round "<<k++<<" : ";
     //      for (const array <uint8_t, 4> & j : i) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]);
     //      cout<<endl;
     // }
}

vector<uint8_t> AES::encrypt(const std::string& plainText) {
    vector<uint8_t> fullCipherText;
    string plainTextPart = "";
    string prevRoundCipherText = "";
    int size = plainText.size();
    for (int i = 0; i < size; i += 16) {
        plainTextPart = plainText.substr(i, 16);
        while (plainTextPart.size() < 16) plainTextPart += ' '; // Padding
        AES_Encrypt AES(roundKeys, plainTextPart, prevRoundCipherText);
        vector<uint8_t> encryptedBlock = AES.encrypt();
        fullCipherText.insert(fullCipherText.end(), encryptedBlock.begin(), encryptedBlock.end());
        prevRoundCipherText = string(encryptedBlock.begin(), encryptedBlock.end()); // CBC chaining
    }
    return fullCipherText;
}

string AES::decrypt(vector<uint8_t>& cipherText) {
    string fullCipherText;
    std::string prevRoundCipherText = "";
    int size = cipherText.size();

    for (int i = 0; i < size; i += 16) {
        vector<uint8_t> cipherTextPart(cipherText.begin() + i, cipherText.begin() + i + 16);
        AES_Decrypt AES(roundKeys, cipherTextPart, prevRoundCipherText);
        string decryptedBlock = AES.decrypt();
        fullCipherText += decryptedBlock;
        prevRoundCipherText = std::string(cipherTextPart.begin(), cipherTextPart.end()); // CBC chaining
    }
    return rstrip(fullCipherText);
}