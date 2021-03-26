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
    if (!inputs) {
      return
    }
    await createAndOpen(inputs)
  })

  context.subscriptions.push(command)
}

async function getInputs(): Promise<CreateInputs | undefined> {
  const inputs: CreateInputs = <CreateInputs>{}

  // Getting name
  const inputName = await vscode.window.showInputBox({
    placeHolder: 'Document Name (e.g. Chapter #20)',
  })
  if (!inputName) {
    return
  }
  inputs.name = inputName

  // Getting class
  const inputClass = await execLinesAsOptions('texsch create --classes')
  if (!inputClass) {
    return
  }
  inputs.class = inputClass

  // Getting document type
  const inputType = await execLinesAsOptions('texsch create --doctypes')
  if (!inputType) {
    return
  }
  inputs.type = inputType

  // Getting template
  const inputTemplate = await execLinesAsOptions('texsch create --templates')
  if (!inputTemplate) {
    return
  }
  inputs.template = inputTemplate

  return inputs
}

async function execLinesAsOptions(cmd: string): Promise<string | undefined> {
  const { stdout } = await exec(cmd)
  const result = await vscode.window.showQuickPick(stdout.trim().split('\n'))
  return result
}

async function createAndOpen(inputs: CreateInputs) {
  const { stdout } = await exec(
    `texsch create --name="${inputs.name}" --type="${inputs.type}" --class="${inputs.class}" --template="${inputs.template}" --no-editor --no-clipboard`
  )
  // Getting filename from stdout
  const lines = stdout.trim().split('\n')
  const filepath = lines[lines.length - 1].replace('✔ Created file at ', '')
  await vscode.workspace.openTextDocument(vscode.Uri.file(filepath))
}
