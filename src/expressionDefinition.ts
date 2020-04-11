import { TokenizedExpression, TokenType, Token } from './token';
import { Expression, LiteralExpression, ComplexExpression } from './ast'

export class ExpressionDefinition {
    public name: string;
    public cmd: string;
    public tokenizedExpression: TokenizedExpression;
    public args: string[];
}


class ResolvedCallArguments {
    public readonly resolvedArguments: Expression[];
    public readonly numberOfTokensProcessed: number;

    constructor(resolvedArguments: Expression[], numberOfTokensProcessed: number) {
        this.resolvedArguments = resolvedArguments;
        this.numberOfTokensProcessed = numberOfTokensProcessed;
    }
}

export class ParsedExpressionDefinitions {
    public expressions: ExpressionDefinition[];

    constructor(expressions: ExpressionDefinition[]) {
        this.expressions = expressions;
    }

    public toAST(): Expression {
        const definitions = new Map(this.expressions.filter(e => e.cmd == 'def').map(e => [e.name, e]));
        const evalExpressions = this.expressions.filter(e => e.cmd == 'eval');

        if (evalExpressions.length != 1) {
            throw new Error("Expected 1 eval expression but found " + evalExpressions.length);
        }

        const expressionTree = this.buildTreeRecursive(evalExpressions[0].tokenizedExpression.tokens, definitions);
        return expressionTree;
    }

    private buildTreeRecursive(expressionTokens: Token[], definitions: Map<string, ExpressionDefinition>, args: Map<string, Expression> = new Map<string, Expression>()): Expression {
        const expressions: Expression[] = [];

        for (let i = 0; i < expressionTokens.length; i++) {
            const currentToken = expressionTokens[i];

            if (currentToken.type == TokenType.PotentialReference && args.get(currentToken.value)) {
                expressions.push(args.get(currentToken.value));
            } else if (currentToken.type == TokenType.PotentialReference && definitions.get(currentToken.value)) {
                const rawExpressionToResolve = definitions.get(currentToken.value);
                let argsMap: Map<string, Expression> = new Map<string, Expression>();

                // Remove the definition of the current expression to avoid recursive calls
                definitions.delete(currentToken.value);

                if (rawExpressionToResolve.args.length > 0) {
                    const argumentResolutionResult = this.resolveArguments(expressionTokens.slice(Math.min(i + 1, expressionTokens.length)), definitions, args);
                    i += argumentResolutionResult.numberOfTokensProcessed;

                    if (argumentResolutionResult.resolvedArguments.length != rawExpressionToResolve.args.length) {
                        throw new Error("Expression: '" + currentToken.value + "' requires " + rawExpressionToResolve.args.length + " args, but " + argumentResolutionResult.resolvedArguments.length + " were provided");
                    }

                    argsMap = new Map(rawExpressionToResolve.args.map((arg, j) => [arg, argumentResolutionResult.resolvedArguments[j]]));
                }

                expressions.push(this.buildTreeRecursive(rawExpressionToResolve.tokenizedExpression.tokens, definitions, argsMap));
                definitions.set(currentToken.value, rawExpressionToResolve);
            } else {
                expressions.push(new LiteralExpression(currentToken.value));
            }
        }

        return new ComplexExpression(expressions);
    }

    private resolveArguments(tokens: Token[], definitions: Map<string, ExpressionDefinition>, args: Map<string, Expression>): ResolvedCallArguments {
        if (tokens.length < 2 || tokens[0].type != TokenType.OpeningParenthesis) {
            throw new Error("Bad definition arguments syntax");
        }

        const firstClosingParenthesisInd = tokens.findIndex(t => t.type == TokenType.ClosingParenthesis);
        if (firstClosingParenthesisInd == - 1) {
            throw new Error("Missing closing parenthesis");
        }

        const argTokens = tokens.slice(1, firstClosingParenthesisInd + 1);
        const resolvedArgs: Expression[] = [];
        let currentArgumentTokens: Token[] = [];

        for (let i = 0; i < argTokens.length; i++) {
            if (argTokens[i].type != TokenType.Comma && argTokens[i].type != TokenType.ClosingParenthesis) {
                currentArgumentTokens.push(argTokens[i]);
            } else {
                const trimmedArgumnetTokens = TokenizedExpression.trimWhitespaces(currentArgumentTokens);
                resolvedArgs.push(this.buildTreeRecursive(trimmedArgumnetTokens, definitions, args));
                currentArgumentTokens = [];
            }
        }

        return new ResolvedCallArguments(resolvedArgs, firstClosingParenthesisInd + 1);
    }
}