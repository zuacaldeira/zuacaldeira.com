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
});
