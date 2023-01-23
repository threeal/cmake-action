# CMake Action

[![latest version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![license](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![test status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure, build, and test a [CMake](https://cmake.org/) project on [GitHub Actions](https://github.com/features/actions).
Use this action to simplify the workflow run of your CMake project.
This action will configure a build environment for your project using the `cmake` command,
  then it will build your project by running a `cmake --build` command,
  and last it could test your project using the `ctest` command.

## Features

- Configure and build a project using the [cmake](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command.
- Optionally test a project using the [ctest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) command.
- Auto-detect and install required dependencies.
- Specify multiple CMake options directly from the Action inputs.

## Usage

For more information, see [action.yml](./action.yml) and [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | Source directory of the CMake project. Defaults to current directory. |
| `build-dir` | Path | Build directory of the CMake project. Defaults to `build` directory inside the source directory. |
| `targets` | Multiple strings | List of build targets. |
| `run-test` | `true` or `false` | If enabled, run testing using [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html). Defaults to `false`. |
| `generator` | String | Build system generator of the CMake project. |
| `c-compiler` | String | Preferred executable for compiling C language files. |
| `cxx-compiler` | String | Preferred executable for compiling C++ language files. |
| `c-flags` | Multiple strings | Additional flags passed when compiling C language files. |
| `cxx-flags` | Multiple strings | Additional flags passed when compiling C++ language files. |
| `args` | Multiple strings | Additional arguments passed during the CMake configuration. |
| `test-args` | Multiple strings | Additional arguments passed during the CTest run. |

> Note: Multiple strings mean that the input could be specified with more than one value. Separate each value with a space or a new line.

> Note: All inputs are optional.

### Examples

```yaml
name: build
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

> Note: You can replace `@latest` with any version you like. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

#### Specify the Source and the Build Directories

```yaml
- name: Configure and build this project
  uses: threeal/cmake-action@latest
  with:
    source-dir: submodules
    build-dir: submodules/build
```

#### Specify the Build Targets and Additional Options

```yaml
- name: Configure and build this project
  uses: threeal/cmake-action@latest
  with:
    targets: hello_world_test fibonacci_test
    c-flags: -Werror
    cxx-flags: -Werror
    args: |
      -DCMAKE_BUILD_TYPE=Debug
      -DBUILD_TESTING=ON
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
