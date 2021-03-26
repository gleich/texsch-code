import * as vscode from 'vscode'
import { promisify } from 'util'
import * as cp from 'child_process'

const exec = promisify(cp.exec).bind(cp)

interface CreateInputs {
  name: string
  type: string
  class: string
  template: string
}

export function createCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('texsch.create', async () => {
    const inputs = await getInputs()
    await createAndOpen(inputs)
  })

  context.subscriptions.push(command)
}

async function getInputs(): Promise<CreateInputs> {
  const inputs: CreateInputs = <CreateInputs>{}
  inputs.name =
    (await vscode.window.showInputBox({
      placeHolder: 'Document Name (e.g. Chapter #20)',
    })) || ''
  inputs.class = await execLinesAsOptions('texsch create --classes')
  inputs.type = await execLinesAsOptions('texsch create --doctypes')
  inputs.template = await execLinesAsOptions('texsch create --templates')
  return inputs
}

async function execLinesAsOptions(cmd: string): Promise<string> {
  const { stdout } = await exec(cmd)
  return (await vscode.window.showQuickPick(stdout.trim().split('\n'))) || ''
}

async function createAndOpen(inputs: CreateInputs) {
  console.log(
    `texsch create --name="${inputs.name}" --type="${inputs.type}" --class="${inputs.class}" --template="${inputs.template}" --no-editor --no-clipboard`
  )
  const { stdout } = await exec(
    `texsch create --name="${inputs.name}" --type="${inputs.type}" --class="${inputs.class}" --template="${inputs.template}" --no-editor --no-clipboard`
  )
  // Getting filename from stdout
  const lines = stdout.trim().split('\n')
  const filepath = lines[lines.length - 1].replace('✔ Created file at ', '')
  await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filepath))
}
