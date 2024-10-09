import * as vscode from 'vscode'
import Provider from './provider'
import Decorator from './decorator'

const LANS: Array<string> = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus', 'typescriptreact']

export function activate (context: vscode.ExtensionContext) {

  // console.log('插件已挂载')

  const { cursor, vwColor, remColor } = vscode.workspace.getConfiguration('config')

  const vwStyle = vscode.window.createTextEditorDecorationType({
		cursor,
		color: vwColor
  })

  const vhStyle = vscode.window.createTextEditorDecorationType({
    cursor,
    color: vwColor
  })

  const remStyle = vscode.window.createTextEditorDecorationType({
		cursor,
		color: remColor
	})

  for (let lan of LANS) {

    const providerDisposable = vscode.languages.registerCompletionItemProvider(lan, new Provider())

    context.subscriptions.push(providerDisposable)
  }

  new Decorator({
    context,
    vwStyle,
    vhStyle,
    remStyle,
  })

}

export function deactivate () {
  // console.log('插件已卸载')
}
