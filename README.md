# CMake Action

Configure and build your [CMake](https://cmake.org/) project using [GitHub Actions](https://github.com/features/actions). This action simplifies the workflow for configuring the build environment of a CMake project. It can also be optionally specified to build a CMake project using the `cmake --build` command.

## Features

- Configures a CMake project using the [`cmake`](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command.
- Optionally builds a CMake project using the `cmake --build` command.
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
| `run-build` | `true` or `false` | If enabled, it builds the project using CMake. It defaults to `true`. |
| `build-args` | Multiple strings | Additional arguments to pass during the CMake build. |

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
    name: Build Project
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.2

      - name: Configure and Build Project
        uses: threeal/cmake-action@main
```

> **Note**: You can replace `main` with any version you prefer. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

#### Configure Project Without Building

```yaml
- name: Configure Project
  uses: threeal/cmake-action@main
  with:
    run-build: false
```

#### Specify the Source and Build Directories

```yaml
- name: Configure and Build Project
  uses: threeal/cmake-action@main
  with:
    source-dir: submodules
    build-dir: submodules/out
```

#### Using Ninja as the Generator and Clang as the Compiler

```yaml
- name: Setup Ninja
  uses: seanmiddleditch/gha-setup-ninja@v4

- name: Configure and Build Project
  uses: threeal/cmake-action@main
  with:
    generator: Ninja
    c-compiler: clang
    cxx-compiler: clang++
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2023-2024 [Alfi Maulana](https://github.com/threeal/)
