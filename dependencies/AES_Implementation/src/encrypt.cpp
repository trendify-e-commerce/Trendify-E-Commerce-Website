#include <iostream>
#include "AES.hpp"
using namespace std;
int main() {
    string KEY = "2b7e151628aed2a6";
    string plainText;
    getline(cin, plainText);
    AES aes(KEY);
    std::vector<uint8_t> ciphertext = aes.encrypt(plainText);
    for (size_t i = 0; i < ciphertext.size(); ++i)
        printf("%02X", ciphertext[i]);
    std::cout << std::endl;
    return 0;
}
