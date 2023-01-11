cmake_minimum_required(VERSION 3.0)
project(test)

option(BUILD_C "build hello world in C Language" OFF)
option(BUILD_CXX "build hello world in CXX Language" ON)

option(CHECK_USING_CLANG "check if target is compiled using Clang" OFF)

if(BUILD_C)
  add_executable(hello_world_c hello_world.c)
endif()

if(BUILD_CXX)
  add_executable(hello_world hello_world.cpp)
endif()

add_executable(test_c EXCLUDE_FROM_ALL test.c)
target_compile_definitions(test_c PRIVATE $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>)

add_executable(test_cpp EXCLUDE_FROM_ALL test.cpp)
target_compile_definitions(test_cpp PRIVATE $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>)
