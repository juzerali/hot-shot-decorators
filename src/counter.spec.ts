import {anything, objectContaining, resetCalls, verify} from 'ts-mockito';
import {mockedStatsD} from "./metric.decorator";
import {CounterTests} from "./counter.example";

describe('Increment', () => {
  // const mockedStatsD: StatsD = mock(StatsD);


  beforeEach(() => {
    resetCalls(mockedStatsD);
  });

  describe('IncrementBeforeWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incBeforeAllDefaults();
      verify(mockedStatsD.increment('CounterTests#incBeforeAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 be default', () => {
      const test = new CounterTests();
      test.incBeforeDefaultValue();
      verify(mockedStatsD.increment('before.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incBefore();
      verify(mockedStatsD.increment('before', 22, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      test.incBeforeWithTags();
      verify(
        mockedStatsD.increment(
          'before.with.tags',
          39,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      test.incBeforeWithArgs({ a: { deeply: { nested: { property: 91 } } } });
      verify(mockedStatsD.increment('before.with.args', 91, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      test.incBeforeWithFunctionDerivation({ amount: 149 }, {});
      verify(mockedStatsD.increment('before.derive', 149, anything())).once();
    });

    it('should default to 1 when derivative function throws', () => {
      const test = new CounterTests();
      test.incBeforeWithFunctionDerivationThrows({ amount: 149 }, {});
      verify(mockedStatsD.increment('before.derive.throws', 1, anything())).once();
    });
  });

  describe('IncrementAfterWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incAfterAllDefaults();
      verify(mockedStatsD.increment('CounterTests#incAfterAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      test.incAfterDefaultValue();
      verify(mockedStatsD.increment('after.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incAfter();
      verify(mockedStatsD.increment('after', 23, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      test.incAfterWithTags();
      verify(
        mockedStatsD.increment(
          'after.with.tags',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      test.incAfterWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.increment('after.with.args', 87, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      test.incAfterWithFunctionDerivation({ amount: 149 }, {});
      verify(mockedStatsD.increment('after.derive', 149, anything())).once();
    });
  });

  describe('IncrementOnErrorWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incOnErrorAllDefaults();
      verify(mockedStatsD.increment('CounterTests#incOnErrorAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      test.incOnErrorDefaultValue();
      verify(mockedStatsD.increment('onerror.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incOnError();
      verify(mockedStatsD.increment('onerror', 26, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      test.incOnErrorWithTags();
      verify(
        mockedStatsD.increment(
          'onerror.with.tags',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      test.incOnErrorWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.increment('onerror.with.args', 87, anything())).once();
    });

    it('should not increment on no error', () => {
      const test = new CounterTests();
      test.incOnNoError();
      verify(mockedStatsD.increment('onerror', 87, anything())).times(0);
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      test.incOnErrorWithFunctionDerivation({ amount: 149 }, {});
      verify(mockedStatsD.increment('onerror.derive', 149, anything())).once();
    });
  });

  describe('IncrementAroundWrapper', () => {
    describe('success', () => {
      it('should increment before and after successful method call with suffixes', () => {
        const test = new CounterTests();
        test.incAroundSuccess();
        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const success = mockedStatsD.increment('around.success', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new CounterTests();
        test.incAroundSuccessAllDefaults();

        const attempted = mockedStatsD.increment(
          'CounterTests#incAroundSuccessAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.increment(
          'CounterTests#incAroundSuccessAllDefaults.success',
          1,
          objectContaining({}),
        );
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new CounterTests();
        test.incAroundSuccessDefaultValue();

        const attempted = mockedStatsD.increment('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.increment('around.default.value.success', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        test.incAroundSuccess();

        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const success = mockedStatsD.increment('around.success', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new CounterTests();
        test.incAroundSuccessWithTags();

        const attempted = mockedStatsD.increment(
          'around.with.tags.attempted',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        const success = mockedStatsD.increment(
          'around.with.tags.success',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should inspect arguments', () => {
        const test = new CounterTests();
        test.incAroundSuccessWithArgs({ a: { deeply: { nested: { property: 91 } } } });

        const attempted = mockedStatsD.increment('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.increment('around.with.args.success', 91, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should derive value from function', () => {
        const test = new CounterTests();
        test.incAroundSuccessWithFunctionDerivation({ amount: 149 }, {});
        verify(mockedStatsD.increment('around.derive.attempted', 149, anything())).once();
        verify(mockedStatsD.increment('around.derive.success', 149, anything())).once();
      });
    });

    describe('failure', () => {
      it('should increment before and after method call with suffixes', () => {
        const test = new CounterTests();
        test.incAroundFailure();
        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const success = mockedStatsD.increment('around.failure', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new CounterTests();
        test.incAroundFailureAllDefaults();

        const attempted = mockedStatsD.increment(
          'CounterTests#incAroundFailureAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.increment(
          'CounterTests#incAroundFailureAllDefaults.failure',
          1,
          objectContaining({}),
        );
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new CounterTests();
        test.incAroundFailureDefaultValue();

        const attempted = mockedStatsD.increment('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.increment('around.default.value.failure', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        test.incAroundFailure();

        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const success = mockedStatsD.increment('around.failure', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new CounterTests();
        test.incAroundFailureWithTags();

        const attempted = mockedStatsD.increment(
          'around.with.tags.attempted',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        const success = mockedStatsD.increment(
          'around.with.tags.failure',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should inspect arguments', () => {
        const test = new CounterTests();
        test.incAroundFailureWithArgs({ a: { deeply: { nested: { property: 91 } } } });

        const attempted = mockedStatsD.increment('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.increment('around.with.args.failure', 91, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should derive value from functions', () => {
        const test = new CounterTests();
        test.incAroundFailureWithFunctionDerivation({ amount: 149 }, {});
        verify(mockedStatsD.increment('around.derive.attempted', 149, anything())).once();
        verify(mockedStatsD.increment('around.derive.failure', 149, anything())).once();
      });
    });
  });
});
