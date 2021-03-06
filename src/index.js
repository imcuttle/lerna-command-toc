/**
 * lerna cli with custom command extensions
 * @author imcuttle
 */
const fs = require('fs')
const nps = require('path')
const { promisify } = require('util')

const { Command } = require('@lerna/command')
const { getFilteredPackages } = require('@lerna/filter-options')
const { ValidationError } = require('@lerna/validation-error')

const generate = require('./generate')

module.exports = factory

function factory(argv) {
  return new TocCommand(argv)
}

class TocCommand extends Command {
  get requiresGit() {
    return false
  }

  async initialize() {
    const { heading, input, output } = this.options

    this.input = nps.resolve(this.project.rootPath, input)
    this.output = nps.resolve(this.project.rootPath, output || input)

    this.logger.verbose('toc options:', this.options)

    if (!heading) {
      throw new ValidationError('ENOHEADING', 'You must specify heading')
    }

    if (!fs.existsSync(this.input) || !fs.statSync(this.input).isFile()) {
      throw new ValidationError('ENOINPUT', 'You must specify a valid input file')
    }

    if (!fs.existsSync(this.output) || !fs.statSync(this.output).isFile()) {
      throw new ValidationError('ENOOUTPUT', 'You must specify a valid output file')
    }

    this.validPackages = await getFilteredPackages(this.packageGraph, this.execOpts, {
      private: false,
      ...this.options
    })
  }

  async execute() {
    const { heading } = this.options
    const { output, input } = this

    this.logger.info('valid packages:', this.validPackages.map((pkg) => pkg.name).join(', '))
    this.logger.verbose('toc generate options:', { heading, input, output })

    const prevContent = await promisify(fs.readFile)(this.input, 'utf8')
    const newContent = await generate(this.validPackages, nps.dirname(this.input), prevContent, heading)

    await promisify(fs.writeFile)(this.output, newContent)
  }
}
