#include <iostream>
#include <vector>
#include <cstdint>
#include "AES.hpp"

int main(){
    std::string KEY = "2b7e151628aed2a6";
    std::string hexLine;
    std::getline(std::cin, hexLine);
    std::vector<uint8_t> cipherText;
    cipherText.reserve(hexLine.size() / 2);
    for (std::size_t i = 0; i < hexLine.size(); i += 2)
          cipherText.push_back(static_cast<uint8_t>(std::stoi(hexLine.substr(i, 2), nullptr, 16)));
    AES aes(KEY);
    string plainText = aes.decrypt(cipherText);
    cout << plainText << '\n';
    return 0;
}