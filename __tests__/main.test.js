/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const { fixture } = require('./helper')
const { execSync } = require('child_process')
const { writeFileSync, unlinkSync, readFileSync } = require('fs')
const nps = require('path')

const exec = (cmd) => {
  return execSync(cmd.replace('lerna', nps.join(__dirname, '../node_modules/.bin/lerna')), {
    encoding: 'utf8',
    cwd: fixture()
  })
}

const createSingleFileFs = () => {
  let locateFile
  return {
    writeFileSync: (filename, data) => {
      locateFile = filename
      writeFileSync(filename, data)
    },
    unlinkSync: () => unlinkSync(locateFile),
    readFileSync: () => readFileSync(locateFile, 'utf8')
  }
}

describe('lernaCommandToc', function () {
  it('toc --help', function () {
    const output = exec('lerna toc --help')
    expect(output).toMatch(/--heading\s+Markdown heading matching text\s+\[string]/)
    expect(output).toMatch(/-i, --input\s+Markdown input filename\s+\[string]/)
    expect(output).toMatch(/-o, --output\s+Markdown output filename\s+\[string]/)
  })

  describe('Readme.md', function () {
    let singleFs = createSingleFileFs()
    afterEach(() => {
      singleFs.unlinkSync()
    })

    it('toc', function () {
      singleFs.writeFileSync(fixture('README.md'), `# Toc\n ## Packages`)
      const output = exec('lerna toc')
      expect(singleFs.readFileSync()).toMatchInlineSnapshot(`
        "# Toc

        ## Packages

        *   [a](packages/a) - (private) a description
        *   [b](packages/b) - b description
        *   [c](packages/c) - (private) c description
        "
      `)
    })

    it('toc inner/README.md and match first one', function () {
      singleFs.writeFileSync(fixture('inner/README.md'), `# Toc\n ## Packages\n ## Packages`)
      const output = exec('lerna toc -i inner/README.md')
      expect(singleFs.readFileSync()).toMatchInlineSnapshot(`
        "# Toc

        ## Packages

        *   [a](../packages/a) - (private) a description
        *   [b](../packages/b) - b description
        *   [c](../packages/c) - (private) c description

        ## Packages
        "
      `)
    })

    it('toc filter options', function () {
      singleFs.writeFileSync(fixture('README.md'), `# Toc\n ## Packages`)
      const output = exec('lerna --loglevel=verbose toc -i README.md --scope=a')
      expect(singleFs.readFileSync()).toMatchInlineSnapshot(`
        "# Toc

        ## Packages

        *   [a](packages/a) - (private) a description
        "
      `)
    })
  })
})
