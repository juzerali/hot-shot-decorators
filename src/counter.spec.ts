import {StatsD} from "hot-shots";
import {anything, deepEqual, instance, mock, objectContaining, resetCalls, verify} from 'ts-mockito'
import {
    IncrementAfterWrapper,
    IncrementAroundWrapper,
    IncrementBeforeWrapper,
    IncrementOnErrorWrapper
} from "./counter";

describe("Increment", () => {
    const mockedStatsD:StatsD = mock(StatsD);
    const client:StatsD = instance(mockedStatsD);
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

        @IncrementBefore("before.with.args", 19)
        public incBeforeWithArgs(arg1: string, arg2: number, arg3: any) {}

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

    beforeEach(() => {
        resetCalls(mockedStatsD);
    })

    describe("IncrementBeforeWrapper", () => {
        it("should increment by 1 and use stats name as Class#methodName by default", () => {
            const test = new CounterTests();
            test.incAllDefaults();
            verify(mockedStatsD.increment("CounterTests#incAllDefaults", 1, objectContaining({}))).once();
        });

        it("should increment 1 be default", () => {
            const test = new CounterTests();
            test.incBeforeDefaultValue();
            verify(mockedStatsD.increment("before.default.value", 1, anything())).once();
        });

        it("should increment on method call", () => {
            const test = new CounterTests();
            test.incBefore();
            verify(mockedStatsD.increment("before", 22, anything())).once();
        });

        it("should report tags", () => {
            const test = new CounterTests();
            test.incBeforeWithTags();
            verify(mockedStatsD.increment("before.with.tags", 39, objectContaining({
                type: "Payout",
                gateway: "Stripe"
            }))).once();
        });

        it("should inspect arguments", () => {
            const test = new CounterTests();
            test.incBeforeWithArgs("string", 22, {});
            verify(mockedStatsD.increment("before.with.args", 19)).once();
        });
    });

    describe("IncrementAfterWrapper", () => {
        it("should increment after successful method call", () => {
            const test = new CounterTests();
            test.incAfter();
            verify(mockedStatsD.increment("after", 19, anything())).once();
        });
    });

    describe("IncrementOnErrorWrapper", () => {
        it("should increment when error is thrown", () => {
            const test = new CounterTests();
            test.incOnError();
            verify(mockedStatsD.increment("error", 26, anything())).once();
        });

        it("should NOT increment when NO error is thrown", () => {
            const test = new CounterTests();
            test.incOnNoError();
            verify(mockedStatsD.increment("error", anything(), anything())).times(0);
        });
    });

    describe("IncrementAroundWrapper", () => {
        it("should increment before and after successful method call with suffix", () => {
            const test = new CounterTests();
            test.incAroundSuccess();
            verify(mockedStatsD.increment("around.attempted", 87, anything())).once();
            verify(mockedStatsD.increment("around.success", 87, anything())).once();
        });

        it("should increment before and after error method call with suffix", () => {
            const test = new CounterTests();
            test.incAroundFailure();
            verify(mockedStatsD.increment("aroundError.attempted", 89, anything())).once();
            verify(mockedStatsD.increment("aroundError.failure", 89, anything())).once();
        });
    });
});


