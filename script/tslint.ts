#!/usr/bin/env ts-node

import * as Path from 'path'
import { spawnSync, SpawnSyncOptions } from 'child_process'

// ensure commands are executed from the root of the repository
const repositoryRoot = Path.dirname(__dirname)

const options: SpawnSyncOptions = {
  cwd: repositoryRoot,
  // ensure stdout/stderr is propagated to the parent process so the test results
  // are displayed to the user
  stdio: 'inherit',
}

const tslint = process.platform === 'win32' ? 'tslint.cmd' : 'tslint'

const tslintPath = Path.join(repositoryRoot, 'node_modules', '.bin', tslint)

const tslintArgs = [
  './{script,tslint-rules}/*.ts',
  './app/{src,test}/**/*.{ts,tsx}',
]

const { status } = spawnSync(tslintPath, tslintArgs, options)
process.exitCode = status
