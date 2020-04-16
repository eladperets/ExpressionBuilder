import { ExpressionDefinition, ParsedExpressionDefinitions } from './expressionDefinition';

export class Token {
    public type: TokenType;
    public value: string;

    constructor(type: TokenType, value: string) {
        this.type = type;
        this.value = value;
    }
}

export enum TokenType {
    Whitespace,
    CommentSpecifier,
    OpeningParenthesis,
    ClosingParenthesis,
    Comma,
    CmdSpecifier,
    PotentialReference,
    Value,
    EOF
}

enum State {
    GetCommandOrEOF,
    GetCommandName,
    GetArgumentsOrSpaceBeforeExpressionValue,
    SeekNextArgument,
    ExpectedCommaOrClosingParenthesis,
    GetExpressionName,
    GetSpaceBeforeExpressionValue,
    AccumulateExpressionValue
}

export class TokenizedExpression {
    public tokens: Token[];

    constructor(tokens: Token[] = []) {
        this.tokens = tokens;
    }

    public push(token: Token): void {
        this.tokens.push(token);
    }

    public toExpressionDefinitions(): ParsedExpressionDefinitions {
        let state = State.GetCommandOrEOF;
        const expressionDefinitions: ExpressionDefinition[] = [];
        let currentExpression: ExpressionDefinition;

        // Remove all comments and leading\trailing whitespaces from the token stream. This can be done as part of the state machine, but it'll make things more complicated
        for (const tok of TokenizedExpression.trimWhitespacesAndRemoveComments(this.tokens)) {
            switch (state) {
                case State.GetCommandOrEOF:
                    if (tok.type == TokenType.CmdSpecifier) {
                        state = State.GetCommandName;
                    } else if (tok.type != TokenType.EOF) {
                        throw new Error("Expected '#' or EOF but found '" + tok.value + "' instead");
                    }

                    break;

                case State.GetCommandName:
                    if (tok.type == TokenType.Value || tok.type == TokenType.PotentialReference) {
                        switch (tok.value) {
                            case "def":
                                currentExpression = new ExpressionDefinition();
                                currentExpression.cmd = tok.value;
                                currentExpression.tokenizedExpression = new TokenizedExpression();
                                currentExpression.args = [];
                                state = State.GetExpressionName;
                                break;

                            case "eval":
                                currentExpression = new ExpressionDefinition();
                                currentExpression.cmd = tok.value;
                                currentExpression.tokenizedExpression = new TokenizedExpression();
                                currentExpression.args = [];
                                state = State.GetSpaceBeforeExpressionValue;
                                break;

                            default:
                                throw new Error("Enountered unsupported command: '" + tok.value + "'");
                        }
                    } else {
                        throw new Error("Expected command name but found '" + tok.value + "' instead");
                    }

                    break;

                case State.GetExpressionName:
                    if (tok.type == TokenType.Whitespace) {
                        state = State.GetExpressionName;
                    } else if (tok.type == TokenType.PotentialReference) {
                        currentExpression.name = tok.value;
                        state = State.GetArgumentsOrSpaceBeforeExpressionValue;
                    } else {
                        throw new Error("Expected legal expression name but found '" + tok.value + "' instead");
                    }

                    break;

                case State.GetArgumentsOrSpaceBeforeExpressionValue:
                    // If the expression name is followed by a whitespace, expect the expression value. Otherwise, it should have a '(', indicating the expression accepts arguments
                    if (tok.type == TokenType.Whitespace) {
                        state = State.AccumulateExpressionValue;
                    } else if (tok.type == TokenType.OpeningParenthesis) {
                        state = State.SeekNextArgument;
                    } else {
                        throw new Error("Expected whitespace or '(' but found '" + tok.value + "' instead");
                    }

                    break;

                case State.SeekNextArgument:
                    if (tok.type == TokenType.Whitespace) {
                        state = State.SeekNextArgument;
                    } else if (tok.type == TokenType.PotentialReference) {
                        currentExpression.args.push(tok.value);
                        state = State.ExpectedCommaOrClosingParenthesis;
                    } else {
                        throw new Error("Expected argument name but found '" + tok.value + "' instead");
                    }

                    break;

                case State.ExpectedCommaOrClosingParenthesis:
                    if (tok.type == TokenType.Comma) {
                        state = State.SeekNextArgument;
                    } else if (tok.type == TokenType.ClosingParenthesis) {
                        state = State.GetSpaceBeforeExpressionValue;
                    } else {
                        throw new Error("Expected ')' or ',' but found '" + tok.value + "' instead");
                    }

                    break;
                case State.GetSpaceBeforeExpressionValue:
                    if (tok.type == TokenType.Whitespace) {
                        state = State.AccumulateExpressionValue;
                    }
                    else {
                        throw new Error("Expected whitespace but found '" + tok.value + "' instead");
                    }

                    break;

                case State.AccumulateExpressionValue:
                    switch (tok.type) {
                        case TokenType.Value:
                        case TokenType.PotentialReference:
                        case TokenType.Whitespace:
                        case TokenType.OpeningParenthesis:
                        case TokenType.ClosingParenthesis:
                        case TokenType.Comma:
                            currentExpression.tokenizedExpression.push(tok);
                            state = State.AccumulateExpressionValue;
                            break;

                        case TokenType.EOF:
                            currentExpression.tokenizedExpression.tokens = TokenizedExpression.trimWhitespaces(currentExpression.tokenizedExpression.tokens);
                            expressionDefinitions.push(currentExpression);
                            break;

                        case TokenType.CmdSpecifier:
                            currentExpression.tokenizedExpression.tokens = TokenizedExpression.trimWhitespaces(currentExpression.tokenizedExpression.tokens);
                            expressionDefinitions.push(currentExpression);
                            state = State.GetCommandName;
                            break;
                    }

                    break;
            }
        }

        return new ParsedExpressionDefinitions(expressionDefinitions);
    }

    public static trimWhitespaces(tokens: Token[]): Token[] {
        let startInd = 0;

        while (tokens[startInd].type == TokenType.Whitespace) {
            startInd++;
        }

        let endInd = tokens.length - 1;
        while (startInd <= endInd && tokens[endInd].type == TokenType.Whitespace) {
            endInd--;
        }

        return tokens.slice(startInd, endInd + 1);
    }

    public static trimWhitespacesAndRemoveComments(tokens: Token[]): Token[] {
        let buf: Token[] = [];
        let inComment = false;
        for (let token of tokens) {
            if (token.type == TokenType.CommentSpecifier) {
                inComment = true;
            } else if (inComment && token.type != TokenType.EOF) {
                if (token.value == '\n') {
                    inComment = false;
                }
            } else {
                buf.push(token);
            }
        }

        return TokenizedExpression.trimWhitespaces(buf);
    }
}