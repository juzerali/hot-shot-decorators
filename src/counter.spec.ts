import { anything, objectContaining, resetCalls, verify } from 'ts-mockito';
import { mockedStatsD } from './metric.decorator';
import {CounterExampleWrapper, CounterTests} from './counter.example';

describe('Increment', () => {
  // const mockedStatsD: StatsD = mock(StatsD);

  beforeEach(() => {
    resetCalls(mockedStatsD);
  });

  describe('IncrementBeforeWrapper', () => {
    it('should increment by 1 and use stats name as Class.methodName by default', () => {
      const test = new CounterTests();
      const result = test.incBeforeAllDefaults();
      expect(result).toEqual('incBeforeAllDefaults.returnValue');
      verify(mockedStatsD.increment('CounterTests.incBeforeAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment by 1 when called from a different context', async () => {
      const test = new CounterExampleWrapper(new CounterTests());
      const result = await test.incBeforeWithFunctionDerivation();
      expect(result).toEqual('incBeforeWithFunctionDerivation.returnValue');
      verify(mockedStatsD.increment('before.derive', 15, objectContaining({}))).once();
    });

    it('should increment 1 be default', () => {
      const test = new CounterTests();
      const result = test.incBeforeDefaultValue();
      expect(result).toEqual('incBeforeDefaultValue.returnValue');
      verify(mockedStatsD.increment('before.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      const result = test.incBefore();
      expect(result).toEqual('incBefore.returnValue');
      verify(mockedStatsD.increment('before', 22, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      const result = test.incBeforeWithTags();
      expect(result).toEqual('incBeforeWithTags.returnValue');
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

    it('should report derived tags', () => {
      const test = new CounterTests();
      const result = test.incBeforeWithDerivedTags('arg-tag');
      expect(result).toEqual('incBeforeWithDerivedTags.returnValue');
      verify(
        mockedStatsD.increment(
          'before.with.derived.tags',
          39,
          objectContaining({
            constTag: 'const-tag',
            arg: 'arg-tag',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      const result = test.incBeforeWithArgs({ a: { deeply: { nested: { property: 91 } } } });
      expect(result).toEqual('incBeforeWithArgs.returnValue');
      verify(mockedStatsD.increment('before.with.args', 91, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      const result = test.incBeforeWithFunctionDerivation({ amount: 149 }, {});
      expect(result).toEqual('incBeforeWithFunctionDerivation.returnValue');
      verify(mockedStatsD.increment('before.derive', 149, anything())).once();
    });

    it('should default to 1 when derivative function throws', () => {
      const test = new CounterTests();
      const result = test.incBeforeWithFunctionDerivationThrows({ amount: 149 }, {});
      expect(result).toEqual('incBeforeWithFunctionDerivationThrows.returnValue');
      verify(mockedStatsD.increment('before.derive.throws', 1, anything())).once();
    });
  });

  describe('IncrementAfterWrapper', () => {
    it('should increment by 1 and use stats name as Class.methodName by default', () => {
      const test = new CounterTests();
      const result = test.incAfterAllDefaults();
      expect(result).toEqual('incAfterAllDefaults.returnValue');
      verify(mockedStatsD.increment('CounterTests.incAfterAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      const result = test.incAfterDefaultValue();
      expect(result).toEqual('incAfterDefaultValue.returnValue');
      verify(mockedStatsD.increment('after.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      const result = test.incAfter();
      expect(result).toEqual('incAfter.returnValue');
      verify(mockedStatsD.increment('after', 23, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      const result = test.incAfterWithTags();
      expect(result).toEqual('incAfterWithTags.returnValue');
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

    it('should report derived tags', () => {
      const test = new CounterTests();
      const result = test.incAfterWithDerivedTags('arg-tag');
      expect(result).toEqual('incAfterWithDerivedTags.returnValue');
      verify(
        mockedStatsD.increment(
          'after.with.derived.tags',
          40,
          objectContaining({
            arg: 'arg-tag',
            returnValue: 'incAfterWithDerivedTags.returnValue',
            constTag: 'const-tag',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      const result = test.incAfterWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      expect(result).toEqual('incAfterWithArgs.returnValue');
      verify(mockedStatsD.increment('after.with.args', 87, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      const result = test.incAfterWithFunctionDerivation({ amount: 149 }, {});
      expect(result).toEqual('incAfterWithFunctionDerivation.returnValue');
      verify(mockedStatsD.increment('after.derive', 149, anything())).once();
    });
  });

  describe('IncrementOnErrorWrapper', () => {
    it('should increment by 1 and use stats name as Class.methodName by default', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorAllDefaults()).toThrow();
      verify(mockedStatsD.increment('CounterTests.incOnErrorAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorDefaultValue()).toThrow();
      verify(mockedStatsD.increment('onerror.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      expect(() => test.incOnError()).toThrow();
      verify(mockedStatsD.increment('onerror', 26, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorWithTags()).toThrow();
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

    it('should report with derived tags', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorWithDerivedTags('arg-tag')).toThrow();
      verify(
        mockedStatsD.increment(
          'onerror.with.derived.tags',
          40,
          objectContaining({
            arg: 'arg-tag',
            constTag: 'const-tag',
            error: 'error-1',
          }),
        ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } })).toThrow();
      verify(mockedStatsD.increment('onerror.with.args', 87, anything())).once();
    });

    it('should not increment on no error', () => {
      const test = new CounterTests();
      test.incOnNoError();
      verify(mockedStatsD.increment('onerror', 87, anything())).times(0);
    });

    it('should derive value from functions', () => {
      const test = new CounterTests();
      expect(() => test.incOnErrorWithFunctionDerivation({ amount: 149 }, {})).toThrow();
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
        const failure = mockedStatsD.increment('around.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class.methodName by default', () => {
        const test = new CounterTests();
        test.incAroundSuccessAllDefaults();

        const attempted = mockedStatsD.increment(
          'CounterTests.incAroundSuccessAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.increment(
          'CounterTests.incAroundSuccessAllDefaults.success',
          1,
          objectContaining({}),
        );
        const failure = mockedStatsD.increment(
          'CounterTests.incAroundSuccessAllDefaults.failure',
          anything(),
          anything(),
        );
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new CounterTests();
        test.incAroundSuccessDefaultValue();

        const attempted = mockedStatsD.increment('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.increment('around.default.value.success', 1, anything());
        const failure = mockedStatsD.increment('around.default.value.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        test.incAroundSuccess();

        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const success = mockedStatsD.increment('around.success', 87, anything());
        const failure = mockedStatsD.increment('around.failure', anything(), anything());

        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
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

        const failure = mockedStatsD.increment('around.with.tags.failure', anything(), anything());

        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should report with derived tags', () => {
        const test = new CounterTests();
        const result = test.incAroundSuccessWithDerivedTags('arg-tag');

        expect(result).toEqual({ tags: { returnValue: 'incAroundSuccessWithDerivedTags.returnValue' } });

        const attempted = mockedStatsD.increment(
          'around.with.derived.tags.attempted',
          40,
          objectContaining({
            constTag: 'const-tag',
            arg: 'arg-tag',
          }),
        );

        const success = mockedStatsD.increment(
          'around.with.derived.tags.success',
          40,
          objectContaining({
            constTag: 'const-tag',
            arg: 'arg-tag',
            returnValue: 'incAroundSuccessWithDerivedTags.returnValue',
          }),
        );

        const failure = mockedStatsD.increment('around.with.tags.failure', anything(), anything());

        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should inspect arguments', () => {
        const test = new CounterTests();
        test.incAroundSuccessWithArgs({ a: { deeply: { nested: { property: 91 } } } });

        const attempted = mockedStatsD.increment('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.increment('around.with.args.success', 91, anything());
        const failure = mockedStatsD.increment('around.with.args.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should derive value from function', () => {
        const test = new CounterTests();
        test.incAroundSuccessWithFunctionDerivation({ amount: 149 }, {});
        const attempted = mockedStatsD.increment('around.derive.attempted', 149, anything());
        const success = mockedStatsD.increment('around.derive.success', 149, anything());
        const failure = mockedStatsD.increment('around.derive.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });
    });

    describe('failure', () => {
      it('should increment before and after method call with suffixes', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailure()).toThrow();
        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const failure = mockedStatsD.increment('around.failure', 87, anything());
        const success = mockedStatsD.increment('around.success', anything(), anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment by 1 and use stats name as Class.methodName by default', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureAllDefaults()).toThrow();

        const attempted = mockedStatsD.increment(
          'CounterTests.incAroundFailureAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const failure = mockedStatsD.increment(
          'CounterTests.incAroundFailureAllDefaults.failure',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.increment(
          'CounterTests.incAroundFailureAllDefaults.success',
          anything(),
          anything(),
        );
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment 1 be default', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureDefaultValue()).toThrow();

        const attempted = mockedStatsD.increment('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.increment('around.default.value.success', anything(), anything());
        const failure = mockedStatsD.increment('around.default.value.failure', 1, anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailure()).toThrow();

        const attempted = mockedStatsD.increment('around.attempted', 87, anything());
        const failure = mockedStatsD.increment('around.failure', 87, anything());
        const success = mockedStatsD.increment('around.success', anything(), anything());

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should report tags', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureWithTags()).toThrow();

        const attempted = mockedStatsD.increment(
          'around.with.tags.attempted',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        const failure = mockedStatsD.increment(
          'around.with.tags.failure',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );
        const success = mockedStatsD.increment('around.with.tags.success', anything(), anything());

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should report with derived tags', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureWithDerivedTags('arg-tag')).toThrow();

        const attempted = mockedStatsD.increment(
          'around.with.derived.tags.attempted',
          40,
          objectContaining({
            constTag: 'const-tag',
            arg: 'arg-tag',
          }),
        );

        const failure = mockedStatsD.increment(
          'around.with.derived.tags.failure',
          40,
          objectContaining({
            constTag: 'const-tag',
            arg: 'arg-tag',
            error: 'error-1',
          }),
        );

        const success = mockedStatsD.increment('around.with.tags.success', anything(), anything());

        verify(attempted).once();
        verify(success).never();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should inspect arguments', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureWithArgs({ a: { deeply: { nested: { property: 91 } } } })).toThrow();

        const attempted = mockedStatsD.increment('around.with.args.attempted', 91, anything());
        const failure = mockedStatsD.increment('around.with.args.failure', 91, anything());
        const success = mockedStatsD.increment('around.with.args.success', anything(), anything());

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should derive value from functions', () => {
        const test = new CounterTests();
        expect(() => test.incAroundFailureWithFunctionDerivation({ amount: 149 }, {})).toThrow();

        const attempted = mockedStatsD.increment('around.derive.attempted', 149, anything());
        const failure = mockedStatsD.increment('around.derive.failure', 149, anything());
        const success = mockedStatsD.increment('around.derive.success', 149, anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });
    });
  });
});
