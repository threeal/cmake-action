cmake_minimum_required(VERSION 3.0)
project(test)

option(BUILD_TXT "build hello world txt file" OFF)

add_executable(hello_world hello_world.cpp)

if(BUILD_TXT)
  add_custom_target(
    hello_world_txt ALL
    COMMAND echo "Hello world!" >> ${CMAKE_CURRENT_BINARY_DIR}/hello_world.txt
  )
endif()
