# CMake Action

[![Latest Version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![License](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/build.yaml?branch=main)](https://github.com/threeal/cmake-action/actions/workflows/build.yaml)
[![Test Status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure, build, and test your [CMake](https://cmake.org/) project using [GitHub Actions](https://github.com/features/actions). This action simplifies the workflow for configuring the build environment of a CMake project. It can also be optionally specified to build a CMake project using the `cmake --build` command and test it using the `ctest` command.

## Features

- Configures a CMake project using the [`cmake`](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command.
- Optionally builds a CMake project using the `cmake --build` command.
- Optionally tests a CMake project using the [`ctest`](https://cmake.org/cmake/help/latest/manual/ctest.1.html) command.
- Auto-detects and installs required dependencies.
- Supports specifying multiple CMake options directly from the action inputs.

## Usage

For more information, refer to [action.yml](./action.yml) and the [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | The source directory of the CMake project. It defaults to the current directory. |
| `build-dir` | Path | The build directory of the CMake project. It defaults to the `build` directory inside the source directory. |
| `generator` | String | The build system generator for the CMake project. It appends the CMake configuration arguments with `-G [val]`. |
| `c-compiler` | String | The preferred executable for compiling C language files. It appends the CMake configuration arguments with `-D CMAKE_C_COMPILER=[val]`. |
| `cxx-compiler` | String | The preferred executable for compiling C++ language files. It appends the CMake configuration arguments with `-D CMAKE_CXX_COMPILER=[val]`. |
| `c-flags` | Multiple strings | Additional flags to pass when compiling C language files. It appends the CMake configuration arguments with `-D CMAKE_C_FLAGS=[vals]`. |
| `cxx-flags` | Multiple strings | Additional flags to pass when compiling C++ language files. It appends the CMake configuration arguments with `-D CMAKE_CXX_FLAGS=[vals]`. |
| `options` | Multiple strings | Additional options to pass during the CMake configuration. It appends the CMake configuration arguments with each of `-D [val]`. |
| `args` | Multiple strings | Additional arguments to pass during the CMake configuration. |
| `run-build` | `true` or `false` | If enabled, it builds the project using CMake. It defaults to `false`. |
| `build-args` | Multiple strings | Additional arguments to pass during the CMake build. |
| `run-test` | `true` or `false` | If enabled, it runs testing using [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html). It defaults to `false`. |
| `test-args` | Multiple strings | Additional arguments to pass during the CTest run. |

> **Note**: Multiple strings mean that the input can be specified with more than one value. Separate each value with a space or a new line.

> **Note**: All inputs are optional.

### Outputs

| Name | Value Type | Description |
| --- | --- | --- |
| `build-dir` | Path | The build directory of the CMake project. |

### Examples

```yaml
name: Build
on:
  push:
jobs:
  build-project:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v3.5.3

      - name: Configure the project
        uses: threeal/cmake-action@v1.3.0

      - name: Build the project
        runs: cmake --build build

      - name: Test the project
        runs: ctest --test-dir build
```

> **Note**: You can replace [`v1.3.0`](https://github.com/threeal/cmake-action/releases/tag/v1.3.0) with any version you prefer. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

#### Configure, Build, and Test in the Same Step

```yaml
- name: Configure, build, and test the project
  uses: threeal/cmake-action@v1.3.0
  with:
    run-build: true
    run-test: true
```

#### Specify the Source and Build Directories

```yaml
- name: Configure the project
  uses: threeal/cmake-action@v1.3.0
  with:
    source-dir: submodules
    build-dir: submodules/out
```

#### Using Ninja as the Generator and Clang as the Compiler

```yaml
- name: Configure the project
  uses: threeal/cmake-action@v1.3.0
  with:
    generator: Ninja
    c-compiler: clang
    cxx-compiler: clang++
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2023 [Alfi Maulana](https://github.com/threeal/)
