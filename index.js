#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')

const getGlob = (pattern = '{.*,*.*}') =>
  path.join(__dirname, 'templates', pattern)

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

const cp = (pattern = null) => {
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
  .help('help')
  .alias('h', 'help')
  .argv

console.log('\n- - - - - - - - - - -\n      getgoing\n- - - - - - - - - - -')

if (args._[0] === 'ls') {
  ls();
}
else {
  cp(args._[0]);
}
