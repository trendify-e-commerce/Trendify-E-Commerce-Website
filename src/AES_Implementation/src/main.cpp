#include <iostream>
#include <cstdio>
#include "Key_Scheduler.hpp"
#include "AES.hpp"
using namespace std;
int main (){
     string key = "2b7e151628aed2a6";
     // try{
     //      KeyScheduler obj (key);
     //      array<array<array<uint8_t, 4>, 4>, 11> roundKeys = obj.getRoundKey();
     //      cout<<"Initial Round Key : ";
     //      for (const array <uint8_t, 4> & j : roundKeys[0]) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]);
     //      // int k = 0;
     //      // for (auto & i : roundKeys){
     //      //      cout<<"Round "<<k++<<" : ";
     //      //      for (const array <uint8_t, 4> & j : i) printf("%02X%02X%02X%02X ", j[0], j[1], j[2], j[3]);
     //      //      cout<<endl;
     //      // }
     //      cout<<endl;
     //      AES_Encrypt AES(roundKeys, "KhajanBhatt24042");
     //      cout<<"Encrypted Text : "<<AES.encrypt()<<endl;
     // } catch (exception & e){
     //      cout<<e.what();
     // }
     AES obj (key);
     string encrypt = obj.encrypt("KhajanBhatt24042005");
     cout<<"Encrypted Text : "<<encrypt;
}