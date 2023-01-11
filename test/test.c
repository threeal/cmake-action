#include <stdio.h>

int main() {
#if defined(CHECK_USING_CLANG) && !defined(__clang__)
  printf("compiler is not clang\n");
  return 1;
#endif
  printf("all ok\n");
  return 0;
}
