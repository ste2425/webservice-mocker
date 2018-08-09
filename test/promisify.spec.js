const expect = require('chai').expect;

describe('Utils', () => {
    let promisifytoTest;

    beforeEach(() => {
        promisifytoTest = require('../utils/promisify');
    });

    describe('promisify', () => {
        it('Throws ReferenceError if function not recieved', () => {
            expect(() => promisifytoTest(10)).to.throw(ReferenceError);
        });

        it('Throws ReferenceError if no arguments recieved', () => {
            expect(() => promisifytoTest()).to.throw(ReferenceError);
        });

        it('Does not throw error if function recieved', () => {
            expect(() => promisifytoTest(function() {})).to.not.throw();
        });

        it('resolves promise when callback called.', () => {
            function toPromise(cb) {
                cb();
            }

            return promisifytoTest(toPromise)();
        });

        it('resolves promise when callback called, with provided arguments', () => {
            function toPromise(cb) {
                const errorArgument = undefined;

                cb(errorArgument, 50);
            }

            return promisifytoTest(toPromise)()
                .then(toTest => expect(toTest).to.eq(50));
        });

        it('rejects promise when callback called, with error argument', () => {
            function toPromise(cb) {
                const errorArgument = 'Some Error Value';

                cb(errorArgument, 50);
            }

            return promisifytoTest(toPromise)()
                .catch((error) => {
                    return {
                        rejected: true,
                        error
                    }
                })
                .then(({ error, rejected }) => {
                    expect(rejected).to.be.true;                    
                    expect(error).to.eq('Some Error Value');
                });
        });
    });
});