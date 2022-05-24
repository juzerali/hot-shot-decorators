import { StatsCb, StatsD, Tags } from 'hot-shots';
import { getMetricName, resolveTags, resolveValue, TagDerivation, ValueDerivation } from './util';

type StatsdArgs = [
  stat: string | string[],
  value: number,
  sampleRate?: number | undefined,
  callback?: StatsCb | undefined,
];

/**
 * This class takes StatsD client as input and generates metric decorators
 */
export class MetricDecoratorGenerator {
  constructor(
    private statsd = new StatsD({
      host: 'localhost',
      port: 8125,
      globalTags: {
        env: 'development',
      },
    }),
  ) {}

  /**
   * Generates @IncrementBefore decorator that increments before method execution
   */
  public incBefore() {
    return this.reportBefore(this.statsd.increment);
  }

  /**
   * Generates @IncrementAfter decorator that increments after successful method execution
   */
  public incAfter() {
    return this.reportAfter(this.statsd.increment);
  }

  /**
   * Generates @IncrementOnError decorator that increments when method execution throws error
   */
  public incOnError() {
    return this.reportOnError(this.statsd.increment);
  }

  /**
   * Generates @IncrementAround decorator that increments before, after, or when method execution throws error with
   * `attempted`, `successful`, and `failed` suffixes respectively.
   */
  public incAround() {
    return this.reportAround(this.statsd.increment, this.statsd.increment, this.statsd.increment);
  }

  /**
   * Generates @HistogramBefore decorator that reports histogram before method execution
   */
  public histogramBefore() {
    return this.reportBefore(this.statsd.histogram);
  }

  /**
   * Generates @HistogramAfter decorator that reports histogram after successful method execution
   */
  public histogramAfter() {
    return this.reportAfter(this.statsd.histogram);
  }

  /**
   * Generates @HistogramOnError decorator that reports histogram when method execution throws error
   */
  public histogramOnError() {
    return this.reportOnError(this.statsd.histogram);
  }

  /**
   * Generates @HistogramAround decorator that reports histogram before, after, or when method execution throws error
   * with `attempted`, `successful`, and `failed` suffixes respectively.
   */
  public histogramAround() {
    return this.reportAround(this.statsd.histogram, this.statsd.histogram, this.statsd.histogram);
  }

  /**
   * Abstraction that wraps metric call before method execution
   *
   * @param report This function will be called before method execution with StatsdArgs
   * @private
   */
  private reportBefore(report: Function) {
    return this.reportAround(report, undefined, undefined, '', '', '');
  }

  /**
   * Abstraction that wraps metric call after method execution
   *
   * @param report This function will be called after method execution with StatsdArgs
   * @private
   */
  private reportAfter(report: Function) {
    return this.reportAround(undefined, report, undefined, '', '', '');
  }

  /**
   * Abstraction that wraps metric call when method execution throws error
   *
   * @param report This function will be called when method execution throws error with StatsdArgs
   * @private
   */
  private reportOnError(report: Function) {
    return this.reportAround(undefined, undefined, report, '', '', '');
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
  private reportAround(
    before: Function | undefined,
    after: Function | undefined,
    onError: Function | undefined,
    beforeSuffix = '.attempted',
    afterSuffix = '.success',
    errorSuffix = '.failure',
  ) {
    return (name = '', value?: ValueDerivation, tagsDerivation: TagDerivation = {}): MethodDecorator => {
      return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;

        // Resolve metric name
        const metric = getMetricName(name, target, descriptor);

        const attempted = metric + beforeSuffix;
        const success = metric + afterSuffix;
        const failure = metric + errorSuffix;

        // Wrap original method call in around decorator be reassigning descriptor value
        descriptor.value = (...args: any) => {
          try {
            // Process before decorator
            this.runAdvice(before, value, args, tagsDerivation, attempted);

            /**
             *  👇Original method on which this decorator applies is called here👇
             */
            const returnValue = original.apply(this, args);

            // Process after decorator
            this.runAdvice(after, value, [...args, returnValue], tagsDerivation, success);

            // Return value returned by original method (⚠️ Don't forget this, it could break target application behaviour)
            return returnValue;
          } catch (error) {
            // Process onError decorator
            this.runAdvice(onError, value, [...args, error], tagsDerivation, failure);

            // Rethrow error thrown by original method (⚠️ Don't forget this, it could break target application behaviour))
            throw error;
          }
        };
        return descriptor;
      };
    };
  }

  private runAdvice(
    func: Function | undefined,
    value: number | string | ((...args: any[]) => number) | undefined,
    args: any,
    tagsDerivation: { [p: string]: string } | string[] | ((...args: any[]) => Tags) | undefined,
    metric: string,
  ) {
    if (func) {
      const actualValue = resolveValue(value, args);
      const tags = resolveTags(tagsDerivation, args);
      func.call(this.statsd, metric, actualValue, tags);
    }
  }
}
