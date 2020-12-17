# express-instrument-app

Run an express app with instrumentation enabled.

Supported instrumentations:

* log requests to file (enabled by default)
* generate a Swagger specification
* record code coverage

## Installation

```
$ npm install -g https://gitlab.au.oracle.com/mschluet/express-instrument-app.git
$ express-instrument ...
```

Don't forget to `npm update` when this package or one of its dependencies is changed!

## CLI

```
$ express-instrument --help
express-instrument [options..] <app>

Run express app with instrumentation

Positionals:
  app  Path to the server start script

Options:
  --help                    Show help
  --version                 Show version number
  --projectDir, --pdir      Project directory of the app
  --logDir, --ldir          Directory that log files will be written to
  --enable-generator, --eg  Enable spec generation for the app
  --timeout                 Timeout in ms after which endpoints will be listed
  --save-spec, --ss         Save spec to file on process exit
  --specFile, --sfile       File that spec will be written to
  --enable-coverage, --ec   Enable coverage for the app
  --save-coverage, --sc     Save coverage object to file on process exit
  --restore-coverage, --rc  Restore coverage object from file
  --coverageFile, --cfile   File that coverage object will be saved/restored from
  --instrumentDir, --idir   Directory under which files will be covered (resolved from projectDir)
```

## TODO

- [ ] Write some tests
