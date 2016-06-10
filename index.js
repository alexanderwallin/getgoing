#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')

const args = yargs.argv

const fileGlob = args._.length ? args._[0] : '{.*,*.*}'
const globStr = `${__dirname}/templates/${fileGlob}`

console.log('\ngetgoing')

glob(globStr, (err, files) => {
  if (err) {
    console.log('Error occured:')
    console.log(err)
    process.exit(1)
  }

  console.log('\nCopying:')

  files.forEach(file => {
    const filename = path.basename(file)
    const destination = path.join(process.cwd(), filename)

    console.log(' -', filename)

    fs.createReadStream(file)
      .pipe(fs.createWriteStream(destination))
  })
})
