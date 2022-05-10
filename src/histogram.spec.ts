import {anything, objectContaining, resetCalls, verify} from 'ts-mockito';
import {mockedStatsD} from "./metric.decorator";
import {HistogramTests} from "./histogram.example";

describe('Histogram', () => {
  // const mockedStatsD: StatsD = mock(StatsD);


  beforeEach(() => {
    resetCalls(mockedStatsD);
  });

  describe('HistogramBeforeWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeAllDefaults();
      expect(result).toEqual("histogramBeforeAllDefaults.returnValue");
      verify(mockedStatsD.histogram('HistogramTests#histogramBeforeAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 be default', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeDefaultValue();
      expect(result).toEqual("histogramBeforeDefaultValue.returnValue");
      verify(mockedStatsD.histogram('before.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTests();
      const result = test.histogramBefore();
      expect(result).toEqual("histogramBefore.returnValue");
      verify(mockedStatsD.histogram('before', 22, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeWithTags();
      expect(result).toEqual("histogramBeforeWithTags.returnValue");
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

    it('should report derived tags', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeWithDerivedTags("arg-tag");
      expect(result).toEqual("histogramBeforeWithDerivedTags.returnValue");
      verify(
          mockedStatsD.histogram(
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
      const test = new HistogramTests();
      const result = test.histogramBeforeWithArgs({a: {deeply: {nested: {property: 91}}}});
      expect(result).toEqual("histogramBeforeWithArgs.returnValue");
      verify(mockedStatsD.histogram('before.with.args', 91, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeWithFunctionDerivation({amount: 149}, {});
      expect(result).toEqual("histogramBeforeWithFunctionDerivation.returnValue");
      verify(mockedStatsD.histogram('before.derive', 149, anything())).once();
    });

    it('should default to 1 when derivative function throws', () => {
      const test = new HistogramTests();
      const result = test.histogramBeforeWithFunctionDerivationThrows({amount: 149}, {});
      expect(result).toEqual("histogramBeforeWithFunctionDerivationThrows.returnValue");
      verify(mockedStatsD.histogram('before.derive.throws', 1, anything())).once();
    });
  });

  describe('HistogramAfterWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterAllDefaults();
      expect(result).toEqual("histogramAfterAllDefaults.returnValue");
      verify(mockedStatsD.histogram('HistogramTests#histogramAfterAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterDefaultValue();
      expect(result).toEqual("histogramAfterDefaultValue.returnValue");
      verify(mockedStatsD.histogram('after.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTests();
      const result = test.histogramAfter();
      expect(result).toEqual("histogramAfter.returnValue");
      verify(mockedStatsD.histogram('after', 23, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterWithTags();
      expect(result).toEqual("histogramAfterWithTags.returnValue");
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

    it('should report derived tags', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterWithDerivedTags('arg-tag');
      expect(result).toEqual("histogramAfterWithDerivedTags.returnValue");
      verify(
          mockedStatsD.histogram(
              'after.with.derived.tags',
              40,
              objectContaining({
                'arg': 'arg-tag',
                'returnValue': 'histogramAfterWithDerivedTags.returnValue',
                'constTag': 'const-tag'
              }),
          ),
      ).once();
    });

    it('should inspect arguments', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterWithArgs({a: {deeply: {nested: {property: [0, 1, 2, 3, 87]}}}});
      expect(result).toEqual("histogramAfterWithArgs.returnValue");
      verify(mockedStatsD.histogram('after.with.args', 87, anything())).once();
    });

    it('should derive value from functions', () => {
      const test = new HistogramTests();
      const result = test.histogramAfterWithFunctionDerivation({amount: 149}, {});
      expect(result).toEqual("histogramAfterWithFunctionDerivation.returnValue");
      verify(mockedStatsD.histogram('after.derive', 149, anything())).once();
    });
  });

  describe('HistogramOnErrorWrapper', () => {
    it('should increment by 1 and use stats name as Class#methodName by default', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorAllDefaults()).toThrow();
      verify(mockedStatsD.histogram('HistogramTests#histogramOnErrorAllDefaults', 1, objectContaining({}))).once();
    });

    it('should increment 1 by default', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorDefaultValue()).toThrow();
      verify(mockedStatsD.histogram('onerror.default.value', 1, anything())).once();
    });

    it('should increment on method call', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnError()).toThrow();
      verify(mockedStatsD.histogram('onerror', 26, anything())).once();
    });

    it('should report tags', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorWithTags()).toThrow();
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

    it('should report with derived tags', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorWithDerivedTags("arg-tag")).toThrow();
      verify(
          mockedStatsD.histogram(
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
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorWithArgs({a: {deeply: {nested: {property: [0, 1, 2, 3, 87]}}}})).toThrow();
      verify(mockedStatsD.histogram('onerror.with.args', 87, anything())).once();
    });

    it('should not increment on no error', () => {
      const test = new HistogramTests();
      test.histogramOnNoError();
      verify(mockedStatsD.histogram('onerror', 87, anything())).times(0);
    });

    it('should derive value from functions', () => {
      const test = new HistogramTests();
      expect(() => test.histogramOnErrorWithFunctionDerivation({amount: 149}, {})).toThrow();
      verify(mockedStatsD.histogram('onerror.derive', 149, anything())).once();
    });
  });

  describe('HistogramAroundWrapper', () => {
    describe('success', () => {
      it('should increment before and after successful method call with suffixes', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccess();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());
        const failure = mockedStatsD.histogram('around.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccessAllDefaults();

        const attempted = mockedStatsD.histogram(
            'HistogramTests#histogramAroundSuccessAllDefaults.attempted',
            1,
            objectContaining({}),
        );
        const success = mockedStatsD.histogram(
            'HistogramTests#histogramAroundSuccessAllDefaults.success',
            1,
            objectContaining({}),
        );
        const failure = mockedStatsD.histogram('HistogramTests#histogramAroundSuccessAllDefaults.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment 1 be default', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccessDefaultValue();

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.success', 1, anything());
        const failure = mockedStatsD.histogram('around.default.value.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should increment on method call', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccess();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const success = mockedStatsD.histogram('around.success', 87, anything());
        const failure = mockedStatsD.histogram('around.failure', anything(), anything());

        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should report tags', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccessWithTags();

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

        const failure = mockedStatsD.histogram(
            'around.with.tags.failure',
            anything(),
            anything()
        );

        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should inspect arguments', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccessWithArgs({a: {deeply: {nested: {property: 91}}}});

        const attempted = mockedStatsD.histogram('around.with.args.attempted', 91, anything());
        const success = mockedStatsD.histogram('around.with.args.success', 91, anything());
        const failure = mockedStatsD.histogram('around.with.args.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });

      it('should derive value from function', () => {
        const test = new HistogramTests();
        test.histogramAroundSuccessWithFunctionDerivation({amount: 149}, {});
        const attempted = mockedStatsD.histogram('around.derive.attempted', 149, anything());
        const success = mockedStatsD.histogram('around.derive.success', 149, anything());
        const failure = mockedStatsD.histogram('around.derive.failure', anything(), anything());
        verify(attempted).once();
        verify(success).once();
        verify(failure).never();
        verify(attempted).calledBefore(success);
      });
    });

    describe('failure', () => {
      it('should increment before and after method call with suffixes', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailure()).toThrow();
        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const failure = mockedStatsD.histogram('around.failure', 87, anything());
        const success = mockedStatsD.histogram('around.success', anything(), anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment by 1 and use stats name as Class#methodName by default', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailureAllDefaults()).toThrow();

        const attempted = mockedStatsD.histogram(
            'HistogramTests#histogramAroundFailureAllDefaults.attempted',
            1,
            objectContaining({}),
        );
        const failure = mockedStatsD.histogram(
            'HistogramTests#histogramAroundFailureAllDefaults.failure',
            1,
            objectContaining({}),
        );
        const success = mockedStatsD.histogram(
            'HistogramTests#histogramAroundFailureAllDefaults.success',
            anything(),
            anything(),
        );
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment 1 be default', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailureDefaultValue()).toThrow();

        const attempted = mockedStatsD.histogram('around.default.value.attempted', 1, anything());
        const success = mockedStatsD.histogram('around.default.value.success', anything(), anything());
        const failure = mockedStatsD.histogram('around.default.value.failure', 1, anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should increment on method call', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailure()).toThrow();

        const attempted = mockedStatsD.histogram('around.attempted', 87, anything());
        const failure = mockedStatsD.histogram('around.failure', 87, anything());
        const success = mockedStatsD.histogram('around.success', anything(), anything());

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should report tags', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailureWithTags()).toThrow();

        const attempted = mockedStatsD.histogram(
            'around.with.tags.attempted',
            40,
            objectContaining({
              type: 'Payout',
              gateway: 'Stripe',
            }),
        );

        const failure = mockedStatsD.histogram(
            'around.with.tags.failure',
            40,
            objectContaining({
              type: 'Payout',
              gateway: 'Stripe',
            }),
        );
        const success = mockedStatsD.histogram(
            'around.with.tags.success',
            anything(),
            anything(),
        );

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should inspect arguments', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailureWithArgs({a: {deeply: {nested: {property: 91}}}})).toThrow();

        const attempted = mockedStatsD.histogram('around.with.args.attempted', 91, anything());
        const failure = mockedStatsD.histogram('around.with.args.failure', 91, anything());
        const success = mockedStatsD.histogram('around.with.args.success', anything(), anything());

        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });

      it('should derive value from functions', () => {
        const test = new HistogramTests();
        expect(() => test.histogramAroundFailureWithFunctionDerivation({amount: 149}, {})).toThrow();

        const attempted = mockedStatsD.histogram('around.derive.attempted', 149, anything());
        const failure = mockedStatsD.histogram('around.derive.failure', 149, anything());
        const success = mockedStatsD.histogram('around.derive.success', 149, anything());
        verify(success).never();
        verify(attempted).once();
        verify(failure).once();
        verify(attempted).calledBefore(failure);
      });
    });
  });
});
