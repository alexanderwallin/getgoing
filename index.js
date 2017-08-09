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

const install = async () => {

  const deps = [
    'babel-core',
    'babel-loader',
    'babel-polyfill',
    'babel-preset-latest',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-decorators-legacy',
    'core-decorators',
    'webpack',
  ]

  const devDeps = [
    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-import-resolver-webpack',
    'prettier',
    'webpack-dev-server',
  ]
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
  .command('i', 'Install all necessary dependencies')
  .help('help')
  .alias('h', 'help')
  .argv

console.log('\n- - - - - - - - - - -\n      getgoing\n- - - - - - - - - - -')

if (args._[0] === 'ls') {
  ls();
}
else if (args._[0] === 'i') {
  install()
}
else {
  cp(args._[0]);
}
