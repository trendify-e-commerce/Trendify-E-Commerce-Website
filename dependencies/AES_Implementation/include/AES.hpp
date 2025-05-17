#pragma once

#include <iostream>
#include <cstdint>
#include <array>
#include <string>
#include "AES_Encryption.hpp"
#include "AES_Decryption.hpp"
#include "Helper.hpp"
using namespace std;

class AES{
     array<array<array<uint8_t, 4>, 4>, 11> roundKeys;
     public:
          AES (string Key);
          vector<uint8_t> encrypt(const std::string& plainText);
          string decrypt(vector<uint8_t>& cipherText);
};