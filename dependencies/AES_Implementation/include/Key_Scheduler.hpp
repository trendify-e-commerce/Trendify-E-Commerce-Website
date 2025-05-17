#pragma once

#include <iostream>
#include <array>
#include <cstdint>
#include "S_Box.hpp"
using namespace std;

class KeyScheduler{
     array<array<array<uint8_t, 4>, 4>, 11> roundKeys;
     unsigned int noOfRounds;
     uint8_t sBox[256];
     array<uint8_t, 10> roundConstants;
     array<array<uint8_t, 4>, 4> keyCalling (const string& key); //Initial Transformation Key
     array<uint8_t, 4> g_function (array<uint8_t, 4> word);
     array<array<uint8_t, 4>, 4> roundKeysGeneration (array<array<uint8_t, 4>, 4> w);
     friend array<uint8_t, 4>operator ^ (array<uint8_t, 4>w, array<uint8_t, 4> g);
     public:
          KeyScheduler(const string& key);
          array<array<array<uint8_t, 4>, 4>, 11> getRoundKey(void);
};

//Operator Overloading of ^ using Friend Function
array<uint8_t, 4> operator ^ (array<uint8_t, 4> w, array<uint8_t, 4> g);