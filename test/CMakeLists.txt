cmake_minimum_required(VERSION 3.0)
project(test)

option(CHECK_USING_CLANG "check if target is compiled using Clang" OFF)

add_executable(hello_world hello_world.cpp)

add_executable(test_c EXCLUDE_FROM_ALL test.c)
target_compile_definitions(test_c PRIVATE $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>)

add_executable(test_cpp EXCLUDE_FROM_ALL test.cpp)
target_compile_definitions(test_cpp PRIVATE $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>)
