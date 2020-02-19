const fs = require('fs-extra')
const path = require('path')
const { Transform } = require('stream')
const allModules = require ('./readModules')

allModules.forEach(directory => {
  fs.removeSync(path.join(__dirname, '../', directory))
})

const pjson = 'package.json'
const pjsonTmp = `${pjson}.tmp`

fs.moveSync(pjson, pjsonTmp)

const writeStream = fs.createWriteStream(pjson)
const readStream = fs.createReadStream(pjsonTmp)

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

    pjson.files = pjson.files.filter(dir => !allModules.includes(dir))

    cb(null, Buffer.from(JSON.stringify(pjson, null, '  ')))
  }
}

const packageJSONTransform = new PackageJSONTransform()

readStream
  .pipe(packageJSONTransform)
  .pipe(writeStream)
  .on('finish', () => {
    fs.unlinkSync(pjsonTmp)
  })
