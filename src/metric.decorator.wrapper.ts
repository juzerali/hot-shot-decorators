import {StatsCb, StatsD, Tags} from 'hot-shots';
import {getMetricName, resolveTags, resolveValue, TagDerivation, ValueDerivation} from './util';

type StatsdArgs = [stat: string | string[], value: number, sampleRate?: number | undefined, callback?: StatsCb | undefined];
export class MetricDecoratorWrapper {

    constructor(private statsd = new StatsD({
        host: 'localhost',
        port: 8125,
        globalTags: {
            env: 'development'
        }
    })) {
    }

    public incBefore() {
        return this.reportBefore((...args: StatsdArgs) => this.statsd.increment.apply(this.statsd, args));
    }

    public incAfter() {
        return this.reportAfter((...args: StatsdArgs) => this.statsd.increment.apply(this.statsd, args));
    }

    public incOnError() {
        return this.reportOnError((...args: StatsdArgs) => this.statsd.increment.apply(this.statsd, args));
    }

    public incAround() {
        return this.reportAround((...args: StatsdArgs) => this.statsd.increment.apply(this.statsd, args));
    }

    public histogramBefore() {
        return this.reportBefore((...args: StatsdArgs) => this.statsd.histogram.apply(this.statsd, args));
    }

    public histogramAfter() {
        return this.reportAfter((...args: StatsdArgs) => this.statsd.histogram.apply(this.statsd, args));
    }

    public histogramOnError() {
        return this.reportOnError((...args: StatsdArgs) => this.statsd.histogram.apply(this.statsd, args));
    }

    public histogramAround() {
        return this.reportAround((...args: StatsdArgs) => this.statsd.histogram.apply(this.statsd, args));
    }

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
