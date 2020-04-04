import { Lexer } from '../src/lexer';
import { TokenType } from '../src/token';
import { expect } from 'chai';
import 'mocha';

describe('Lexer tests',
    () => {

        it('empty string', () => {
            const tokens = Lexer.Tokenize('').tokens;
            expect(tokens.map(t => t.type)).to.eql([TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['EOF']);
        });

        it('string with just whitespaces', () => {
            const tokens = Lexer.Tokenize('  \t \n').tokens;
            expect(tokens.map(t => t.type)).to.eql([TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['EOF']);
        });

        it('tokenize1', () => {
            const tokens = Lexer.Tokenize('     #def  Hello hello').tokens;

            expect(tokens.map(t => t.type)).to.eql([TokenType.CmdSpecifier, TokenType.PotentialReference, TokenType.Whitespace, TokenType.Whitespace, TokenType.PotentialReference, TokenType.Whitespace, TokenType.PotentialReference, TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['#', 'def', ' ', ' ', 'Hello', ' ', 'hello', 'EOF']);
        });

        it('tokenize2', () => {
            const tokens = Lexer.Tokenize('#def## \nHello# ').tokens;

            expect(tokens.map(t => t.type)).to.eql([TokenType.CmdSpecifier, TokenType.PotentialReference, TokenType.CmdSpecifier, TokenType.CmdSpecifier, TokenType.Whitespace, TokenType.Whitespace, TokenType.PotentialReference, TokenType.CmdSpecifier, TokenType.Whitespace, TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['#', 'def', '#', '#', ' ', '\n', 'Hello', '#', ' ', 'EOF']);
        });

        it('distinct between potential reference to any other values', () => {
            const tokens = Lexer.Tokenize('POTENTIAL_REF!! 123_TE,St').tokens;

            expect(tokens.map(t => t.type)).to.eql([TokenType.PotentialReference, TokenType.Value, TokenType.Value, TokenType.Whitespace, TokenType.PotentialReference, TokenType.Comma, TokenType.PotentialReference, TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['POTENTIAL_REF', '!', '!', ' ', '123_TE', ',', 'St', 'EOF']);
        });

        
        it('Function defitnition', () => {
            const tokens = Lexer.Tokenize('#def Func(a, b())').tokens;

            expect(tokens.map(t => t.type)).to.eql([TokenType.CmdSpecifier, TokenType.PotentialReference, TokenType.Whitespace, TokenType.PotentialReference, TokenType.OpeningParenthesis, TokenType.PotentialReference, TokenType.Comma, TokenType.Whitespace, TokenType.PotentialReference, TokenType.OpeningParenthesis, TokenType.ClosingParenthesis, TokenType.ClosingParenthesis, TokenType.EOF]);
            expect(tokens.map(t => t.value)).to.eql(['#', 'def', ' ', 'Func', '(', 'a', ',', ' ', 'b', '(', ')', ')', 'EOF']);
        });
    });