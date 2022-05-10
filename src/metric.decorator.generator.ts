import {StatsCb, StatsD, Tags} from 'hot-shots';
import {getMetricName, resolveTags, resolveValue, TagDerivation, ValueDerivation} from './util';

type StatsdArgs = [stat: string | string[], value: number, sampleRate?: number | undefined, callback?: StatsCb | undefined];

/**
 * This class takes StatsD client as input and generates metric decorators
 */
export class MetricDecoratorGenerator {

    constructor(private statsd = new StatsD({
        host: 'localhost',
        port: 8125,
        globalTags: {
            env: 'development'
        }
    })) {
    }

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
        return this.reportAround(this.statsd.increment);
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
        return this.reportAround(this.statsd.histogram);
    }

    /**
     * Abstraction that wraps metric call before method execution
     *
     * @param report This function will be called before method execution with StatsdArgs
     * @private
     */
    private reportBefore(report: Function) {
        return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
            return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
                const original = descriptor.value;
                const metric = getMetricName(name, target, descriptor);
                descriptor.value = (...args: any) => {
                    const actualValue = resolveValue(value, args);
                    const tags = resolveTags(tagsDerivation, args);
                    report(metric, actualValue, tags);
                    return original.apply(this, args);
                };
                return descriptor;
            };
        };
    };

    /**
     * Abstraction that wraps metric call after method execution
     *
     * @param report This function will be called after method execution with StatsdArgs
     * @private
     */
    private reportAfter(report: Function)  {
        return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
            return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
                const original = descriptor.value;
                const metric = getMetricName(name, target, descriptor);
                descriptor.value = (...args: any) => {
                    const returnValue = original.apply(this, args);

                    const actualValue = resolveValue(value, [...args, returnValue]);
                    const tags = resolveTags(tagsDerivation, [...args, returnValue]);
                    report(metric, actualValue, tags);

                    return returnValue;
                };
                return descriptor;
            };
        };
    };

    /**
     * Abstraction that wraps metric call when method execution throws error
     *
     * @param report This function will be called when method execution throws error with StatsdArgs
     * @private
     */
    private reportOnError(report: Function) {
        return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
            return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
                const original = descriptor.value;
                const metric = getMetricName(name, target, descriptor);
                descriptor.value = (...args: any) => {
                    try {
                        return original.apply(this, args);
                    } catch (error) {
                        const actualValue = resolveValue(value, [...args, error]);
                        const tags = resolveTags(tagsDerivation, [...args, error]);
                        report(metric, actualValue, tags);

                        throw error;
                    }
                };
                return descriptor;
            };
        };
    };

    /**
     * Abstraction that wraps metric calls before, after method execution or when method execution throws error
     *
     * @param report This function will be called before, after method execution or when method execution throws error
     * with value property suffixed with `.attempted`, `.successful`, and `.failed` respectively
     * @private
     */
    private reportAround(report: Function) {
        return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
            return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
                const original = descriptor.value;
                const metric = getMetricName(name, target, descriptor);
                const attempted = metric + '.attempted';
                const success = metric + '.success';
                const failure = metric + '.failure';
                descriptor.value = (...args: any) => {
                    try {
                        const actualValueBefore = resolveValue(value, args);
                        let tags = resolveTags(tagsDerivation, args);
                        report(attempted, actualValueBefore, tags);
                        const returnValue = original.apply(this, args);

                        tags = resolveTags(tagsDerivation, [...args, returnValue]);
                        const actualValueAfter = resolveValue(value, [...args, returnValue]);
                        report(success, actualValueAfter, tags);

                        return returnValue;
                    } catch (error) {
                        const actualValueOnError = resolveValue(value, [...args, error]);
                        const tags = resolveTags(tagsDerivation, [...args, error]);
                        report(failure, actualValueOnError, tags);

                        throw error;
                    }
                };
                return descriptor;
            };
        };
    };
}
