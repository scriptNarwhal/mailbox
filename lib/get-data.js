const consola = require('consola')
const fs = require('fs-extra')
const merge = require('lodash.merge')
const path = require('path')

/**
 * Generate absolute path to data file
 * @param {String} name Data specification name
 * @returns {String} Path to data file
 */
function generateDataPath (name) {
  return path.join(process.cwd(), `data/${name}.json`)
}

/**
 * Get email data
 * @param {Object} options Function options
 * @param {String} options.data Use data from these specifications
 * @returns {Object} Email data
 */
function getData (options) {
  const specs = options.data.split(',')

  if (specs[0] !== 'default') {
    specs.unshift('default')
  }

  const data = {}

  specs.forEach(specPath => {
    try {
      const specFile = fs.readFileSync(generateDataPath(specPath))
      const specData = JSON.parse(specFile)
      merge(data, specData)
    } catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

  return data
}

module.exports = getData
