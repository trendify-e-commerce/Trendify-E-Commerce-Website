#include "Helper.hpp"

void swap (uint8_t &a, uint8_t &b){uint8_t temp = a; a = b; b = temp;}

void reverse (array<array<uint8_t, 4>, 4>& arr, int i, int j, int col){
     while (j > i) swap(arr[i++][col], arr[j--][col]);
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

uint8_t gMul(array <uint8_t, 4>& first, array <uint8_t, 4>& second){
     uint8_t result = 0x00;
     for (int i = 0; i < 4; ++i) result ^= gMultiply(first[i], second[i]);
     return result;
}

string rstrip(const string& str){
    size_t end = str.size();
    while (end > 0 && std::isspace(static_cast<unsigned char>(str[end - 1]))) --end;
    return str.substr(0, end);
}