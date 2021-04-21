// Script to generate MongoDB init script based on configuration in .env
require('dotenv-safe').config()
const fs = require('fs-extra')
const path = require('path')

const config = {
  srcFile: './docker-entrypoint-initdb.d/mongo-init.js',
  destPath: './data/docker-entrypoint-initdb.d',
  destFile: './00-mongo-init.js'
}

let template = fs.readFileSync(config.srcFile, { encoding: 'utf-8' })

template = template.replaceAll('{{username}}', process.env.MONGO_USER)
template = template.replaceAll('{{password}}', process.env.MONGO_PASS)

fs.ensureDirSync(config.destPath)
fs.writeFileSync(path.join(config.destPath, config.destFile), template)
