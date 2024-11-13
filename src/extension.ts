import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Code Line Counter is now active!');

  // Команда для подсчета строк
  let disposable = vscode.commands.registerCommand('codeLineCounter.countLines', () => {
    countLines();
  });

  // Регистрация команды
  context.subscriptions.push(disposable);

  // Подписка на события изменения документов
  vscode.workspace.onDidOpenTextDocument(countLines);
  vscode.workspace.onDidSaveTextDocument(countLines);
  vscode.window.onDidChangeActiveTextEditor(countLines);
}

function countLines() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const doc = editor.document;
  const languageId = doc.languageId;

  let codeLines = 0;
  let commentLines = 0;
  let emptyLines = 0;

  // Проходим по всем строкам документа
  for (let i = 0; i < doc.lineCount; i++) {
    const line = doc.lineAt(i).text.trim();

    // Проверяем пустую строку
    if (line === '') {
      emptyLines++;
    }
    // Проверяем комментарий
    else if (isComment(line, languageId)) {
      commentLines++;
    }
    // Строка с кодом
    else {
      codeLines++;
    }
  }

  // Отображаем статистику в статусной строке
  vscode.window.setStatusBarMessage(`Code: ${codeLines} | Comments: ${commentLines} | Empty: ${emptyLines}`, 5000);
}

// Функция для определения, является ли строка комментарием
function isComment(line: string, languageId: string): boolean {
  switch (languageId) {
    case 'javascript':
    case 'typescript':
      return line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/');
    case 'python':
      return line.startsWith('#');
    case 'java':
      return line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/');
    case 'css':
      return line.startsWith('/*') || line.endsWith('*/');
    case 'html':
      return line.startsWith('<!--') || line.endsWith('-->');
    default:
      return false;
  }
}

export function deactivate() {}
