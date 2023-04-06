import * as fs from 'node:fs/promises'
import {exec} from 'node:child_process'

const inputDir = '../../sol-contracts/artifacts/contracts'
const outputDir = './src/abi'

// makes abi look like:
// export default {...} as const;
async function handleAbi(abiPath, contractName) {
  let fileHandleRead;
  let fileHandleWrite;
  try {
    fileHandleRead = await fs.open(abiPath, 'r')
    let content = await fileHandleRead.readFile({encoding: 'utf8'})
    content = `export default ${content.slice(0, -1)} as const;`
    const outputFilePath = `${outputDir}/${contractName}.ts`
    fileHandleWrite = await fs.open(outputFilePath, 'w')
    await fileHandleWrite.writeFile(content, {encoding: 'utf8'})
    console.log(outputFilePath)
  } finally {
    await fileHandleRead?.close()
    await fileHandleWrite?.close()
  }
}

async function main() {
  const inputFiles = await fs.opendir(inputDir)

  await fs.rm(outputDir, {recursive: true, force: true})
  await fs.mkdir(outputDir)

  // find files with abi
  for await (const dirent of inputFiles) {
    if (dirent.isDirectory()) {
      const [contractName, extension] = dirent.name.split('.')
      if (extension === 'sol') {
        const abiPath = `${inputDir}/${dirent.name}/${contractName}.json`
        await handleAbi(abiPath, contractName)
      }
    }
  }

  // reformat generated code
  exec('yarn eslint --fix "src/abi/*.ts"')
}

void main()
