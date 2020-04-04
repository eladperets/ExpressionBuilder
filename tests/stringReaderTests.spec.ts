import { StringReader } from '../src/stringReader';
import { expect } from 'chai';
import 'mocha';

describe('StringReader tests',
    () => {

        it('readNext()', () => {
            const reader = new StringReader('Hi');

            expect(reader.readNext()).to.equal('H');
            expect(reader.readNext()).to.equal('i');
        });

        it('current()', () => {
            const reader = new StringReader('Hi');

            reader.readNext();
            expect(reader.current()).to.equal('H');
            expect(reader.current()).to.equal('H');

            reader.readNext();
            expect(reader.current()).to.equal('i');
            expect(reader.current()).to.equal('i');
        });

        it('isFinished()', () => {
            const reader = new StringReader('Hi');

            reader.readNext();
            expect(reader.isFinished()).to.be.false;
            reader.readNext();
            expect(reader.isFinished()).to.be.true;
        });

        it('peekNext()', () => {
            const reader = new StringReader('Hi');

            expect(reader.peekNext()).to.equal('H');
            reader.readNext();
            expect(reader.peekNext()).to.equal('i');
        });

        it('readUntilAny()- read until last char', () => {
            const reader = new StringReader('Hello World!');
            expect(reader.readUntilAny('!', 'z')).to.equal('Hello World');
        });

        it('readUntilAny()- no match', () => {
            const reader = new StringReader('Hello World!');
            expect(reader.readUntilAny('z')).to.equal('Hello World!');
        });

        it('readUntilAny()- no match, start from the middle', () => {
            const reader = new StringReader('Hello World!');
            reader.readNext();
            expect(reader.readUntilAny('z')).to.equal('ello World!');
        });

        it('readUntilAny()- multiple matches', () => {
            const reader = new StringReader('Hello World!');
            expect(reader.readUntilAny(' ', 'w')).to.equal('Hello');
        });

        it('readUntilAny()- current char match', () => {
            const reader = new StringReader('Hello World and also Hi!');
            reader.readNext();
            expect(reader.readUntilAny('H')).to.equal('ello World and also ');
        });

        it('skipAny()', () => {
            const reader = new StringReader('Hello World!');
            reader.skipAny('H', 'e')
            expect(reader.readNext()).to.equal('l');
        });

        it('skipAny() - no match', () => {
            const reader = new StringReader('Hello World!');
            reader.skipAny('x')

            // the reader's index should remeain -1.
            expect(reader.readNext()).to.equal('H');
        });
    });