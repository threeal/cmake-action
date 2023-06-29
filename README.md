# CMake Action

[![Latest Version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![License](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![Test Status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure, build, and test your [CMake](https://cmake.org/) project using [GitHub Actions](https://github.com/features/actions). This action simplifies the workflow for your CMake project. It configures the build environment using the `cmake` command, builds the project using the `cmake --build` command, and optionally tests the project using the `ctest` command.

## Features

- Configures and builds a project using the [cmake](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command.
- Option to test a project using the [ctest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) command.
- Auto-detects and installs required dependencies.
- Supports specifying multiple CMake options directly from the Action inputs.

## Usage

For more information, refer to [action.yml](./action.yml) and the [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | Source directory of the CMake project. Defaults to the current directory. |
| `build-dir` | Path | Build directory of the CMake project. Defaults to the `build` directory inside the source directory. |
| `targets` | Multiple strings | List of build targets. |
| `generator` | String | Build system generator for the CMake project. |
| `c-compiler` | String | Preferred executable for compiling C language files. |
| `cxx-compiler` | String | Preferred executable for compiling C++ language files. |
| `c-flags` | Multiple strings | Additional flags passed when compiling C language files. |
| `cxx-flags` | Multiple strings | Additional flags passed when compiling C++ language files. |
| `args` | Multiple strings | Additional arguments passed during CMake configuration. |
| `run-test` | `true` or `false` | If enabled, runs testing using [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html). Defaults to `false`. |
| `test-args` | Multiple strings | Additional arguments passed during the CTest run. |

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
      - name: Check out this repository
        uses: actions/checkout@v3.3.0

      - name: Configure and build this project
        uses: threeal/cmake-action@latest
```

> Note: You can replace `@latest` with any version you prefer. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

#### Specify the Source and Build Directories

```yaml
- name: Configure and build this project
  uses: threeal/cmake-action@latest
  with:
    source-dir: submodules
    build-dir: submodules/out
```

#### Specify the Build Targets

```yaml
- name: Configure and build this project
  uses: threeal/cmake-action@latest
  with:
    targets: hello_mars hello_sun
```

#### Run Unit Tests After Build

```yaml
- name: Configure, build, and test this project
  uses: threeal/cmake-action@latest
  with:
    args: -DBUILD_TESTING=ON
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
