# CMake Action

[![latest version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![license](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![test status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure and build a [CMake](https://cmake.org/) project on [GitHub Actions](https://github.com/features/actions).

## Usage

For more information, see [action.yml](./action.yml) and [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | Source directory of the CMake project. Defaults to current directory. |
| `build-dir` | Path | Build directory of the CMake project. Defaults to `build` directory in current directory. |
| `targets` | Multiple strings | List of build targets. |
| `generator` | String | Build system generator of the CMake project. |
| `c-compiler` | String | Preferred executable for compiling C language files. |
| `cxx-compiler` | String | Preferred executable for compiling C++ language files. |
| `c-flags` | Multiple strings | Additional flags passed when compiling C language files. |
| `cxx-flags` | Multiple strings | Additional flags passed when compiling C++ language files. |
| `args` | Multiple strings | Additional arguments passed during the CMake configuration. |

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

> Note: You can replace `@latest` with any version you like.

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
