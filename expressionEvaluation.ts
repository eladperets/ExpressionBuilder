function evaluateExpression(rawString: string): string {
    let expressions = Parser.parse(rawString);
    console.log(expressions);
    let evalExpressions = Array.from(expressions.values()).filter(e => e.cmd == "eval");
    if (evalExpressions.length == 1) {
      var result = evalExpressions[0].evaluate(expressions);
      console.log(result);
      return result;
    }
  
    throw new Error("Found no eval expressions (or too many)");
  }