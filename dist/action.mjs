import 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

/**
 * @internal
 * Retrieves the value of an environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not defined.
 */
function mustGetEnvironment(name) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`the ${name} environment variable must be defined`);
    }
    return value;
}
/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
function getInput(name) {
    const value = process.env[`INPUT_${name.toUpperCase()}`] ?? "";
    return value.trim();
}
/**
 * Sets the value of a GitHub Actions output.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value to set for the GitHub Actions output.
 * @returns A promise that resolves when the value is successfully set.
 */
async function setOutput(name, value) {
    const filePath = mustGetEnvironment("GITHUB_OUTPUT");
    await fsPromises.appendFile(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Logs an error message in GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
function logError(err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stdout.write(`::error::${message}${os.EOL}`);
}

/**
 * Configures the build system of a CMake project.
 *
 * @param context - The action context.
 */
function configureProject(context) {
    const configureArgs = [];
    if (context.sourceDir) {
        configureArgs.push(context.sourceDir);
    }
    configureArgs.push("-B", context.buildDir);
    if (context.configure.generator) {
        configureArgs.push(...["-G", context.configure.generator]);
    }
    configureArgs.push(...context.configure.options.map((opt) => "-D" + opt));
    configureArgs.push(...context.configure.args);
    execFileSync("cmake", configureArgs, { stdio: "inherit" });
}
/**
 * Build a CMake project.
 *
 * @param context - The action context.
 */
function buildProject(context) {
    execFileSync("cmake", ["--build", context.buildDir, ...context.build.args], {
        stdio: "inherit",
    });
}

var shellQuote = {};

var quote;
var hasRequiredQuote;

function requireQuote () {
	if (hasRequiredQuote) return quote;
	hasRequiredQuote = 1;

	quote = function quote(xs) {
		return xs.map(function (s) {
			if (s && typeof s === 'object') {
				return s.op.replace(/(.)/g, '\\$1');
			}
			if ((/["\s]/).test(s) && !(/'/).test(s)) {
				return "'" + s.replace(/(['\\])/g, '\\$1') + "'";
			}
			if ((/["'\s]/).test(s)) {
				return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"';
			}
			return String(s).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, '$1\\$2');
		}).join(' ');
	};
	return quote;
}

var parse;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse;
	hasRequiredParse = 1;

	// '<(' is process substitution operator and
	// can be parsed the same as control operator
	var CONTROL = '(?:' + [
		'\\|\\|',
		'\\&\\&',
		';;',
		'\\|\\&',
		'\\<\\(',
		'\\<\\<\\<',
		'>>',
		'>\\&',
		'<\\&',
		'[&;()|<>]'
	].join('|') + ')';
	var controlRE = new RegExp('^' + CONTROL + '$');
	var META = '|&;()<> \\t';
	var SINGLE_QUOTE = '"((\\\\"|[^"])*?)"';
	var DOUBLE_QUOTE = '\'((\\\\\'|[^\'])*?)\'';
	var hash = /^#$/;

	var SQ = "'";
	var DQ = '"';
	var DS = '$';

	var TOKEN = '';
	var mult = 0x100000000; // Math.pow(16, 8);
	for (var i = 0; i < 4; i++) {
		TOKEN += (mult * Math.random()).toString(16);
	}
	var startsWithToken = new RegExp('^' + TOKEN);

	function matchAll(s, r) {
		var origIndex = r.lastIndex;

		var matches = [];
		var matchObj;

		while ((matchObj = r.exec(s))) {
			matches.push(matchObj);
			if (r.lastIndex === matchObj.index) {
				r.lastIndex += 1;
			}
		}

		r.lastIndex = origIndex;

		return matches;
	}

	function getVar(env, pre, key) {
		var r = typeof env === 'function' ? env(key) : env[key];
		if (typeof r === 'undefined' && key != '') {
			r = '';
		} else if (typeof r === 'undefined') {
			r = '$';
		}

		if (typeof r === 'object') {
			return pre + TOKEN + JSON.stringify(r) + TOKEN;
		}
		return pre + r;
	}

	function parseInternal(string, env, opts) {
		if (!opts) {
			opts = {};
		}
		var BS = opts.escape || '\\';
		var BAREWORD = '(\\' + BS + '[\'"' + META + ']|[^\\s\'"' + META + '])+';

		var chunker = new RegExp([
			'(' + CONTROL + ')', // control chars
			'(' + BAREWORD + '|' + SINGLE_QUOTE + '|' + DOUBLE_QUOTE + ')+'
		].join('|'), 'g');

		var matches = matchAll(string, chunker);

		if (matches.length === 0) {
			return [];
		}
		if (!env) {
			env = {};
		}

		var commented = false;

		return matches.map(function (match) {
			var s = match[0];
			if (!s || commented) {
				return void undefined;
			}
			if (controlRE.test(s)) {
				return { op: s };
			}

			// Hand-written scanner/parser for Bash quoting rules:
			//
			// 1. inside single quotes, all characters are printed literally.
			// 2. inside double quotes, all characters are printed literally
			//    except variables prefixed by '$' and backslashes followed by
			//    either a double quote or another backslash.
			// 3. outside of any quotes, backslashes are treated as escape
			//    characters and not printed (unless they are themselves escaped)
			// 4. quote context can switch mid-token if there is no whitespace
			//     between the two quote contexts (e.g. all'one'"token" parses as
			//     "allonetoken")
			var quote = false;
			var esc = false;
			var out = '';
			var isGlob = false;
			var i;

			function parseEnvVar() {
				i += 1;
				var varend;
				var varname;
				var char = s.charAt(i);

				if (char === '{') {
					i += 1;
					if (s.charAt(i) === '}') {
						throw new Error('Bad substitution: ' + s.slice(i - 2, i + 1));
					}
					varend = s.indexOf('}', i);
					if (varend < 0) {
						throw new Error('Bad substitution: ' + s.slice(i));
					}
					varname = s.slice(i, varend);
					i = varend;
				} else if ((/[*@#?$!_-]/).test(char)) {
					varname = char;
					i += 1;
				} else {
					var slicedFromI = s.slice(i);
					varend = slicedFromI.match(/[^\w\d_]/);
					if (!varend) {
						varname = slicedFromI;
						i = s.length;
					} else {
						varname = slicedFromI.slice(0, varend.index);
						i += varend.index - 1;
					}
				}
				return getVar(env, '', varname);
			}

			for (i = 0; i < s.length; i++) {
				var c = s.charAt(i);
				isGlob = isGlob || (!quote && (c === '*' || c === '?'));
				if (esc) {
					out += c;
					esc = false;
				} else if (quote) {
					if (c === quote) {
						quote = false;
					} else if (quote == SQ) {
						out += c;
					} else { // Double quote
						if (c === BS) {
							i += 1;
							c = s.charAt(i);
							if (c === DQ || c === BS || c === DS) {
								out += c;
							} else {
								out += BS + c;
							}
						} else if (c === DS) {
							out += parseEnvVar();
						} else {
							out += c;
						}
					}
				} else if (c === DQ || c === SQ) {
					quote = c;
				} else if (controlRE.test(c)) {
					return { op: s };
				} else if (hash.test(c)) {
					commented = true;
					var commentObj = { comment: string.slice(match.index + i + 1) };
					if (out.length) {
						return [out, commentObj];
					}
					return [commentObj];
				} else if (c === BS) {
					esc = true;
				} else if (c === DS) {
					out += parseEnvVar();
				} else {
					out += c;
				}
			}

			if (isGlob) {
				return { op: 'glob', pattern: out };
			}

			return out;
		}).reduce(function (prev, arg) { // finalize parsed arguments
			// TODO: replace this whole reduce with a concat
			return typeof arg === 'undefined' ? prev : prev.concat(arg);
		}, []);
	}

	parse = function parse(s, env, opts) {
		var mapped = parseInternal(s, env, opts);
		if (typeof env !== 'function') {
			return mapped;
		}
		return mapped.reduce(function (acc, s) {
			if (typeof s === 'object') {
				return acc.concat(s);
			}
			var xs = s.split(RegExp('(' + TOKEN + '.*?' + TOKEN + ')', 'g'));
			if (xs.length === 1) {
				return acc.concat(xs[0]);
			}
			return acc.concat(xs.filter(Boolean).map(function (x) {
				if (startsWithToken.test(x)) {
					return JSON.parse(x.split(TOKEN)[1]);
				}
				return x;
			}));
		}, []);
	};
	return parse;
}

var hasRequiredShellQuote;

function requireShellQuote () {
	if (hasRequiredShellQuote) return shellQuote;
	hasRequiredShellQuote = 1;

	shellQuote.quote = requireQuote();
	shellQuote.parse = requireParse();
	return shellQuote;
}

var shellQuoteExports = requireShellQuote();

function getContext() {
    const sourceDir = getInput("source-dir");
    const options = [];
    let input = getInput("c-compiler");
    if (input)
        options.push(`CMAKE_C_COMPILER=${input}`);
    input = getInput("cxx-compiler");
    if (input)
        options.push(`CMAKE_CXX_COMPILER=${input}`);
    input = getInput("c-flags");
    if (input) {
        const flags = input.replaceAll(/\s+/g, " ");
        options.push(`CMAKE_C_FLAGS=${flags}`);
    }
    input = getInput("cxx-flags");
    if (input) {
        const flags = input.replaceAll(/\s+/g, " ");
        options.push(`CMAKE_CXX_FLAGS=${flags}`);
    }
    input = getInput("options");
    if (input) {
        options.push(...shellQuoteExports.parse(input).map((opt) => opt.toString()));
    }
    return {
        sourceDir,
        buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
        configure: {
            generator: getInput("generator"),
            options,
            args: shellQuoteExports.parse(getInput("args")).map((arg) => arg.toString()),
        },
        build: {
            enabled: getInput("run-build") == "true",
            args: getInput("build-args")
                .split(/\s+/)
                .filter((arg) => arg != ""),
        },
    };
}

try {
    const context = getContext();
    configureProject(context);
    await setOutput("build-dir", context.buildDir);
    if (context.build.enabled) {
        buildProject(context);
    }
}
catch (err) {
    logError(err);
    process.exit(1);
}
