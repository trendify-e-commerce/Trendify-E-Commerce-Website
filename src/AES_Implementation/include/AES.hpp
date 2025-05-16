#pragma once

#include <iostream>
#include <cstdint>
#include <array>
#include <string>
#include "AES_Encryption.hpp"
using namespace std;

class AES{
     array<array<array<uint8_t, 4>, 4>, 11> roundKeys;
     public:
          AES (string Key);
          string encrypt (const string& plainText);
};