const fs = require('fs')
const path = require('path')

module.exports = fs.readdirSync(
  path.join(__dirname, '../', 'src'),
  { withFileTypes: true }
)
  .filter(dir => dir.isDirectory())
  .map(dir => dir.name)
