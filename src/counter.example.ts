import {
  IncrementAfter,
  IncrementAround,
  IncrementBefore,
  IncrementOnError,
} from "./metric.decorator";
import {
  doNotAddError,
  extractAmount,
  ReturnValue,
  returnValueOrError,
} from "./test.utils";

/**
 * Class to help test count decorators
 */
export class CounterTests {
  private aPrivateVariable = "aPrivateVariable";
  /** Before **/
  @IncrementBefore()
  public incBeforeAllDefaults() {
    return "incBeforeAllDefaults.returnValue";
  }

  @IncrementBefore("before.default.value")
  public incBeforeDefaultValue() {
    return "incBeforeDefaultValue.returnValue";
  }

  @IncrementBefore("before", 22)
  public incBefore() {
    return "incBefore.returnValue";
  }

  @IncrementBefore("before.with.tags", 39, {
    type: "Payout",
    gateway: "Stripe",
  })
  public incBeforeWithTags() {
    return "incBeforeWithTags.returnValue";
  }

  @IncrementBefore("before.with.derived.tags", 39, (...args: unknown[]) => {
    const arg = typeof args[0] === "string" ? args[0] : "";
    return { arg, constTag: "const-tag" };
  })
  public incBeforeWithDerivedTags(_arg: string) {
    return "incBeforeWithDerivedTags.returnValue";
  }

  @IncrementBefore("before.with.args", "0.a.deeply.nested.property")
  public incBeforeWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "incBeforeWithArgs.returnValue";
  }

  @IncrementBefore(
    "before.derive",
    extractAmount
    // (arg1, _arg2) => (arg1 as { amount: number }).amount
  )
  public incBeforeWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "incBeforeWithFunctionDerivation.returnValue";
  }

  @IncrementBefore("before.with.context", 98)
  public incBeforeWithContext() {
    this.ghost();
    return "incBeforeWithContext.returnValue";
  }

  private ghost() {
    // do nothing.
  }

  @IncrementBefore("before.with.private.variable", 67)
  public incBeforeWithPrivateVariable() {
    return this.aPrivateVariable;
  }

  @IncrementBefore("before.derive.throws", (_arg1, _arg2) => {
    throw new Error();
  })
  public incBeforeWithFunctionDerivationThrows(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "incBeforeWithFunctionDerivationThrows.returnValue";
  }

  /** After **/
  @IncrementAfter()
  public incAfterAllDefaults() {
    return "incAfterAllDefaults.returnValue";
  }

  @IncrementAfter("after.default.value")
  public incAfterDefaultValue() {
    return "incAfterDefaultValue.returnValue";
  }

  @IncrementAfter("after", 23)
  public incAfter() {
    return "incAfter.returnValue";
  }

  @IncrementAfter("after.with.tags", 40, { type: "Payout", gateway: "Stripe" })
  public incAfterWithTags() {
    return "incAfterWithTags.returnValue";
  }

  @IncrementAfter("after.with.derived.tags", 40, doNotAddError)
  public incAfterWithDerivedTags(_arg: string): string {
    return "incAfterWithDerivedTags.returnValue";
  }

  @IncrementAfter("after.with.args", "0.a.deeply.nested.property.4")
  public incAfterWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "incAfterWithArgs.returnValue";
  }

  @IncrementAfter("after.derive", extractAmount)
  public incAfterWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "incAfterWithFunctionDerivation.returnValue";
  }

  /** OnError **/
  private throwError() {
    throw new Error();
  }

  @IncrementOnError()
  public incOnErrorAllDefaults() {
    this.throwError();
  }

  @IncrementOnError("onerror.default.value")
  public incOnErrorDefaultValue() {
    this.throwError();
  }

  @IncrementOnError("onerror", 26)
  public incOnError() {
    this.throwError();
  }

  @IncrementOnError("onerror.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public incOnErrorWithTags() {
    this.throwError();
  }

  /** Don't add error.message as tag in production, tag should have low cardinality **/
  @IncrementOnError("onerror.with.derived.tags", 40, doNotAddError)
  public incOnErrorWithDerivedTags(_arg: string) {
    throw new Error("error-1");
  }

  @IncrementOnError("onerror.with.args", "0.a.deeply.nested.property.4")
  public incOnErrorWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @IncrementOnError("onerror.derive", extractAmount)
  public incOnErrorWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @IncrementOnError("onerror", 25)
  public incOnNoError() {
    // do nothing.
  }

  /** Around **/

  @IncrementAround()
  public incAroundSuccessAllDefaults() {
    // do nothing.
  }

  @IncrementAround("around.default.value")
  public incAroundSuccessDefaultValue() {
    // do nothing.
  }

  @IncrementAround("around", 87)
  public incAroundSuccess() {
    // do nothing.
  }

  @IncrementAround("around.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public incAroundSuccessWithTags() {
    // do nothing.
  }

  @IncrementAround("around.with.derived.tags", 40, returnValueOrError)
  public incAroundSuccessWithDerivedTags(_arg: string): ReturnValue {
    return {
      tags: { returnValue: "incAroundSuccessWithDerivedTags.returnValue" },
    };
  }

  @IncrementAround("around.with.args", "0.a.deeply.nested.property")
  public incAroundSuccessWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
  }

  @IncrementAround("around.derive", extractAmount)
  public incAroundSuccessWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
  }

  @IncrementAround()
  public incAroundFailureAllDefaults() {
    this.throwError();
  }

  @IncrementAround("around.default.value")
  public incAroundFailureDefaultValue() {
    this.throwError();
  }

  @IncrementAround("around", 87)
  public incAroundFailure() {
    this.throwError();
  }

  @IncrementAround("around.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public incAroundFailureWithTags() {
    this.throwError();
  }

  @IncrementAround("around.with.derived.tags", 40, returnValueOrError)
  public incAroundFailureWithDerivedTags(_arg: string): {
    tag: { string: string };
  } {
    throw new Error("error-1");
  }

  @IncrementAround("around.with.args", "0.a.deeply.nested.property")
  public incAroundFailureWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @IncrementAround("around.derive", extractAmount)
  public incAroundFailureWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }
}
