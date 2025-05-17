#pragma once

#include <iostream>
#include <cstdint>
#include <array>
#include <vector>
#include "Key_Scheduler.hpp"
#include "Helper.hpp"
using namespace std;

class AES_Decrypt{
     array<array<uint8_t, 4>, 4> cipherText;
     array<array<array<uint8_t, 4>, 4>, 11> roundKeys;
     string prevRoundCipherText;
     uint8_t invSBox[256];
     array<array<uint8_t, 4>, 4> cipherTextCalling(const vector <uint8_t>& cipherText);
     void initialTransformation (void);
     array<array<uint8_t, 4>, 4> inv_permutation(void);
     array<array<uint8_t,4>,4>invMixColumns(void);
     void singleRound(int& round);
     public:
          AES_Decrypt (const array<array<array<uint8_t, 4>, 4>, 11>& roundKeys, const vector <uint8_t>& cipherText, const string & prevRoundCipherText);
          string decrypt();
};