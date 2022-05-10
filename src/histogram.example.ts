import {HistogramAfter, HistogramAround, HistogramBefore, HistogramOnError,} from "./metric.decorator";

/**
 * Class to help test histogram decorators
 */
export class HistogramTests {
    /** Before **/
    @HistogramBefore()
    public histogramBeforeAllDefaults() {
        return 'histogramBeforeAllDefaults.returnValue';
    }

    @HistogramBefore('before.default.value')
    public histogramBeforeDefaultValue() {
        return 'histogramBeforeDefaultValue.returnValue';
    }

    @HistogramBefore('before', 22)
    public histogramBefore() {
        return 'histogramBefore.returnValue';
    }

    @HistogramBefore('before.with.tags', 39, {type: 'Payout', gateway: 'Stripe'})
    public histogramBeforeWithTags() {
        return 'histogramBeforeWithTags.returnValue';
    }


    @HistogramBefore('before.with.derived.tags', 39, (arg: string) => {return {arg, constTag: 'const-tag'}})
    public histogramBeforeWithDerivedTags(arg: string) {
        return 'histogramBeforeWithDerivedTags.returnValue';
    }

    @HistogramBefore('before.with.args', '0.a.deeply.nested.property')
    public histogramBeforeWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'histogramBeforeWithArgs.returnValue';
    }

    @HistogramBefore('before.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public histogramBeforeWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'histogramBeforeWithFunctionDerivation.returnValue';
    }

    @HistogramBefore('before.derive.throws', (arg1: { amount: number }, arg2: object) => {
        throw new Error();
    })
    public histogramBeforeWithFunctionDerivationThrows(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'histogramBeforeWithFunctionDerivationThrows.returnValue';
    }

    /** After **/
    @HistogramAfter()
    public histogramAfterAllDefaults() {
        return 'histogramAfterAllDefaults.returnValue';
    }

    @HistogramAfter('after.default.value')
    public histogramAfterDefaultValue() {
        return 'histogramAfterDefaultValue.returnValue';
    }

    @HistogramAfter('after', 23)
    public histogramAfter() {
        return 'histogramAfter.returnValue';
    }

    @HistogramAfter('after.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public histogramAfterWithTags() {
        return 'histogramAfterWithTags.returnValue';
    }

    @HistogramAfter('after.with.derived.tags', 40, (arg: string, returnValue: string) => {return {arg, returnValue, constTag: 'const-tag'}})
    public histogramAfterWithDerivedTags(arg: string): string {
        return 'histogramAfterWithDerivedTags.returnValue';
    }

    @HistogramAfter('after.with.args', '0.a.deeply.nested.property.4')
    public histogramAfterWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'histogramAfterWithArgs.returnValue';
    }

    @HistogramAfter('after.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public histogramAfterWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'histogramAfterWithFunctionDerivation.returnValue';
    }

    /** OnError **/
    private throwError() {
        throw new Error();
    }

    @HistogramOnError()
    public histogramOnErrorAllDefaults() {
        this.throwError();
    }

    @HistogramOnError('onerror.default.value')
    public histogramOnErrorDefaultValue() {
        this.throwError();
    }

    @HistogramOnError('onerror', 26)
    public histogramOnError() {
        this.throwError();
    }

    @HistogramOnError('onerror.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public histogramOnErrorWithTags() {
        this.throwError();
    }

    /** Don't add error.message as tag in production, tag should have low cardinality **/
    @HistogramOnError('onerror.with.derived.tags', 40, (arg: string, error: any) => {return {arg, constTag: 'const-tag', error: error.message}})
    public histogramOnErrorWithDerivedTags(arg: string) {
        throw new Error("error-1");
    }

    @HistogramOnError('onerror.with.args', '0.a.deeply.nested.property.4')
    public histogramOnErrorWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @HistogramOnError('onerror.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public histogramOnErrorWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @HistogramOnError('onerror', 25)
    public histogramOnNoError() {
    }

    /** Around **/

    @HistogramAround()
    public histogramAroundSuccessAllDefaults() {
    }

    @HistogramAround('around.default.value')
    public histogramAroundSuccessDefaultValue() {
    }

    @HistogramAround('around', 87)
    public histogramAroundSuccess() {}

    @HistogramAround('around.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public histogramAroundSuccessWithTags() {}

    @HistogramAround('around.with.args', '0.a.deeply.nested.property')
    public histogramAroundSuccessWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @HistogramAround('around.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public histogramAroundSuccessWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @HistogramAround()
    public histogramAroundFailureAllDefaults() {
        this.throwError();
    }

    @HistogramAround('around.default.value')
    public histogramAroundFailureDefaultValue() {
        this.throwError();
    }

    @HistogramAround('around', 87)
    public histogramAroundFailure() {
        this.throwError();
    }

    @HistogramAround('around.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public histogramAroundFailureWithTags() {
        this.throwError();
    }

    @HistogramAround('around.with.args', '0.a.deeply.nested.property')
    public histogramAroundFailureWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @HistogramAround('around.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public histogramAroundFailureWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }
}
