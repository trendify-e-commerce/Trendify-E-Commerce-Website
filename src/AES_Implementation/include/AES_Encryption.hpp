#pragma once

#include <iostream>
#include <cstdint>
#include <array>
#include "Key_Scheduler.hpp"
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
          string encrypt (void);
};

void swap (uint8_t &a, uint8_t &b);
void reverse (array<uint8_t, 4>& arr, int i, int j);
uint8_t gMultiply(uint8_t a, uint8_t b);
inline uint8_t gMul(array <uint8_t, 4>& first, array <uint8_t, 4>& second);