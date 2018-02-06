#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')
const exec = require('child-process-promise').exec

const getGlob = (pattern) =>
  `${__dirname}/templates/${pattern || '{.*,*.*}'}`

const getFiles = (globStr, cb) => {
  glob(globStr, (err, files) => {
    if (err) {
      console.log('Error occured:')
      console.log(err)
      process.exit(1)
    }

    cb(files)
  })
}

const ls = () => {
  getFiles(getGlob(), files => {
    console.log('\nFiles available for copying:\n')
    console.log(files.map(x => path.basename(x)).map(x => `  ${x}`).join('\n'))
    console.log()
  })
}

/**
 * Install npm dependencies
 */
const install = async (options) => {
  const babelBuildDeps = [
    'babel-core',
    'babel-preset-latest',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-transform-class-properties',
  ]

  const commonDeps = [
    'babel-polyfill',
    ...(options.heroku === true ? babelBuildDeps : []),
  ]

  const commonDevDeps = [
    'babel-eslint',
    'eslint',
    'eslint-config-airbnb',
    'eslint-config-prettier',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'prettier',
    ...(options.heroku === false ? babelBuildDeps : []),
  ]

  const appBuildDeps = [
    'babel-loader',
    'babel-plugin-transform-decorators-legacy',
    'core-decorators',
    'webpack',
  ]

  const appDevDeps = [
    'eslint-import-resolver-webpack',
    'webpack-dev-server',
  ]

  const deps = options.app === true
    ? [
      ...commonDeps,
      ...(options.heroku === true ? appBuildDeps : []),
    ]
    : commonDeps

  const devDeps = options.app === true
    ? [
      ...commonDevDeps,
      ...appDevDeps,
      ...(options.heroku === false ? appBuildDeps : []),
    ]
    : commonDevDeps

  // console.log({ deps, devDeps })
  console.log('\nInstalling dependencies:\n ', deps.join('\n  '))
  const output = await exec(`npm i ${deps.join(' ')}`)
  console.log('\nInstalling dev dependencies:\n ', devDeps.join('\n  '))
  const output2 = await exec(`npm i -D ${devDeps.join(' ')}`)
}

const cp = (pattern) => {
  getFiles(getGlob(pattern), (files) => {
  console.log('\nCopying:')

  files.forEach(file => {
    const filename = path.basename(file)
    const destination = path.join(process.cwd(), filename)

    console.log(' -', filename)

    fs.createReadStream(file)
      .pipe(fs.createWriteStream(destination))
  })
})
}

const args = yargs
  .command('ls', 'List all available files')
  .command('i', 'Install all necessary dependencies', command => {
    return command
      .option('app', {
        type: 'boolean',
        describe: 'Installs Webpack dependencies',
      })
      .option('heroku', {
        type: 'boolean',
        describe: 'Saves all devDependencies that is needed to run the app as regular dependencies',
      })
  })
  .help('help')
  .alias('h', 'help')
  .argv

console.log('\n- - - - - - - - - - -\n      getgoing\n- - - - - - - - - - -')

if (args._[0] === 'ls') {
  ls();
}
else if (args._[0] === 'i') {
  install({
    app: args.app,
    heroku: args.heroku,
  })
}
else {
  cp(args._[0]);
}
