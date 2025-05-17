#pragma once

#include <iostream>
#include <cstdint>
#include <array>
#include <vector>
#include "Key_Scheduler.hpp"
#include "Helper.hpp"
using namespace std;

class AES_Encrypt{
     array<array<uint8_t, 4>, 4> plainText;
     array<array<array<uint8_t, 4>, 4>, 11> roundKeys;
     uint8_t sBox[256];
     array<array<uint8_t, 4>, 4> plainTextCalling(const string& plainText, const string& prevRoundCipherText);
     void initialTransformation (void);
     array<array<uint8_t, 4>, 4> permutation(void);
     array<array<uint8_t, 4>, 4> mixColumns(void);
     void singleRound(int& round);
     public:
          AES_Encrypt (const array<array<array<uint8_t, 4>, 4>, 11>& roundKeys, const string& plainText, const string& prevRoundCipherText = "");
          vector<uint8_t> encrypt();
};