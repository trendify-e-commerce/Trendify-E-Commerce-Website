#include "Key_Scheduler.hpp"

array<uint8_t, 4> operator ^ (array<uint8_t, 4> w, array<uint8_t, 4> g){
     int sizeW = w.size(), sizeG = g.size();
     array<uint8_t, 4> result = w;
     for (int i = 0; i < sizeW && i < sizeG; ++i) result[i] ^= (unsigned int)g[i];
     return result;
}

array<array<uint8_t, 4>, 4> KeyScheduler::keyCalling(const string& key){
     array<array<uint8_t, 4>, 4> w;
     int size = key.size();
     if (size < 16) throw string("AES-128 requires 16-byte key...");
     for (int i = 0; i < 16; ++i) w[i%4][i/4] = static_cast<uint8_t>(key[i]); //Column Major
     return w;
}

array<uint8_t, 4> KeyScheduler::g_function (array<uint8_t, 4> word){
     /*1. 1 - Left Circular Shift
          2. S-Box Substitution
          3. XOR with Round Araay : [Rconst, 0, 0, 0]*/
     array<uint8_t, 4> roundArray = {roundConstants[10 - noOfRounds - 1], 0x00, 0x00, 0x00};
     uint8_t temp = sBox[(uint8_t) word[0]];
     for (int i = 0; i < 3; ++i) word[i] = sBox[(uint8_t) word[i + 1]];
     word[3] = temp;
     word = word ^ roundArray;
     return word;
}

array<array<uint8_t, 4>, 4> KeyScheduler::roundKeysGeneration (array<array<uint8_t, 4>, 4> w){
     array<uint8_t, 4> g = g_function(w[3]);
     w[0] = w[0] ^ g;
     for (int i = 1; i < 4; ++i) w[i] = w[i] ^ w[i - 1]; 
     return w;
}

KeyScheduler::KeyScheduler(const string& key){
     noOfRounds = 10;
     roundConstants = std::array<uint8_t, 10>{0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36};
     try{roundKeys[0] = keyCalling(key);}
     catch (string &e){throw e;}
     initialize_aes_sbox(sBox);
     while (noOfRounds--)
          roundKeys[11 - noOfRounds - 1] = roundKeysGeneration(roundKeys[11 - noOfRounds - 2]);
}

array<array<array<uint8_t, 4>, 4>, 11> KeyScheduler::getRoundKey(void){return roundKeys;}