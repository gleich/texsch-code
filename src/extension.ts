import * as vscode from 'vscode'
import { commitCommand } from './commands/commit'
import { createCommand } from './commands/create'

export function activate(context: vscode.ExtensionContext) {
  createCommand(context)
  commitCommand(context)
}

export function deactivate() {}
