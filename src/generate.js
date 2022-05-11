const visitTree = require('@moyuyc/visit-tree')
const remark = require('remark')
const nps = require('path')
const mdToString = require('mdast-util-to-string')

async function generateToc(packages, root, prevContent, heading) {
  packages = packages.slice()
  packages.sort((a, b) => a.name.localeCompare(b.name))

  // dirs.sort((a, b) => a.localeCompare(b))
  const tocMd = packages
    .map((pkg) => {
      const description = pkg.get('description')
      const isPrivate = pkg.get('private')
      const name = pkg.name
      return `* [${name}](${nps.relative(root, pkg.location)}) - ${isPrivate ? '(private) ' : ''}${description || ''}`
    })
    .join('\n')

  const vFile = await remark()
    .use(() => {
      return (node) => {
        visitTree(node, (node, ctx) => {
          if (node.type === 'heading' && mdToString(node).trim() === heading) {
            // remove next Siblings which is not heading
            let index = ctx.index + 1
            let nextNode
            while (!!(nextNode = ctx.parent.children[index]) && nextNode.type !== 'heading') {
              ctx.parent.children.splice(index, 1)
            }

            ctx.insert(...remark.parse(tocMd).children)
            ctx.break()
          }
        })
      }
    })
    .process(prevContent)

  return vFile.contents
}

module.exports = generateToc
