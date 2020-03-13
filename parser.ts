class ParsingResult {
  declarations: Expression[];
  expression: Expression;

  constructor(declarations: Expression[], expression: Expression) { this.declarations = declarations; this.expression = expression; }
}

class Parser {
  public parse(rawString: string): ParsingResult {
    let rows = rawString
      .split('\n')
      .filter(row => !row.startsWith('//'))
      .map(r => r.trim());

    let declarations = rows
      .filter(row => row.startsWith('let '))
      .map(row => {
        let expressionName = row.substring(4, row.indexOf('=')).trim();
        let expressionValue = row.substring(row.indexOf('=') + 1).trim();

        return new Expression(expressionName, expressionValue);
      });

    let expression = rows
      .filter(row => !row.startsWith('let '))
      .pop();

    return new ParsingResult(declarations, new Expression("final", expression));
  }
}

function build(rawString: string): string {
  let parser = new Parser();
  let parserResult = parser.parse(rawString);
  var result = parserResult.expression.build(parserResult.declarations);
  console.log(result);
  return result;
}