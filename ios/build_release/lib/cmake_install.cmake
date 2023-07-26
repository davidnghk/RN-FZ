# Install script for directory: /Users/wongchunfung/Documents/Faczilla/faczilla/ios/hermes/lib

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/usr/bin/objdump")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/VM/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/Inst/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/FrontEndDefs/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/CompilerDriver/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/DependencyExtractor/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/ADT/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/AST/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/AST2JS/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/FlowParser/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/Parser/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/SourceMap/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/Support/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/BCGen/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/ConsoleHost/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/Regex/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/Platform/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/InternalBytecode/cmake_install.cmake")

endif()

