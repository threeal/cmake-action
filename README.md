# CMake Action

[![Latest Version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![License](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![Test Status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure, build, and test your [CMake](https://cmake.org/) project using [GitHub Actions](https://github.com/features/actions). This action simplifies the workflow for your CMake project. It configures the build environment using the `cmake` command, and optionally builds the project using the `cmake --build` command and tests the project using the `ctest` command.

## Features

- Configures a project using the [`cmake`](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command.
- Option to build a project using the `cmake --build` command.
- Option to test a project using the [`ctest`](https://cmake.org/cmake/help/latest/manual/ctest.1.html) command.
- Auto-detects and installs required dependencies.
- Supports specifying multiple CMake options directly from the Action inputs.

## Usage

For more information, refer to [action.yml](./action.yml) and the [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | The source directory of the CMake project. It defaults to the current directory. |
| `build-dir` | Path | The build directory of the CMake project. It defaults to the `build` directory inside the source directory. |
| `generator` | String | The build system generator for the CMake project. |
| `c-compiler` | String | The preferred executable for compiling C language files. |
| `cxx-compiler` | String | The preferred executable for compiling C++ language files. |
| `c-flags` | Multiple strings | Additional flags to pass when compiling C language files. |
| `cxx-flags` | Multiple strings | Additional flags to pass when compiling C++ language files. |
| `args` | Multiple strings | Additional arguments to pass during the CMake configuration. |
| `run-build` | `true` or `false` | If enabled, it builds the project using [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html). It defaults to `false`. |
| `build-args` | Multiple strings | Additional arguments to pass during the CMake build. |
| `run-test` | `true` or `false` | If enabled, it runs testing using [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html). It defaults to `false`. |
| `test-args` | Multiple strings | Additional arguments to pass during the CTest run. |

> Note: Multiple strings mean that the input can be specified with more than one value. Separate each value with a space or a new line.

> Note: All inputs are optional.

### Examples

```yaml
name: Build
on:
  push:
jobs:
  build-project:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v3.3.0

      - name: Configure the project
        uses: threeal/cmake-action@latest
```

> Note: You can replace `@latest` with any version you prefer. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

#### Specify the Source and Build Directories

```yaml
- name: Configure the project
  uses: threeal/cmake-action@latest
  with:
    source-dir: submodules
    build-dir: submodules/out
```

#### Configure, Build, and Test in the Same Step

```yaml
- name: Configure, build, and test the project
  uses: threeal/cmake-action@latest
  with:
    args: -DBUILD_TESTING=ON
    run-build: true
    run-test: true
```

#### Using Ninja as the Generator and Clang as the Compiler

```yaml
- name: Configure and build this project
  uses: threeal/cmake-action@latest
  with:
    generator: Ninja
    c-compiler: clang
    cxx-compiler: clang++
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2023 [Alfi Maulana](https://github.com/threeal/)
