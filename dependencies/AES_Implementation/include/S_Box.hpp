#pragma once

#include <stdint.h>
#define ROTL8(x,shift) ((uint8_t) ((x) << (shift)) | ((x) >> (8 - (shift))))

void initialize_aes_sbox(uint8_t sbox[256]);
void initialize_aes_inv_sbox(const uint8_t sbox[256], uint8_t inv_sbox[256]);