import { codeSpans } from './code-spans';

describe('codeSpans', () => {
  it('D18: should cut a text at its backticks into words and notation', () => {
    expect(codeSpans('What the agent does (`&{…}`) is kept apart from (`+{…}`).')).toEqual([
      { text: 'What the agent does (', code: false },
      { text: '&{…}', code: true },
      { text: ') is kept apart from (', code: false },
      { text: '+{…}', code: true },
      { text: ').', code: false },
    ]);
  });

  it('D18: should keep a text without backticks whole, and add no empty words around notation', () => {
    expect(codeSpans('A line of the workflow type, word for word.')).toEqual([
      { text: 'A line of the workflow type, word for word.', code: false },
    ]);
    expect(codeSpans('`reticulab serve`, a small web app')).toEqual([
      { text: 'reticulab serve', code: true },
      { text: ', a small web app', code: false },
    ]);
  });
});
