/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-constant-condition */

import recursive from 'recursive-readdir'
import fs from 'fs'
import md5 from 'md5'

const tsPath = `${__dirname}/../../ts`
const mainTsPath = `${tsPath}/main.ts`

async function run(): Promise<void> {
  const exportables = await fetchExportables()
  const tsParts = exportables.map((exportable) => {
    return exportable.getTs()
  }).filter((tsPart) => {
    return tsPart !== null
  })
  const newMainTs = `${tsParts.join('\n\n')}\n`
  const newMd5 = md5(newMainTs)
  const oldMainTs = fs.readFileSync(mainTsPath, 'utf8')
  const oldMd5s = getWords({ needle: '/* create-main-md5: ', haystack: oldMainTs })
  const oldMd5 = oldMd5s.length === 0 ? null : oldMd5s[0]
  if (newMd5 !== oldMd5) {
    console.log('main.ts updated')
    fs.writeFileSync(mainTsPath, `/* create-main-md5: ${newMd5} */ \n\n${newMainTs}`)
  } else {
    console.log('main.ts unchanged')
  }
}

async function fetchAbsolutePaths(): Promise<Array<string>> {
  return new Promise((resolve, reject): void => {
    recursive(`${tsPath}/src`, (error, filePaths) => {
      if (error) {
        reject(error)
        return
      }
      resolve(filePaths)
    })
  })
}

async function fetchExportables(): Promise<Array<Exportable>> {
  const absolutePaths = await fetchAbsolutePaths()
  return absolutePaths.sort().map((absolutePath) => {
    return new Exportable(absolutePath)
  })
}

const needleMeats = [
  'class',
  'const',
  'function',
  'interface',
  'abstract class',
  'enum',
]
const needles = needleMeats.map((meat) => {
  return `export ${meat} `
})

class Exportable {

  constructor(readonly absolutePath: string) {

  }
  getRelativePath(): string {
    return `./${this.absolutePath.split('/ts/')[1].replace('.ts', '')}`
  }
  getTs(): string | null {
    const names = this.getNames()
    if (names.length === 0) {
      return null
    }
    return `export { \n  ${names.join(',\n  ')},\n} from '${this.getRelativePath()}'`
  }
  getFile(): string {
    return fs.readFileSync(this.absolutePath, 'utf8')
  }
  getNames(): Array<string> {
    const file = this.getFile()
    const names = []
    needles.forEach((needle) => {
      const words = getWords({ needle, haystack: file })
      names.push(...words)
    })
    return names
  }

}

function getWords(struct: { needle: string; haystack: string;}): Array<string> {
  const { needle, haystack } = struct
  let remaining = haystack
  const words: Array<string> = []
  while (true) {
    const index = remaining.indexOf(needle)
    if (index === -1) {
      break
    }
    const indexPlusNeedle = index + needle.length
    const word = getWordAtIndex({ haystack: remaining, index: indexPlusNeedle })
    remaining = remaining.substr(indexPlusNeedle)
    words.push(word)
  }
  return words
}

const alphabet = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function getWordAtIndex(struct: { haystack: string; index: number; }): string {
  const { haystack, index } = struct
  const remaining = haystack.substr(index)
  let word = ''
  for (let i = 0; i < remaining.length; i++) {
    const char = remaining[i]
    if (alphabet.indexOf(char) === -1) {
      break
    }
    word += char
  }
  return word
}


run()
