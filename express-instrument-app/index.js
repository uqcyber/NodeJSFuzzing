const fs = require('fs')
const path = require('path')
const Hook = require('require-in-the-middle')
const im = require('istanbul-middleware')
const moment = require('moment')
const onExit = require('signal-exit')
const debug = require('debug')('express-instrument-app')
const utils = require('istanbul').utils

let taintReports = []

function registerMiddleware (app, options) {

  if (options.enableTaint && typeof J$ !== undefined && J$.addLogCb !== undefined) {
    console.log("Registering an Affogato callback");
    J$.addLogCb((...args) => {
      if (args.length == 1 && Array.isArray(args[0])) {
        let reports = args[0];
        for (report of reports) {
          if (report.hasOwnProperty('source') && report.hasOwnProperty('sink')) {
            taintReports.push(report);
          }
        }
      }
    });

    let taintMw = (req, res, next) => {
      for (report of taintReports) {
        res.append(`taint-${report.source.reqtrackId}`, report.sink.type);
      }
      taintReports = [];
      next()
    }
    app.use(taintMw)
  }

  if (options.enableCoverage) {
    let covGen = (req, res, next) => {
      getCoverage(req, res)
      next()
    }

    app.use('/coverage', im.createHandler())
    app.use(covGen)
  }

  function getCoverage(req, res) {
    coverageStore = getCoverageInfo(getCoverageObject())

    if (res && !res.get('coverage')) {
      // Use response end function to add header
      coverageObject = getCoverageInfo(getCoverageObject())
      res.append("coverage", JSON.stringify(coverageObject.coverage))
      res.__send = res.send
      res.send = function() {
        coverageObject = getCoverageInfo(getCoverageObject())
        res.set("coverage", JSON.stringify(coverageObject.coverage))

        res.__send.apply(res, arguments)
      }
    } else {
      return coverageStore
    }
  }

  const packagePath = path.resolve(options.projectDir, 'package.json')
  const appName = fs.existsSync(packagePath) ? require(packagePath).name : 'express'
  let logFile = options.logFile ?
             `${path.resolve(options.logFile)}` :
             `${path.resolve(options.logDir, appName)}-${moment().format()}.log`

  function simpleLogger(req, res, next) {
    if (!res.__end) {
      res.__end = res.end

      res.end = function() {
        try {
          let obj = getCoverage(req)
          obj = obj.coverage
          fs.appendFile(logFile, JSON.stringify(obj) + "\n", function(error) {
            if (error) { console.log("Failed to write to log file.") }
          })
        } catch (err) {
          console.log(err);
        }
        res.__end.apply(res, arguments)
      }
    }
    next()
  }

  app.use(simpleLogger);
}

function getCoverageInfo(coverageObject) {
  // NOTE: coverage achieved corresponds to req iff requests are not handled in parallel
  const summary = utils.summarizeCoverage(coverageObject)
  // delete line coverage metrics
  delete summary.lines
  delete summary.linesCovered
  return {coverage: summary}
}

function hookWithOptions (options) {
  function hook (exports, name, basedir) {
    // TODO: log source location
    debug('Return express module wrapper function')
    // TODO: figure out base express app
    const wrapper = function () {
      // TODO: log source location
      debug('Create express app')
      const app = exports()
      registerMiddleware(app, options)
      return app
    }
    Object.assign(wrapper, exports)
    return wrapper
  }
  return hook
}

function setCoverageObject (obj) {
  global.__coverage__ = obj
}

function getCoverageObject () {
  return global.__coverage__
}

function checkPaths (obj, entryPoint) {
  const paths = Object.keys(obj)
  if (!paths.some(p => p === entryPoint)) {
    console.error('Loaded coverage object doesn\'t have the right paths')
    process.exit(1)
  }
}

function parseJSON (path) {
  try {
    const file = fs.readFileSync(path, 'utf8')
    return JSON.parse(file)
  } catch (e) {
    console.error('Couldn\'t parse JSON file:', e.message)
    process.exit(1)
  }
}

function registerExitHandlers (options) {
  if (options.saveCoverage) {
    onExit(function (code, signal) {
      const obj = getCoverageObject()
      const content = JSON.stringify(obj, null, 2)
      try {
        fs.writeFileSync(options.coverageFile, content)
        console.log('Written coverage object to file:', options.coverageFile)
      } catch (e) {
        console.error('Couldn\'t write coverage object to file:', e.message)
      }
    })
  }
}

function init (app, options) {
  Hook(['express'], hookWithOptions(options))
  if (options.enableCoverage) {
    im.hookLoader(options.instrumentDir, { babel: options.babel,
                                           babelOpts: {
                                             presets: [ [ "@babel/env", { modules: false } ] ],
                                             retainLines: true
                                           }
                                         });
  }
  const entryPoint = path.resolve(options.projectDir, app)
  if (options.restoreCoverage) {
    console.log('Restore coverage object from file:', options.coverageFile)
    const obj = parseJSON(options.coverageFile)
    checkPaths(obj, entryPoint)
    setCoverageObject(obj)
  }
  registerExitHandlers(options)
  process.chdir(options.projectDir)
  require(entryPoint)
}

module.exports = init
