import { StringReader } from './stringReader';
import { Token, TokenType, TokenizedExpression } from './token';

export class Lexer {

    public static Tokenize(str: string): TokenizedExpression {
        const tokenizedExpression = new TokenizedExpression();
        const stringReader = new StringReader(str);

        // Skip any whitespaces at the begining of the string
        stringReader.skipAny(' ', '\t', '\r', '\n');
        let buf: string[] = [];

        while (!stringReader.isFinished()) {
            switch (stringReader.peekNext()) {
                case '#':
                    tokenizedExpression.push(new Token(TokenType.CmdSpecifier, stringReader.readNext()));
                    break;
                case '(':
                    tokenizedExpression.push(new Token(TokenType.OpeningParenthesis, stringReader.readNext()));
                    break;
                case ')':
                    tokenizedExpression.push(new Token(TokenType.ClosingParenthesis, stringReader.readNext()));
                    break;
                case ',':
                    tokenizedExpression.push(new Token(TokenType.Comma, stringReader.readNext()));
                    break;
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    tokenizedExpression.push(new Token(TokenType.Whitespace, stringReader.readNext()));
                    break;
                case '/':
                    stringReader.readNext();

                    // If it is followed by another '/', it's a comment. Otherwise fall to default behavior
                    if (!stringReader.isFinished() && stringReader.peekNext() == '/') {
                        stringReader.readNext();
                        tokenizedExpression.push(new Token(TokenType.CommentSpecifier, '//'));
                        break;
                    }
                    else {
                        buf.push('/');
                    }
                    
                    // caution: break is omitted intentionally
                default:
                    // Chars that are not letters\numbers\underscore are stoered in a token of their own (mainly cause i'm lazy).
                    if (!stringReader.isFinished() && !/[a-zA-Z0-9_]/.test(stringReader.peekNext())) {
                        tokenizedExpression.push(new Token(TokenType.Value, stringReader.readNext()));
                        break;
                    }

                    // For letters\numbers\underscore, store the complete string in a single 'PotentialReference' token
                    while (!stringReader.isFinished() && /[a-zA-Z0-9_]/.test(stringReader.peekNext())) {
                        buf.push(stringReader.readNext());
                    }

                    if (buf.length > 0) {
                        tokenizedExpression.push(new Token(TokenType.PotentialReference, buf.join('')));
                    }

                    buf = [];
                    break;
            }
        }

        tokenizedExpression.push(new Token(TokenType.EOF, 'EOF'));
        return tokenizedExpression;
    }
}