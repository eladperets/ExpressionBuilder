import { evaluateExpression } from './expressionEvaluation';
import { expect } from 'chai';
import 'mocha';

describe('Expression evaluation tests',
  () => {
    it('No expression', () => {
      expect(evaluateExpression('#eval Hello World')).to.equal("Hello World");
    });

    it('Single expression', () => {
      const expression = '\
        #def HI Hello \
        #eval HI World';

      expect(evaluateExpression(expression)).to.equal("Hello World");
    });

    it('Expressions referring each other', () => {
      const expression = '\
        #def HI Hello \
        #def HI_WORLD HI World \
        #eval HI_WORLD! HI World! Hello World!';

      expect(evaluateExpression(expression)).to.equal("Hello World! Hello World! Hello World!");
    });

    it('Expressions out in order', () => {
      const expression = '\
        #def HI_WORLD HI World \
        #def HI Hello \
        #eval HI_WORLD!';

      expect(evaluateExpression(expression)).to.equal("Hello World!");
    });

    it('Recursive expression reference should not work', () => {
      const expression = '\
        #def HI HI World \
        #eval HI';

      expect(evaluateExpression(expression)).to.equal("HI World");
    });

    it('Expressions with the same prefix- should be greedy', () => {
      const expression = '\
        #def HI Hello \
        #def HII HI World \
        #eval HII!';

      expect(evaluateExpression(expression)).to.equal("Hello World!");
    });
  });