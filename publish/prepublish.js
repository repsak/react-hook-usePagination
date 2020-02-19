const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
const allModules = require ('./readModules')

const packagejson = 'package.json'

const pjson = require(`./../${packagejson}`)

// создание директорий и package.json внутрь
allModules.forEach(directory => {
  fs.mkdirSync(path.join(__dirname, '../', directory))

  const packageJsonBody = {}

  packageJsonBody.name = `${pjson.name}/${directory}`
  packageJsonBody.main = `./../dest/${directory}.min.js`

  fs.writeFile(path.join(__dirname, '../', directory, 'package.json'), JSON.stringify(
    packageJsonBody, null, '  '
  ), () => true)
})

const pjsonFileName = 'package.json'
const pjsonTmpFileName = `${pjsonFileName}.tmp`

fs.renameSync(pjsonFileName, pjsonTmpFileName)

const writeStream = fs.createWriteStream(pjsonFileName)
const readStream = fs.createReadStream(pjsonTmpFileName)

class PackageJSONTransform extends Transform {
  constructor(options) {
    super(options)
    this.buffer = Buffer.from('')
  }

  _transform(c, e, cb) {
    this.buffer = Buffer.concat([this.buffer, c])
    cb(null)
  }

  _flush(cb) {
    const pjson = JSON.parse(this.buffer.toString())

    pjson.files = pjson.files.concat(allModules)

    cb(null, Buffer.from(JSON.stringify(pjson, null, '  ')))
  }
}

const packageJSONTransform = new PackageJSONTransform()

readStream
  .pipe(packageJSONTransform)
  .pipe(writeStream)
  .on('finish', () => {
    fs.unlinkSync(pjsonTmpFileName)
  })


