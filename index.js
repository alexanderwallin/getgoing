#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')

console.log('getgoing')

glob(`${__dirname}/templates/{.*,*.*}`, (err, files) => {
  console.log(err)
  console.log(files)

  files.forEach(file => {
    const filename = path.basename(file)
    const destination = path.join(process.cwd(), filename)

    fs.createReadStream(file)
      .pipe(fs.createWriteStream(destination))
  })
})
