# Install script for directory: /Users/wongchunfung/Documents/Faczilla/faczilla/ios/hermes

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
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/external/llvh/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/utils/hermes-lit/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/lib/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/public/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/external/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/API/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/android/intltest/java/com/facebook/hermes/test/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/unsupported/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/tools/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/jsi/cmake_install.cmake")
  include("/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/unittests/cmake_install.cmake")

endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/Users/wongchunfung/Documents/Faczilla/faczilla/ios/build_release/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
