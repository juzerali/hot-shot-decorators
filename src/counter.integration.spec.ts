import {StatsD} from "hot-shots";
import {anything, deepEqual, instance, mock, objectContaining, resetCalls, verify} from 'ts-mockito'
import {
    IncrementAfterWrapper,
    IncrementAroundWrapper,
    IncrementBeforeWrapper,
    IncrementOnErrorWrapper
} from "./counter";

describe("Increment", () => {
    const client:StatsD = new StatsD({
        port: 8125
    })

    const IncrementBefore = IncrementBeforeWrapper(client);
    const IncrementAfter = IncrementAfterWrapper(client);
    const IncrementOnError = IncrementOnErrorWrapper(client);
    const IncrementAround = IncrementAroundWrapper(client);

    class CounterTests {
        @IncrementBefore()
        public incAllDefaults() {}

        @IncrementBefore("before.default.value")
        public incBeforeDefaultValue() {}

        @IncrementBefore("before", 22)
        public incBefore() {}

        @IncrementBefore("before.with.tags", 39, {type: "Payout", gateway: "Stripe"})
        public incBeforeWithTags() {}

        @IncrementAfter("after", 19)
        public incAfter() {}

        @IncrementOnError("error", 26)
        public incOnError() {
            throw new Error();
        }

        @IncrementOnError("error", 25)
        public incOnNoError() {}

        @IncrementAround("around", 87)
        public incAroundSuccess() {}

        @IncrementAround("aroundError", 89)
        public incAroundFailure() {
            throw new Error("");
        }
    }

    const test = new CounterTests();

    describe("IncrementBeforeWrapper", () => {
        it("should increment by 1 and use stats name as Class#methodName by default", () => {
            test.incAllDefaults();
        });

        it("should increment 1 be default", () => {
            test.incBeforeDefaultValue();
        });

        it("should increment on method call", () => {
            test.incBefore();
        });

        it("should report tags", () => {
            test.incBeforeWithTags();
        });
    });

    describe("IncrementAfterWrapper", () => {
        it("should increment after successful method call", () => {
            test.incAfter();
        });
    });

    describe("IncrementOnErrorWrapper", () => {
        it("should increment when error is thrown", () => {
            test.incOnError();
        });

        it("should NOT increment when NO error is thrown", () => {
            test.incOnNoError();
        });
    });

    describe("IncrementAroundWrapper", () => {
        it("should increment before and after successful method call with suffix", () => {
            test.incAroundSuccess();
        });

        it("should increment before and after error method call with suffix", () => {
            test.incAroundFailure();
        });
    });
});


