cmake_minimum_required(VERSION 3.0)
project(test)

option(BUILD_C "build hello world in C Language" OFF)
option(BUILD_CXX "build hello world in CXX Language" ON)
option(BUILD_TXT "build hello world txt file" OFF)

if(BUILD_C)
  add_executable(hello_world_c hello_world.c)
endif()

if(BUILD_CXX)
  add_executable(hello_world hello_world.cpp)
endif()

if(BUILD_TXT)
  add_custom_target(
    hello_world_txt ALL
    COMMAND echo "Hello world!" >> ${CMAKE_CURRENT_BINARY_DIR}/hello_world.txt
  )
endif()
