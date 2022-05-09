import { StatsD } from 'hot-shots';
import {anything, deepEqual, instance, mock, objectContaining, resetCalls, spy, verify} from 'ts-mockito';
import {
  HistogramAfterWrapper,
  HistogramAroundWrapper,
  HistogramBeforeWrapper,
  HistogramOnErrorWrapper,
} from './histogram';

describe('Histogram', () => {
  // const mockedStatsD: StatsD = mock(StatsD);
  const client = new StatsD({port: 8125})
  const mockedStatsD = spy(client);
  const HistogramBefore = HistogramBeforeWrapper(client);
  const HistogramAfter = HistogramAfterWrapper(client);
  const HistogramOnError = HistogramOnErrorWrapper(client);
  const HistogramAround = HistogramAroundWrapper(client);

  class CounterTests {
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

  beforeEach(() => {
    resetCalls(mockedStatsD);
  });

  describe('HistogramBeforeWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incBeforeAllDefaults();
      verify(mockedStatsD.histogram('CounterTests#incBeforeAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 be default', () => {
      const test = new CounterTests();
      test.incBeforeDefaultValue();
      verify(mockedStatsD.histogram('before.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incBefore();
      verify(mockedStatsD.histogram('before', 22, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
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
      const test = new CounterTests();
      test.incBeforeWithArgs({ a: { deeply: { nested: { property: 91 } } } });
      verify(mockedStatsD.histogram('before.with.args', 91, anything())).once();
    });
  });

  describe('HistogramAfterWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incAfterAllDefaults();
      verify(mockedStatsD.histogram('CounterTests#incAfterAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      test.incAfterDefaultValue();
      verify(mockedStatsD.histogram('after.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incAfter();
      verify(mockedStatsD.histogram('after', 23, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
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
      const test = new CounterTests();
      test.incAfterWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.histogram('after.with.args', 87, anything())).once();
    });
  });

  describe('HistogramOnErrorWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new CounterTests();
      test.incOnErrorAllDefaults();
      verify(mockedStatsD.histogram('CounterTests#incOnErrorAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new CounterTests();
      test.incOnErrorDefaultValue();
      verify(mockedStatsD.histogram('onerror.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new CounterTests();
      test.incOnError();
      verify(mockedStatsD.histogram('onerror', 26, anything())).once();
    });

    it('should report tags', () => {
      const test = new CounterTests();
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
      const test = new CounterTests();
      test.incOnErrorWithArgs({ a: { deeply: { nested: { property: [0, 1, 2, 3, 87] } } } });
      verify(mockedStatsD.histogram('onerror.with.args', 87, anything())).once();
    });

    it('should not increment on no error', () => {
      const test = new CounterTests();
      test.incOnNoError();
      verify(mockedStatsD.histogram('onerror', 87, anything())).times(0);
    });
  });

  describe('HistogramAroundWrapper', () => {
    describe('success', () => {
      it('should increment before and after successful method call with suffixes', () => {
        const test = new CounterTests();
        test.incAroundSuccess();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new CounterTests();
        test.incAroundSuccessAllDefaults();

        const attempted = mockedStatsD.histogram(
          'CounterTests#incAroundSuccessAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.histogram(
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

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.success', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        test.incAroundSuccess();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new CounterTests();
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
        const test = new CounterTests();
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
        const test = new CounterTests();
        test.incAroundFailure();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.failure', 87, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new CounterTests();
        test.incAroundFailureAllDefaults();

        const attempted = mockedStatsD.histogram(
          'CounterTests#incAroundFailureAllDefaults.attempted',
          1,
          objectContaining({}),
        );
        const success = mockedStatsD.histogram(
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

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.failure', 1, anything());
        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new CounterTests();
        test.incAroundFailure();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.failure', 87, anything());

        verify(attempted).once();
        verify(success).once();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new CounterTests();
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
        const test = new CounterTests();
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
