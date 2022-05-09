import {HistogramAfter, HistogramAround, HistogramBefore, HistogramOnError} from "./metric.decorator";

/**
 * Class to help test histogram decorators
 */
export class HistogramTest {
    /** Before **/
    @HistogramBefore()
    public incBeforeAllDefaults() {}

    @HistogramBefore('before.default.value')
    public incBeforeDefaultValue() {}

    @HistogramBefore('before', 22)
    public incBefore() {}

    @HistogramBefore('before.with.tags', 39, { type: 'Payout', gateway: 'Stripe' })
    public incBeforeWithTags() {}

    @HistogramBefore('before.with.args', '0.a.deeply.nested.property')
    public incBeforeWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    /** After **/
    @HistogramAfter()
    public incAfterAllDefaults() {}

    @HistogramAfter('after.default.value')
    public incAfterDefaultValue() {}

    @HistogramAfter('after', 23)
    public incAfter() {}

    @HistogramAfter('after.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAfterWithTags() {}

    @HistogramAfter('after.with.args', '0.a.deeply.nested.property.4')
    public incAfterWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    /** OnError **/
    private throwError() {
        throw new Error();
    }

    @HistogramOnError()
    public incOnErrorAllDefaults() {
        this.throwError();
    }

    @HistogramOnError('onerror.default.value')
    public incOnErrorDefaultValue() {
        this.throwError();
    }

    @HistogramOnError('onerror', 26)
    public incOnError() {
        this.throwError();
    }

    @HistogramOnError('onerror.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incOnErrorWithTags() {
        this.throwError();
    }

    @HistogramOnError('onerror.with.args', '0.a.deeply.nested.property.4')
    public incOnErrorWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @HistogramOnError('onerror', 25)
    public incOnNoError() {}

    /** Around **/

    @HistogramAround()
    public incAroundSuccessAllDefaults() {}

    @HistogramAround('around.default.value')
    public incAroundSuccessDefaultValue() {}

    @HistogramAround('around', 87)
    public incAroundSuccess() {}

    @HistogramAround('around.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAroundSuccessWithTags() {}

    @HistogramAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundSuccessWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @HistogramAround()
    public incAroundFailureAllDefaults() {
        this.throwError();
    }

    @HistogramAround('around.default.value')
    public incAroundFailureDefaultValue() {
        this.throwError();
    }

    @HistogramAround('around', 87)
    public incAroundFailure() {
        this.throwError();
    }

    @HistogramAround('around.with.tags', 40, { type: 'Payout', gateway: 'Stripe' })
    public incAroundFailureWithTags() {
        this.throwError();
    }

    @HistogramAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundFailureWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }
}
