# CMake Action

[![latest version](https://img.shields.io/github/v/release/threeal/cmake-action)](https://github.com/threeal/cmake-action/releases/)
[![license](https://img.shields.io/github/license/threeal/cmake-action)](./LICENSE)
[![test status](https://img.shields.io/github/actions/workflow/status/threeal/cmake-action/test.yml?label=test&branch=main)](https://github.com/threeal/cmake-action/actions/workflows/test.yml)

Configure and build [CMake](https://cmake.org/) project on [GitHub Actions](https://github.com/features/actions).

## Usage

For more information, see [action.yml](./action.yml) and [GitHub Actions guide](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

### Inputs

> Note: All inputs are optional.

| Name | Value Type | Description |
| --- | --- | --- |
| `source-dir` | Path | Source directory of the CMake project. Defaults to current directory. |
| `build-dir` | Path | Build directory of the CMake project. Defaults to `build` directory in current directory. |
| `targets` | Multiple strings | List of build targets. Could be specified more than one. Separate each target with a space or a new line. |
| `generator` | String | Build system generator of the CMake project. |
| `c-compiler` | String | Preferred executable for compiling C language files. |
| `cxx-compiler` | String | Preferred executable for compiling CXX language files. |
| `args` | Multiple strings | Additional arguments passed during the CMake configuration. Could be specified more than one. Separate each target with a space or a new line. |
