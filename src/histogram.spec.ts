import {anything, objectContaining, resetCalls, verify} from 'ts-mockito';
import {HistogramTest} from './histogram.example';
import {mockedStatsD} from "./metric.decorator";

describe('Histogram', () => {
  // const mockedStatsD: StatsD = mock(StatsD);

  beforeEach(() => {
    resetCalls(mockedStatsD);
  });

  describe('HistogramBeforeWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTest();
      test.incBeforeAllDefaults();
      verify(mockedStatsD.histogram('HistogramTest#incBeforeAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 be default', () => {
      const test = new HistogramTest();
      test.incBeforeDefaultValue();
      verify(mockedStatsD.histogram('before.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTest();
      test.incBefore();
      verify(mockedStatsD.histogram('before', 22, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTest();
      test.incBeforeWithTags();
      verify(
        mockedStatsD.histogram(
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
      const test = new HistogramTest();
      test.incBeforeWithArgs({ a: { deeply: { nested: { property: 91 } } } });
      verify(mockedStatsD.histogram('before.with.args', 91, anything())).once();
    });
  });

  describe('HistogramAfterWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTest();
      test.incAfterAllDefaults();
      verify(mockedStatsD.histogram('HistogramTest#incAfterAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new HistogramTest();
      test.incAfterDefaultValue();
      verify(mockedStatsD.histogram('after.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTest();
      test.incAfter();
      verify(mockedStatsD.histogram('after', 23, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTest();
      test.incAfterWithTags();
      verify(
        mockedStatsD.histogram(
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
      const test = new HistogramTest();
      test.incAfterWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.histogram('after.with.args', 87, anything())).once();
    });
  });

  describe('HistogramOnErrorWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTest();
      test.incOnErrorAllDefaults();
      verify(mockedStatsD.histogram('HistogramTest#incOnErrorAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new HistogramTest();
      test.incOnErrorDefaultValue();
      verify(mockedStatsD.histogram('onerror.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTest();
      test.incOnError();
      verify(mockedStatsD.histogram('onerror', 26, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTest();
      test.incOnErrorWithTags();
      verify(
        mockedStatsD.histogram(
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
      const test = new HistogramTest();
      test.incOnErrorWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.histogram('onerror.with.args', 87, anything())).once();
    });

    it('should not increment on no error', () => {
      const test = new HistogramTest();
      test.incOnNoError();
      verify(mockedStatsD.histogram('onerror', 87, anything())).times(0);
    });
  });

  describe('HistogramAroundWrapper', () => {
    describe('success', () => {
      it('should increment before and after successful method call with suffixes', () => {
        const test = new HistogramTest();
        test.incAroundSuccess();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new HistogramTest();
        test.incAroundSuccessAllDefaults();

        const attempted = mockedStatsD.histogram(
          'HistogramTest#incAroundSuccessAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.histogram(
          'HistogramTest#incAroundSuccessAllDefaults.success',
          1,
          objectContaining({}),
        );
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new HistogramTest();
        test.incAroundSuccessDefaultValue();

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.success', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new HistogramTest();
        test.incAroundSuccess();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new HistogramTest();
        test.incAroundSuccessWithTags();

        const attempted = mockedStatsD.histogram(
          'around.with.tags.attempted',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        const success = mockedStatsD.histogram(
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
        const test = new HistogramTest();
        test.incAroundSuccessWithArgs({ a: { deeply: { nested: { property: 91 } } } });

        const attempted = mockedStatsD.histogram('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.histogram('around.with.args.success', 91, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });
    });

    describe('failure', () => {
      it('should increment before and after method call with suffixes', () => {
        const test = new HistogramTest();
        test.incAroundFailure();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.failure', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new HistogramTest();
        test.incAroundFailureAllDefaults();

        const attempted = mockedStatsD.histogram(
          'HistogramTest#incAroundFailureAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.histogram(
          'HistogramTest#incAroundFailureAllDefaults.failure',
          1,
          objectContaining({}),
        );
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new HistogramTest();
        test.incAroundFailureDefaultValue();

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.failure', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new HistogramTest();
        test.incAroundFailure();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.failure', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new HistogramTest();
        test.incAroundFailureWithTags();

        const attempted = mockedStatsD.histogram(
          'around.with.tags.attempted',
          40,
          objectContaining({
            type: 'Payout',
            gateway: 'Stripe',
          }),
        );

        const success = mockedStatsD.histogram(
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
        const test = new HistogramTest();
        test.incAroundFailureWithArgs({ a: { deeply: { nested: { property: 91 } } } });

        const attempted = mockedStatsD.histogram('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.histogram('around.with.args.failure', 91, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });
    });
  });
});
