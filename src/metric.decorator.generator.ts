/* eslint-disable @typescript-eslint/ban-types */
import { StatsD } from "hot-shots";

import {
  getMetricName,
  resolveTags,
  resolveValue,
  TagDerivation,
  ValueDerivation,
} from "./util";

/**
 * This class takes StatsD client as input and generates metric decorators
 */
export class MetricDecoratorGenerator {
  constructor(
    private statsd = new StatsD({
      host: "localhost",
      port: 8125,
      globalTags: {
        env: "development",
      },
    })
  ) {}

  /**
   * Generates a decorator that executes advice before method execution
   * @param advice - advice to run
   */
  public before(advice: Function) {
    return this.beforeDecorator(advice);
  }

  /**
   * Generates a decorator that executes advice after method execution
   * @param advice - advice to run
   */
  public after(advice: Function) {
    return this.afterDecorator(advice);
  }

  /**
   * Generates a decorator that executes advice when method execution throws
   * @param advice - advice to run
   */
  public onError(advice: Function) {
    return this.onErrorDecorator(advice);
  }

  /**
   * Generates a decorator that executes advice before method execution
   * @param advice - advice to run
   */
  public around(
    beforeAdvice: Function,
    afterAdvice: Function,
    onErrorAdvice: Function
  ) {
    return this.aroundDecorator(beforeAdvice, afterAdvice, onErrorAdvice);
  }

  /**
   * Generates @IncrementBefore decorator that increments before method execution
   */
  public incBefore() {
    return this.before(this.statsd.increment);
  }

  /**
   * Generates @IncrementAfter decorator that increments after successful method execution
   */
  public incAfter() {
    return this.after(this.statsd.increment);
  }

  /**
   * Generates @IncrementOnError decorator that increments when method execution throws error
   */
  public incOnError() {
    return this.onError(this.statsd.increment);
  }

  /**
   * Generates @IncrementAround decorator that increments before, after, or when method execution throws error with
   * `attempted`, `successful`, and `failed` suffixes respectively.
   */
  public incAround() {
    return this.around(
      this.statsd.increment,
      this.statsd.increment,
      this.statsd.increment
    );
  }

  /**
   * Generates @HistogramBefore decorator that reports histogram before method execution
   */
  public histogramBefore() {
    return this.before(this.statsd.histogram);
  }

  /**
   * Generates @HistogramAfter decorator that reports histogram after successful method execution
   */
  public histogramAfter() {
    return this.after(this.statsd.histogram);
  }

  /**
   * Generates @HistogramOnError decorator that reports histogram when method execution throws error
   */
  public histogramOnError() {
    return this.onError(this.statsd.histogram);
  }

  /**
   * Generates @HistogramAround decorator that reports histogram before, after, or when method execution throws error
   * with `attempted`, `successful`, and `failed` suffixes respectively.
   */
  public histogramAround() {
    return this.around(
      this.statsd.histogram,
      this.statsd.histogram,
      this.statsd.histogram
    );
  }

  /**
   * Abstraction that wraps metric call before method execution
   *
   * @param report This function will be called before method execution with StatsdArgs
   * @private
   */
  private beforeDecorator(report: Function) {
    return this.aroundDecorator(report, undefined, undefined, "", "", "");
  }

  /**
   * Abstraction that wraps metric call after method execution
   *
   * @param report This function will be called after method execution with StatsdArgs
   * @private
   */
  private afterDecorator(report: Function) {
    return this.aroundDecorator(undefined, report, undefined, "", "", "");
  }

  /**
   * Abstraction that wraps metric call when method execution throws error
   *
   * @param report This function will be called when method execution throws error with StatsdArgs
   * @private
   */
  private onErrorDecorator(report: Function) {
    return this.aroundDecorator(undefined, undefined, report, "", "", "");
  }

  /**
   * Abstraction that wraps metric calls before, after method execution or when method execution throws error
   *
   * @param before this function will be called before target method execution with StatsDArgs
   * @param after function will be called after target method execution with StatsDArgs
   * @param onError function will be called with StatsDArgs when target method execution throws
   * @param beforeSuffix suffix to add to before metric name (default: `.attempted`)
   * @param afterSuffix suffix to add to after metric name (default: `.successful`)
   * @param errorSuffix suffix to add to onError metric name (default: `.failure`)
   * @private
   */
  private aroundDecorator(
    before: Function | undefined,
    after: Function | undefined,
    onError: Function | undefined,
    beforeSuffix = ".attempted",
    afterSuffix = ".success",
    errorSuffix = ".failure"
  ) {
    const generatorClass = { t: this };
    return (
      name = "",
      value?: ValueDerivation,
      tagsDerivation: TagDerivation = {}
    ): MethodDecorator => {
      return (
        target: Object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor
      ): PropertyDescriptor => {
        const original = descriptor.value;

        // Resolve metric name
        const metric = getMetricName(name, target, descriptor);

        const attempted = metric + beforeSuffix;
        const success = metric + afterSuffix;
        const failure = metric + errorSuffix;

        // Wrap original method call in around decorator be reassigning descriptor value
        descriptor.value = function (...args: unknown[]) {
          try {
            // Process before decorator
            generatorClass.t.runAdvice(
              before,
              value,
              args,
              tagsDerivation,
              attempted
            );

            /**
             *  👇Original method on which this decorator applies is called here👇
             */
            const returnValue = original.apply(this, args);

            // Process after decorator
            generatorClass.t.runAdvice(
              after,
              value,
              [...args, returnValue],
              tagsDerivation,
              success
            );

            // Return value returned by original method (⚠️ Don't forget this, it could break target application behavior)
            return returnValue;
          } catch (error) {
            // Process onError decorator
            generatorClass.t.runAdvice(
              onError,
              value,
              [...args, error],
              tagsDerivation,
              failure
            );

            // Rethrow error thrown by original method (⚠️ Don't forget this, it could break target application behavior))
            throw error;
          }
        };
        return descriptor;
      };
    };
  }

  private runAdvice(
    func: Function | undefined,
    value: number | string | ((...args: unknown[]) => number) | undefined,
    args: unknown[],
    tagsDerivation: TagDerivation,
    metric: string
  ) {
    if (func) {
      try {
        const actualValue = resolveValue(value, args);
        const tags = resolveTags(tagsDerivation, args);
        func.call(this.statsd, metric, actualValue, tags);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
