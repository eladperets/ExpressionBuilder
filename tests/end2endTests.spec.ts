import { Lexer } from '../src/lexer';
import { expect } from 'chai';
import 'mocha';

describe('Expression evaluation tests',
  () => {
    it('No expression', () => {
      expect(Lexer.Tokenize('#eval Hello World').toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World");
    });

    it('Single expression', () => {
      const expression = '\
        #def HI Hello \
        #eval HI World';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World");
    });

    it('Expressions referring each other', () => {
      const expression = '\
        #def HI Hello \
        #def HI_WORLD HI World \
        #eval HI_WORLD! HI World! Hello World!';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World! Hello World! Hello World!");
    });

    it('Expressions out in order', () => {
      const expression = '\
        #def HI_WORLD HI World \
        #def HI Hello \
        #eval HI_WORLD!';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World!");
    });

    it('Recursive expression reference should not work', () => {
      const expression = '\
        #def HI HI World \
        #eval HI';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("HI World");
    });

    it('two expressions with common prefix', () => {
      const expression = '\
        #def HI Hello \
        #def HII HI World \
        #eval HII!';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World!");
    });


    it('Complex expression', () => {
      const expression = "\
        #def TARGET_PORT parameters('targetPort') \
        #def PORT_RANGE field('Microsoft.Network/networkSecurityGroups/securityRules/destinationAddressPrefix') \
        \
        #def SPLITTED_PORT_RANGE split(PORT_RANGE, '-') \
        #def IS_PORT_RANGE equals(length(SPLITTED_PORT_RANGE), 2) \
        \
        #def START int(first(SPLITTED_PORT_RANGE)) \
        #def END int(last(SPLITTED_PORT_RANGE)) \
        \
        #def IS_TARGET_GREATER_OR_EQUAL_TO_START greaterOrEquals(TARGET_PORT, START) \
        #def IS_TARGET_LESS_OR_EQUAL_TO_END lessOrEquals(TARGET_PORT, END) \
        \
        #eval [and(IS_PORT_RANGE, IS_TARGET_GREATER_OR_EQUAL_TO_START, IS_TARGET_LESS_OR_EQUAL_TO_END)]";

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("[and(equals(length(split(field('Microsoft.Network/networkSecurityGroups/securityRules/destinationAddressPrefix'), '-')), 2), greaterOrEquals(parameters('targetPort'), int(first(split(field('Microsoft.Network/networkSecurityGroups/securityRules/destinationAddressPrefix'), '-')))), lessOrEquals(parameters('targetPort'), int(last(split(field('Microsoft.Network/networkSecurityGroups/securityRules/destinationAddressPrefix'), '-')))))]");
    });

    it('Function', () => {
      const expression = '\
        #def HI(_x) Hello _x! \
        #eval HI(World)';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World!");
    });

    it('Function2', () => {
      const expression = '\
        #def HI(_x) Hello _x! \
        #def WORLD World \
        #eval HI(WORLD)';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World!");
    });

    it('Function3', () => {
      const expression = '\
        #def HELLO_PREFIX(A) Hello A \
        #def FUNC(A) HELLO_PREFIX(A) \
        \
        #eval FUNC(World)!';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World!");
    });

    it('Function4', () => {
      const expression = '\
        #def HELLO_PREFIX(X) Hello X \
        #def FUNC(A, B) HELLO_PREFIX(A), HELLO_PREFIX(B)! \
        \
        #eval FUNC(World, Universe)';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World, Hello Universe!");
    });

    it('Function5', () => {
      const expression = '\
        #def HELLO_PREFIX(A) Hello A \
        #def FUNC(A, B, C) HELLO_PREFIX(A), HELLO_PREFIX(B), HELLO_PREFIX(C) \
        \
        #eval FUNC(World, Universe, 1 + 1 = 2 and some other stuff!)';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World, Hello Universe, Hello 1 + 1 = 2 and some other stuff!");
    });

    it('comments', () => {
      const expression = '\
        // Comment \n\
        // Another comment \r\n\
        // \n\
        \n\
        #def HELLO_PREFIX(A) Hello A // Comment \n\
        #def FUNC(A, B, C) HELLO_PREFIX(A), HELLO_PREFIX(B), HELLO_PREFIX(C) // Comment\n\
        \
        #eval FUNC(World, Universe, 1 + 1 = 2 and some other stuff!) // Comment \n\
        // Comment \n';

      expect(Lexer.Tokenize(expression).toExpressionDefinitions().toAST().evaluate()).to.equal("Hello World, Hello Universe, Hello 1 + 1 = 2 and some other stuff!");
    });
  });