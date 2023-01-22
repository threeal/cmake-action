cmake_minimum_required(VERSION 3.0)
project(test)

option(CHECK_USING_CLANG "check if target is compiled using Clang" OFF)
option(CHECK_SURPASS_WARNING "check if target could surpass a compiler warning" OFF)

if(CHECK_SURPASS_WARNING)
  if(MSVC)
    set(CMAKE_C_FLAGS "/WX /W4 ${CMAKE_C_FLAGS}")
    set(CMAKE_CXX_FLAGS "/WX /W4 ${CMAKE_CXX_FLAGS}")
  else()
    set(CMAKE_C_FLAGS "-Werror -Wunused-variable ${CMAKE_C_FLAGS}")
    set(CMAKE_CXX_FLAGS "-Werror -Wunused-variable ${CMAKE_CXX_FLAGS}")
  endif()
endif()

enable_testing()
add_executable(hello_world hello_world.cpp)
add_test(NAME hello_world COMMAND $<TARGET_FILE:hello_world>)

list(APPEND LANGS c cpp)
foreach(LANG ${LANGS})
  configure_file(test.in ${CMAKE_CURRENT_BINARY_DIR}/test.${LANG})
  add_executable(test_${LANG} EXCLUDE_FROM_ALL ${CMAKE_CURRENT_BINARY_DIR}/test.${LANG})
  target_compile_definitions(
    test_${LANG} PRIVATE
    $<$<STREQUAL:"${LANG}","c">:IS_C>
    $<$<BOOL:${CHECK_USING_CLANG}>:CHECK_USING_CLANG>
    $<$<BOOL:${CHECK_SURPASS_WARNING}>:CHECK_SURPASS_WARNING>
  )
  add_test(NAME test_${LANG} CONFIGURATIONS test COMMAND $<TARGET_FILE:test_${LANG}>)
endforeach()
