import * as vscode from 'vscode'
import { promisify } from 'util'
import * as cp from 'child_process'

const exec = promisify(cp.exec).bind(cp)

export function separateCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    'texsch.separate',
    async () => {
      await exec('texsch separate')
      await vscode.window.showInformationMessage(
        'Separated PDF and LaTeX files'
      )
    }
  )

  context.subscriptions.push(command)
}
