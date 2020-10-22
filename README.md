# lerna-command-toc

[![Build status](https://img.shields.io/travis/imcuttle/lerna-command-toc/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/lerna-command-toc)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/lerna-command-toc.svg?style=flat-square)](https://codecov.io/github/imcuttle/lerna-command-toc?branch=master)
[![NPM version](https://img.shields.io/npm/v/lerna-command-toc.svg?style=flat-square)](https://www.npmjs.com/package/lerna-command-toc)
[![NPM Downloads](https://img.shields.io/npm/dm/lerna-command-toc.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/lerna-command-toc)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> lerna command for generate toc of packages in markdown

- Input (`README.md`)

```markdown
# my-package

## Packages

## Other
```

- Output (After run `lerna toc`)

```markdown
# my-package

## Packages

- [package-a](packages/a) - a description
- [package-b](packages/b) - b description

## Other
```

## Installation

```bash
npm install lerna-command-toc lerna-cli -D
# or use yarn
yarn add lerna-command-toc lerna-cli --dev
```

## Usage

- `lerna.json`

```json
{
  "extendCommands": ["lerna-command-toc"],
  "command": {
    "toc": {}
  }
}
```

- Run command

```bash
lerna toc --help
lerna toc
```

- We recommend use `lerna-command-toc` with `pre-comment` git hook

```json5
// package.json
{
  husky: {
    hooks: {
      'pre-commit': 'npx lerna toc && git add README.md'
    }
  }
}
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:imcuttle@163.com">imcuttle@163.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
