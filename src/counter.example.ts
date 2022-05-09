import {IncrementAfter, IncrementAround, IncrementBefore, IncrementOnError} from "./metric.decorator";

/**
 * Class to help test count decorators
 */
export class CounterTests {
    /** Before **/
    @IncrementBefore()
    public incBeforeAllDefaults() {}

    @IncrementBefore('before.default.value')
    public incBeforeDefaultValue() {}

    @IncrementBefore('before', 22)
    public incBefore() {}

    @IncrementBefore('before.with.tags', 39, { type: 'Payout', gateway: 'Stripe' })
    public incBeforeWithTags() {}

    @IncrementBefore('before.with.args', '0.a.deeply.nested.property')
    public incBeforeWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementBefore('before.derive', (arg1: {amount: number}, arg2: object) => arg1.amount)
    public incBeforeWithFunctionDerivation(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementBefore('before.derive.throws', (arg1: {amount: number}, arg2: object) => {
        throw new Error();
    })
    public incBeforeWithFunctionDerivationThrows(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    /** After **/
    @IncrementAfter()
    public incAfterAllDefaults() {}

    @IncrementAfter('after.default.value')
    public incAfterDefaultValue() {}

    @IncrementAfter('after', 23)
    public incAfter() {}

    @IncrementAfter('after.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAfterWithTags() {}

    @IncrementAfter('after.with.args', '0.a.deeply.nested.property.4')
    public incAfterWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementAfter('after.derive', (arg1: {amount: number}, arg2: object) => arg1.amount)
    public incAfterWithFunctionDerivation(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    /** OnError **/
    private throwError() {
        throw new Error();
    }

    @IncrementOnError()
    public incOnErrorAllDefaults() {
        this.throwError();
    }

    @IncrementOnError('onerror.default.value')
    public incOnErrorDefaultValue() {
        this.throwError();
    }

    @IncrementOnError('onerror', 26)
    public incOnError() {
        this.throwError();
    }

    @IncrementOnError('onerror.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incOnErrorWithTags() {
        this.throwError();
    }

    @IncrementOnError('onerror.with.args', '0.a.deeply.nested.property.4')
    public incOnErrorWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementOnError('onerror.derive', (arg1: {amount: number}, arg2: object) => arg1.amount)
    public incOnErrorWithFunctionDerivation(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementOnError('onerror', 25)
    public incOnNoError() {}

    /** Around **/

    @IncrementAround()
    public incAroundSuccessAllDefaults() {}

    @IncrementAround('around.default.value')
    public incAroundSuccessDefaultValue() {}

    @IncrementAround('around', 87)
    public incAroundSuccess() {}

    @IncrementAround('around.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAroundSuccessWithTags() {}

    @IncrementAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundSuccessWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementAround('around.derive', (arg1: {amount: number}, arg2: object) => arg1.amount)
    public incAroundSuccessWithFunctionDerivation(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementAround()
    public incAroundFailureAllDefaults() {
        this.throwError();
    }

    @IncrementAround('around.default.value')
    public incAroundFailureDefaultValue() {
        this.throwError();
    }

    @IncrementAround('around', 87)
    public incAroundFailure() {
        this.throwError();
    }

    @IncrementAround('around.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAroundFailureWithTags() {
        this.throwError();
    }

    @IncrementAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundFailureWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementAround('around.derive', (arg1: {amount: number}, arg2: object) => arg1.amount)
    public incAroundFailureWithFunctionDerivation(arg1: {amount: number}, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }
}
