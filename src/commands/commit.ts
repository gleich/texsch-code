import * as vscode from 'vscode'
import { promisify } from 'util'
import * as cp from 'child_process'

const exec = promisify(cp.exec).bind(cp)

export function commitCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('texsch.commit', async () => {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Committing changes',
        cancellable: false,
      },
      (progress) => {
        progress.report({ message: 'Committing Documents' })

        const p = new Promise<void>(async (resolve) => {
          await exec('texsch commit')
          resolve()
        })
        return p
      }
    )
    await vscode.window.showInformationMessage('Committed Documents')
  })

  context.subscriptions.push(command)
}
