class Parser {
  public static parse(str: string): Expression[] {
    let state = State.GetCommand;
    let stringReader = new StringReader(str);
    let expressions: Expression[] = [];
    let currentExpression: Expression;

    while (!stringReader.isFinished()) {
      switch (state) {
        case (State.GetCommand):
          stringReader.skip(' ');
          let cmdPrefix = stringReader.readNext();
          if (cmdPrefix == '#') {
            state = State.GetCommandName;
          } else {
            throw new Error("Expected '#'' but found '" + cmdPrefix + "' instead");
          }

          break;

        case (State.GetCommandName):
          let cmd = stringReader.readUntil(' ').trim();
          switch (cmd) {
            case "def":
              currentExpression = new Expression();
              currentExpression.cmd = cmd;
              state = State.GetExpressionName;
              break;

            case "eval":
              currentExpression = new Expression();
              currentExpression.cmd = cmd;
              state = State.GetExpressionValue;
              break;

            default:
              throw new Error("Enountered unsupported command: '" + cmd + "'");
          }

          break;

        case (State.GetExpressionName):
          stringReader.skip(' ');
          let expressionName = stringReader.readUntil(' ').trim();

          if (expressionName.length == 0) {
            throw new Error("Expected expression name but found EOF");
          }

          currentExpression.name = expressionName;
          state = State.GetExpressionValue;

          break;

        case (State.GetExpressionValue):
          stringReader.skip(' ');

          // Read until the next command
          currentExpression.value = stringReader.readUntil('#').trim();
          expressions.push(currentExpression);
          state = State.GetCommand
      }
    }

    return expressions;
  }
}

enum State {
  GetCommand,
  GetCommandName,
  GetExpressionName,
  GetExpressionValue,
}