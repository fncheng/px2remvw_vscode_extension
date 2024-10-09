import * as vscode from 'vscode'
import { pxToVwRem } from './tool'

/**
 * VSCode自动补全功能
 */
export default class Provider implements vscode.CompletionItemProvider {

  constructor () {}

  provideCompletionItems (document: vscode.TextDocument, position: vscode.Position) {

    const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position))

    const res = pxToVwRem(lineText, vscode)

    if (!res) return

    const item = new vscode.CompletionItem(`${res.pxValue}px => ${res.rem}`, vscode.CompletionItemKind.Snippet)
    const item2 = new vscode.CompletionItem(`${res.pxValue}px => ${res.vw}`, vscode.CompletionItemKind.Snippet)

    item.insertText = res.rem
    item2.insertText = res.vw

    return [item, item2]
  }
}