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
        uses: actions/checkout@v4.1.7

      - name: Configure and Build Project
        uses: threeal/cmake-action@main
```

> **Note**: You can replace `main` with any version you prefer. See [this](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses).

### Configure Project Without Building

```yaml
- name: Configure Project
  uses: threeal/cmake-action@main
  with:
    run-build: false
```

### Specify the Source and Build Directories

```yaml
- name: Configure and Build Project
  uses: threeal/cmake-action@main
  with:
    source-dir: submodules
    build-dir: submodules/out
```

### Using Ninja as the Generator and Clang as the Compiler

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
