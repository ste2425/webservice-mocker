const expect = require('chai').expect,
    sinon = require('sinon');

describe('Utils', () => {
    let debounceToTest,
        clock;

    beforeEach(() => {
        debounceToTest = require('../utils/debounce');
        clock = sinon.useFakeTimers();
    });

    afterEach(() => clock.restore());

    describe('debounce', () => {
        it('Throws ReferenceError if function not recieved', () => {
            expect(() => debounceToTest(10)).to.throw(ReferenceError);
        });

        it('Throws ReferenceError if no arguments recieved', () => {
            expect(() => debounceToTest()).to.throw(ReferenceError);
        });

        it('Does not throw error if function recieved', () => {
            expect(() => debounceToTest(function() {})).to.not.throw();
        });

        it('Does not throw error if function recieved, with optional delay', () => {
            expect(() => debounceToTest(function() {}, 10)).to.not.throw();
        });

        it ('Only calls fn once if dounced function called multiple times', () => {
            const spied = sinon.spy();

            const debounced = debounceToTest(spied, 1);

            debounced();
            debounced();
            debounced();

            setTimeout(() => {
                sinon.assert.calledOnce(spied);
            });
        });

        it ('calls debounced function in correct timeframe', () => {
            const spied = sinon.spy();

            debounceToTest(spied, 20)();
            
            clock.tick(19);

            sinon.assert.notCalled(spied);

            clock.tick(1);

            sinon.assert.calledOnce(spied);
        });

        it ('calls debounced function with correct default timeframe', () => {
            const spied = sinon.spy();

            debounceToTest(spied)();
            
            clock.tick(499);

            sinon.assert.notCalled(spied);

            clock.tick(1);

            sinon.assert.calledOnce(spied);
        });

        it('calls debounced function with correct arguments', () => {
            const spied = sinon.spy();

            const debounced = debounceToTest(spied);
            debounced(10, 20);
            debounced(30, 40);

            clock.tick(500);

            sinon.assert.calledWith(spied, 30, 40)
        });
    });
});