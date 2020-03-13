class Expression {
  private expression: string;
  private name: string;

  constructor(name: string, expression: string) { this.name = name; this.expression = expression; }

  public build(expressions: Expression[]): string {
    let segments = [];
    let i = 0;
    while (i < this.expression.length) {
      if (this.expression[i] == '_') {
        let expressionNameStartIndex = i;
        let expressionNameEndIndex = this.expression.indexOf('_', i + 1);

        if (expressionNameEndIndex == -1) {
          throw Error("bad expression");
        }

        let expressionName = this.expression.substring(expressionNameStartIndex, expressionNameEndIndex + 1);
        let matchingExpression = expressions.find(ex => ex.name == expressionName)
        if (!matchingExpression) {
          throw Error("can't find expression " + expressionName);
        }

        segments.push(matchingExpression.build(expressions))

        i = expressionNameEndIndex + 1;
      }
      else {
        segments.push(this.expression[i]);
        i++;
      }
    }
    return segments.join('');
  }
}