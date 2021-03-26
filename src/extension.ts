import * as vscode from 'vscode'
import { commitCommand } from './commands/commit'
import { createCommand } from './commands/create'
import { separateCommand } from './commands/separate'

export function activate(context: vscode.ExtensionContext) {
  createCommand(context)
  commitCommand(context)
  separateCommand(context)
}

export function deactivate() {}
