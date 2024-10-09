import { vwToPx, remToPx, vhToPx } from './tool'
import * as vscode from 'vscode'

interface Config {
  context: vscode.ExtensionContext
  vwStyle: object
  vhStyle: object
  remStyle: object
}

export default class Decorator {
  private VW_REGEX = /(\d+)?(0)?(.)?\d+vw/g
  private VH_REGEX = /(\d+)?(0)?(.)?\d+vh/g
  private REM_REGEX = /(\d+)?(0)?(.)?\d+rem/g
  private vwStyle: any
  private vhStyle: any
  private remStyle: any

  constructor({ context, vwStyle, vhStyle, remStyle }: Config) {
    this.vwStyle = vwStyle
    this.vhStyle = vhStyle
    this.remStyle = remStyle
    this.init(context)
  }

  private updateDecorations(activeEditor: vscode.TextEditor) {
    if (!activeEditor) return

    const text = activeEditor.document.getText()
    const remOptions: Array<any> = []
    const vwOptions: Array<any> = []
    const vhOptions: Array<any> = []

    let match

    while ((match = this.VW_REGEX.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index + match[0].length)
      const decoration: object = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: vwToPx(match[0])
      }

      vwOptions.push(decoration)
    }

    while ((match = this.VH_REGEX.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index + match[0].length)
      const decoration: object = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: vhToPx(match[0])
      }

      vhOptions.push(decoration)
    }

    while ((match = this.REM_REGEX.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index + match[0].length)
      const decoration: object = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: remToPx(match[0])
      }

      remOptions.push(decoration)
    }

    activeEditor.setDecorations(this.vwStyle, vwOptions)
    activeEditor.setDecorations(this.vhStyle, vhOptions)
    activeEditor.setDecorations(this.remStyle, remOptions)
  }

  private init(context: vscode.ExtensionContext) {
    let activeEditor = vscode.window.activeTextEditor

    if (activeEditor) this.updateDecorations(activeEditor)

    vscode.window.onDidChangeActiveTextEditor((editor: vscode.TextEditor | undefined) => {
      activeEditor = editor
      if (editor) {
        this.updateDecorations(editor)
      }
    }, null, context.subscriptions)

    vscode.workspace.onDidChangeTextDocument((event : any) => {
      if (activeEditor && event.document === activeEditor.document) {
        this.updateDecorations(activeEditor)
      }
    }, null, context.subscriptions)
  }
}