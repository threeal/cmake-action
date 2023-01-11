#include <iostream>

int main() {
#if defined(CHECK_USING_CLANG) && !defined(__clang__)
  std::cout << "compiler is not clang" << std::endl;
  return 1;
#endif
  std::cout << "all ok" << std::endl;
  return 0;
}
