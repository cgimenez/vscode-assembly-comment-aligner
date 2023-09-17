
const vscode = require('vscode');

function formatComments(document, column_pos, comment_symbol) {
  let new_lines = [];

  for (let line_num = 0; line_num < document.lineCount; line_num++) {
    let line = document.lineAt(line_num).text;
    let new_content = line;
    if (line.length > 0) {
      let regex = new RegExp("\^\s*" + comment_symbol);
      let result = line.match(regex); // /^\s*;/ check for whitespaces followed by a comment symbol
      if (!result) {
        regex = new RegExp("\.+" + comment_symbol);
        result = line.match(regex); // /.+;/ check for comment symbol
        if (result) {
          let pos = result[0].length;
          let first_part = line.substring(0, pos - 1);
          let padded;
          if (pos > column_pos) { // need to shorten the line
            first_part = first_part.slice(0, column_pos - 1); //
            padded = "";
          }
          else
            padded = " ".repeat(column_pos - pos);
          let second_part = line.substring(pos - 1, line.length);
          new_content = first_part + padded + second_part;
        }
      }
    }
    new_lines.push(new_content);
  }
  return new_lines.join("\n");
}

function activate(context) {
  const configuration = vscode.workspace.getConfiguration('org-cg-comments-aligner')
  const comment_symbol = configuration.comment_symbol;
  let command_disposable = vscode.commands.registerCommand('org-cg-comments-aligner.align', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const document = editor.document;
    if (!document)
      return;
    const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
    const formattedText = formatComments(document, configuration.column, comment_symbol);
    editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, formattedText);
    });
  });
  context.subscriptions.push(command_disposable);


  if (configuration.align_onsave) {
    const languages = configuration.languages;
    let onsave_disposable = vscode.languages.registerDocumentFormattingEditProvider(languages, {
      provideDocumentFormattingEdits: (document, options, token) => {
        const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        const formattedText = formatComments(document, configuration.column, comment_symbol);
        return [vscode.TextEdit.replace(fullRange, formattedText)];
      }
    });
    context.subscriptions.push(onsave_disposable);
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
