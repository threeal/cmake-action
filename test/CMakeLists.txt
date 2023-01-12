cmake_minimum_required(VERSION 3.0)
project(test)

option(CHECK_USING_CLANG "check if target is compiled using Clang" OFF)

add_executable(hello_world hello_world.cpp)

list(APPEND LANGS c cpp)
foreach(LANG ${LANGS})
  configure_file(test.in ${CMAKE_CURRENT_BINARY_DIR}/test.${LANG})
  add_executable(test_${LANG} EXCLUDE_FROM_ALL ${CMAKE_CURRENT_BINARY_DIR}/test.${LANG})
  target_compile_definitions(
    test_${LANG} PRIVATE
    $<$<STREQUAL:"${LANG}","c">:IS_C>
    $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>
  )
endforeach()
