cmake_minimum_required(VERSION 3.15)
project(GUI C CXX)

# Default build type
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Debug CACHE STRING "Build type" FORCE)
endif()

# C++20 standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler flags
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -DVK_PROTOTYPES")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DVK_PROTOTYPES")

# Include directories
include_directories(include)

# Grab all shared sources from src/
file(GLOB sources
  src/AES_Decryption.cpp
  src/AES_Encryption.cpp
  src/AES.cpp
  src/Helper.cpp
  src/Key_Scheduler.cpp
  src/S_Box.cpp
)

# Build encrypt executable
add_executable(encrypt src/encrypt.cpp ${sources})

# Build decrypt executable
add_executable(decrypt src/decrypt.cpp ${sources})