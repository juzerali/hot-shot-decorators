import {
  HistogramAfter,
  HistogramAround,
  HistogramBefore,
  HistogramOnError,
} from "./metric.decorator";
import {
  doNotAddError,
  extractAmount,
  ReturnValue,
  returnValueOrError,
} from "./test.utils";

/**
 * Class to help test histogram decorators
 */
export class HistogramTests {
  /** Before **/
  @HistogramBefore()
  public histogramBeforeAllDefaults() {
    return "histogramBeforeAllDefaults.returnValue";
  }

  @HistogramBefore("before.default.value")
  public histogramBeforeDefaultValue() {
    return "histogramBeforeDefaultValue.returnValue";
  }

  @HistogramBefore("before", 22)
  public histogramBefore() {
    return "histogramBefore.returnValue";
  }

  @HistogramBefore("before.with.tags", 39, {
    type: "Payout",
    gateway: "Stripe",
  })
  public histogramBeforeWithTags() {
    return "histogramBeforeWithTags.returnValue";
  }

  @HistogramBefore("before.with.derived.tags", 39, (...args: unknown[]) => {
    const arg = typeof args[0] === "string" ? args[0] : "";
    return { arg, constTag: "const-tag" };
  })
  public histogramBeforeWithDerivedTags(_arg: string) {
    return "histogramBeforeWithDerivedTags.returnValue";
  }

  @HistogramBefore("before.with.args", "0.a.deeply.nested.property")
  public histogramBeforeWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "histogramBeforeWithArgs.returnValue";
  }

  @HistogramBefore("before.derive", extractAmount)
  public histogramBeforeWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "histogramBeforeWithFunctionDerivation.returnValue";
  }

  @HistogramBefore("before.derive.throws", (_arg1, _arg2) => {
    throw new Error();
  })
  public histogramBeforeWithFunctionDerivationThrows(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "histogramBeforeWithFunctionDerivationThrows.returnValue";
  }

  /** After **/
  @HistogramAfter()
  public histogramAfterAllDefaults() {
    return "histogramAfterAllDefaults.returnValue";
  }

  @HistogramAfter("after.default.value")
  public histogramAfterDefaultValue() {
    return "histogramAfterDefaultValue.returnValue";
  }

  @HistogramAfter("after", 23)
  public histogramAfter() {
    return "histogramAfter.returnValue";
  }

  @HistogramAfter("after.with.tags", 40, { type: "Payout", gateway: "Stripe" })
  public histogramAfterWithTags() {
    return "histogramAfterWithTags.returnValue";
  }

  @HistogramAfter("after.with.derived.tags", 40, (...args) => {
    const arg = typeof args[0] === "string" ? args[0] : "";
    const returnValue = typeof args[1] === "string" ? args[1] : "";
    return { arg, returnValue, constTag: "const-tag" };
  })
  public histogramAfterWithDerivedTags(_arg: string): string {
    return "histogramAfterWithDerivedTags.returnValue";
  }

  @HistogramAfter("after.with.args", "0.a.deeply.nested.property.4")
  public histogramAfterWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "histogramAfterWithArgs.returnValue";
  }

  @HistogramAfter("after.derive", extractAmount)
  public histogramAfterWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    return "histogramAfterWithFunctionDerivation.returnValue";
  }

  /** OnError **/
  private throwError() {
    throw new Error();
  }

  @HistogramOnError()
  public histogramOnErrorAllDefaults() {
    this.throwError();
  }

  @HistogramOnError("onerror.default.value")
  public histogramOnErrorDefaultValue() {
    this.throwError();
  }

  @HistogramOnError("onerror", 26)
  public histogramOnError() {
    this.throwError();
  }

  @HistogramOnError("onerror.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public histogramOnErrorWithTags() {
    this.throwError();
  }

  /** Don't add error.message as tag in production, tag should have low cardinality **/
  @HistogramOnError("onerror.with.derived.tags", 40, doNotAddError)
  public histogramOnErrorWithDerivedTags(_arg: string) {
    throw new Error("error-1");
  }

  @HistogramOnError("onerror.with.args", "0.a.deeply.nested.property.4")
  public histogramOnErrorWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @HistogramOnError("onerror.derive", extractAmount)
  public histogramOnErrorWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @HistogramOnError("onerror", 25)
  public histogramOnNoError() {
    // do nothing.
  }

  /** Around **/

  @HistogramAround()
  public histogramAroundSuccessAllDefaults() {
    // do nothing.
  }

  @HistogramAround("around.default.value")
  public histogramAroundSuccessDefaultValue() {
    // do nothing.
  }

  @HistogramAround("around", 87)
  public histogramAroundSuccess() {
    // do nothing.
  }

  @HistogramAround("around.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public histogramAroundSuccessWithTags() {
    // do nothing.
  }

  @HistogramAround("around.with.derived.tags", 40, returnValueOrError)
  public histogramAroundSuccessWithDerivedTags(_arg: string): ReturnValue {
    return {
      tags: {
        returnValue: "histogramAroundSuccessWithDerivedTags.returnValue",
      },
    };
  }

  @HistogramAround("around.with.args", "0.a.deeply.nested.property")
  public histogramAroundSuccessWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
  }

  @HistogramAround("around.derive", extractAmount)
  public histogramAroundSuccessWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
  }

  @HistogramAround()
  public histogramAroundFailureAllDefaults() {
    this.throwError();
  }

  @HistogramAround("around.default.value")
  public histogramAroundFailureDefaultValue() {
    this.throwError();
  }

  @HistogramAround("around", 87)
  public histogramAroundFailure() {
    this.throwError();
  }

  @HistogramAround("around.with.tags", 40, {
    type: "Payout",
    gateway: "Stripe",
  })
  public histogramAroundFailureWithTags() {
    this.throwError();
  }

  @HistogramAround("around.with.derived.tags", 40, returnValueOrError)
  public histogramAroundFailureWithDerivedTags(_arg: string): ReturnValue {
    throw new Error("error-1");
  }

  @HistogramAround("around.with.args", "0.a.deeply.nested.property")
  public histogramAroundFailureWithArgs(arg1: object) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }

  @HistogramAround("around.derive", extractAmount)
  public histogramAroundFailureWithFunctionDerivation(
    arg1: { amount: number },
    _arg2: object
  ) {
    console.log("Argument was: " + JSON.stringify(arg1));
    this.throwError();
  }
}
