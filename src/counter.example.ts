import {IncrementAfter, IncrementAround, IncrementBefore, IncrementOnError} from "./metric.decorator";

/**
 * Class to help test count decorators
 */
export class CounterTests {
    /** Before **/
    @IncrementBefore()
    public incBeforeAllDefaults() {
        return 'incBeforeAllDefaults.returnValue';
    }

    @IncrementBefore('before.default.value')
    public incBeforeDefaultValue() {
        return 'incBeforeDefaultValue.returnValue';
    }

    @IncrementBefore('before', 22)
    public incBefore() {
        return 'incBefore.returnValue';
    }

    @IncrementBefore('before.with.tags', 39, {type: 'Payout', gateway: 'Stripe'})
    public incBeforeWithTags() {
        return 'incBeforeWithTags.returnValue';
    }


    @IncrementBefore('before.with.derived.tags', 39, (arg: string) => {
        return {arg, constTag: 'const-tag'}
    })
    public incBeforeWithDerivedTags(arg: string) {
        return 'incBeforeWithDerivedTags.returnValue';
    }

    @IncrementBefore('before.with.args', '0.a.deeply.nested.property')
    public incBeforeWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'incBeforeWithArgs.returnValue';
    }

    @IncrementBefore('before.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public incBeforeWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'incBeforeWithFunctionDerivation.returnValue';
    }

    @IncrementBefore('before.derive.throws', (arg1: { amount: number }, arg2: object) => {
        throw new Error();
    })
    public incBeforeWithFunctionDerivationThrows(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'incBeforeWithFunctionDerivationThrows.returnValue';
    }

    /** After **/
    @IncrementAfter()
    public incAfterAllDefaults() {
        return 'incAfterAllDefaults.returnValue';
    }

    @IncrementAfter('after.default.value')
    public incAfterDefaultValue() {
        return 'incAfterDefaultValue.returnValue';
    }

    @IncrementAfter('after', 23)
    public incAfter() {
        return 'incAfter.returnValue';
    }

    @IncrementAfter('after.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public incAfterWithTags() {
        return 'incAfterWithTags.returnValue';
    }

    @IncrementAfter('after.with.derived.tags', 40, (arg: string, returnValue: string) => {
        return {arg, returnValue, constTag: 'const-tag'}
    })
    public incAfterWithDerivedTags(arg: string): string {
        return 'incAfterWithDerivedTags.returnValue';
    }

    @IncrementAfter('after.with.args', '0.a.deeply.nested.property.4')
    public incAfterWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'incAfterWithArgs.returnValue';
    }

    @IncrementAfter('after.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public incAfterWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        return 'incAfterWithFunctionDerivation.returnValue';
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

    @IncrementOnError('onerror.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public incOnErrorWithTags() {
        this.throwError();
    }

    /** Don't add error.message as tag in production, tag should have low cardinality **/
    @IncrementOnError('onerror.with.derived.tags', 40, (arg: string, error: any) => {
        return {arg, constTag: 'const-tag', error: error.message}
    })
    public incOnErrorWithDerivedTags(arg: string) {
        throw new Error("error-1");
    }

    @IncrementOnError('onerror.with.args', '0.a.deeply.nested.property.4')
    public incOnErrorWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementOnError('onerror.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public incOnErrorWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementOnError('onerror', 25)
    public incOnNoError() {
    }

    /** Around **/

    @IncrementAround()
    public incAroundSuccessAllDefaults() {
    }

    @IncrementAround('around.default.value')
    public incAroundSuccessDefaultValue() {
    }

    @IncrementAround('around', 87)
    public incAroundSuccess() {
    }

    @IncrementAround('around.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public incAroundSuccessWithTags() {
    }

    @IncrementAround('around.with.derived.tags', 40, (arg: string, returnValueOrError?: any) => {
        const tags = {arg, constTag: 'const-tag'};
        if(!returnValueOrError) return tags;
        return returnValueOrError instanceof Error ?
            {...tags, error: returnValueOrError.message} :
            {...tags, returnValue: returnValueOrError.tags.returnValue}
    })
    public incAroundSuccessWithDerivedTags(arg: string): { tags: {} } {
        return {tags: {'returnValue': "incAroundSuccessWithDerivedTags.returnValue"}};
    }

    @IncrementAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundSuccessWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
    }

    @IncrementAround('around.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public incAroundSuccessWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
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

    @IncrementAround('around.with.tags', 40, {type: 'Payout', gateway: 'Stripe'})
    public incAroundFailureWithTags() {
        this.throwError();
    }

    @IncrementAround('around.with.derived.tags', 40, (arg: string, returnValueOrError?: any) => {
        const tags = {arg, constTag: 'const-tag'};
        if(!returnValueOrError) return tags;
        return returnValueOrError instanceof Error ?
            {...tags, error: returnValueOrError.message} :
            {...tags, returnValue: returnValueOrError.tags.returnValue}
    })
    public incAroundFailureWithDerivedTags(arg: string): { tag: { string: string } } {
        throw new Error("error-1");
    }

    @IncrementAround('around.with.args', '0.a.deeply.nested.property')
    public incAroundFailureWithArgs(arg1: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }

    @IncrementAround('around.derive', (arg1: { amount: number }, arg2: object) => arg1.amount)
    public incAroundFailureWithFunctionDerivation(arg1: { amount: number }, arg2: object) {
        console.log('Argument was: ' + JSON.stringify(arg1));
        this.throwError();
    }
}
