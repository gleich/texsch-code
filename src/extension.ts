import * as vscode from 'vscode'
import { createCommand } from './commands/create'

export function activate(context: vscode.ExtensionContext) {
  createCommand(context)
}

export function deactivate() {}
