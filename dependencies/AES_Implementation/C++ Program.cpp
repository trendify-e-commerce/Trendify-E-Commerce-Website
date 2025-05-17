#include <iostream>
#include <array>
using namespace std;

void swap (int &a, int &b){int temp = a; a = b; b = temp;}
void reverse (array<array<int, 4>, 4>& arr, int i, int j, int col){
     while (j > i) swap(arr[i++][col], arr[j--][col]);
}
array<array<int, 4>, 4> permutation(array<array<int, 4>, 4>& plainText){
     array<array<int, 4>, 4> result = plainText;
     for (int i = 1; i < 4; ++i){
          reverse(result, 0, i - 1, i);
          reverse(result, i, 3, i);
          reverse(result, 0, 3, i);
     }
     return result;
}
array<array<int, 4>, 4> inv_permutation(array<array<int, 4>, 4>& plainText){
     array<array<int, 4>, 4> result = plainText;
     for (int i = 1; i < 4; ++i){
          reverse(result, 0, 3 - i, i);
          reverse(result, 4 - i, 3, i);
          reverse(result, 0, 3, i);
     }
     return result;
}
int main() {
     array<array<int, 4>, 4> plainText = {{
          {{1, 2, 3, 4}},
          {{5, 6, 7, 8}},
          {{9, 10, 11, 12}},
          {{13, 14, 15, 16}}
     }};
     array<array<int, 4>, 4> result = permutation(plainText);
     for (int i = 0; i < 4; ++i){
          for(int j = 0; j < 4; ++j)
               cout<<result[i][j]<<" ";
          cout<<endl;
     } cout<<endl;
     result = inv_permutation(result);
     for (int i = 0; i < 4; ++i){
          for(int j = 0; j < 4; ++j)
               cout<<result[i][j]<<" ";
          cout<<endl;
     }
     return 0;
}