#pragma once

#include <iostream>
#include <cstdint>
#include <array>
using namespace std;

void swap (uint8_t &a, uint8_t &b);
void reverse (array<array<uint8_t, 4>, 4>& arr, int i, int j, int col);
uint8_t gMultiply(uint8_t a, uint8_t b);
uint8_t gMul(array <uint8_t, 4>& first, array <uint8_t, 4>& second);
string rstrip(const string& str);