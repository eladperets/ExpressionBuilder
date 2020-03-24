export class Expression {
  public name: string;
  public cmd: string;
  public value: string;

  public evaluate(expressions: Expression[]): string {
    return this.evaluateRec(this.value, expressions);
  }

  private evaluateRec(str: string, expressions: Expression[]): string {
    if (str.length == 0) {
      return str;
    }

    let matchingExpressions = expressions.filter(exp => exp.name != undefined && str.startsWith(exp.name));
    if (matchingExpressions.length > 0) {

      // Look for the longest matching expression - greed is good!
      let match = matchingExpressions.sort((a, b) => { return a.name.length - b.name.length; }).pop();
      let filteredExpressions = expressions.filter(exp => exp.name != match.name);
      return match.evaluate(filteredExpressions) + this.evaluateRec(str.substring(match.name.length), expressions);
    }

    return str.substring(0, 1) + this.evaluateRec(str.substring(1), expressions);
  }
}