# CMake Action

Configure and build [CMake](https://cmake.org/) projects on [GitHub Actions](https://github.com/features/actions).

This action wraps the [`cmake`](https://cmake.org/cmake/help/latest/manual/cmake.1.html) command for configuring and building CMake projects. It provides a more streamlined syntax for specifying build options compared to calling the `cmake` command directly.

## Available Inputs

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | The source directory of the CMake project. Defaults to the current working directory. |
| `build-dir` | Path | The build directory of the CMake project. Defaults to the `build` directory inside the source directory. |
| `generator` | String | The build system generator for the CMake project. Equivalent to setting the `-G` option. |
| `c-compiler` | String | The preferred executable for compiling C language files. Equivalent to defining the `CMAKE_C_COMPILER` variable. |
| `cxx-compiler` | String | The preferred executable for compiling C++ language files. Equivalent to defining the `CMAKE_CXX_COMPILER` variable. |
| `c-flags` | Multiple strings | Additional flags to pass when compiling C language files. Equivalent to defining the `CMAKE_C_FLAGS` variable. |
| `cxx-flags` | Multiple strings | Additional flags to pass when compiling C++ language files. Equivalent to defining the `CMAKE_CXX_FLAGS` variable. |
| `options` | Multiple strings | Additional options to pass during the CMake configuration. Equivalent to setting the `-D` option. |
| `args` | Multiple strings | Additional arguments to pass during the CMake configuration. |
| `run-build` | `true` or `false` | If enabled, builds the project using CMake. Defaults to `true`. |
| `build-args` | Multiple strings | Additional arguments to pass during the CMake build. |

## Available Outputs

| Name | Value Type | Description |
| --- | --- | --- |
| `build-dir` | Path | The build directory of the CMake project. |

## Example Usages

This example demonstrates how to use this action to configure and build a CMake project in a GitHub Actions workflow:

```yaml
name: Build
on:
  push:
jobs:
  build-project:
    name: Build Project
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout Project
        uses: actions/checkout@v4.2.2

      - name: Build Project
        uses: threeal/cmake-action@v2.1.0
```

### Specify the Source and Build Directories

By default, this action uses the current working directory as the source directory and the `build` directory inside the source directory as the build directory. To use different directories, set the `source-dir` and/or `build-dir` inputs:

```yaml
- name: Build Project
  uses: threeal/cmake-action@v2.1.0
  with:
    source-dir: source
    build-dir: output
```

### Specify Build System Generator and Compiler

The following example demonstrates how to use this action to configure and build the project using [Ninja](https://ninja-build.org/) as the build system generator and [Clang](https://clang.llvm.org/) as the compiler:

```yaml
- name: Setup Ninja
  uses: seanmiddleditch/gha-setup-ninja@v5

- name: Build Project
  uses: threeal/cmake-action@v2.1.0
  with:
    generator: Ninja
    cxx-compiler: clang++
```

### Specify Additional Options

Use the `options` input to specify additional options for configuring a project:

```yaml
- name: Build Project
  uses: threeal/cmake-action@v2.1.0
  with:
    options: |
      BUILD_TESTS=ON
      BUILD_EXAMPLES=ON
```

The above example is equivalent to calling the `cmake` command with the `-DBUILD_TESTS=ON` and `-DBUILD_EXAMPLES=ON` arguments.

### Configure Project Without Building

By default, this action builds the project after configuration. To skip the build process, set the `run-build` option to `false`:

```yaml
- name: Configure Project
  uses: threeal/cmake-action@v2.1.0
  with:
    run-build: false
```

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

Copyright © 2023-2024 [Alfi Maulana](https://github.com/threeal/)
