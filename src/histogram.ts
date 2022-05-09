import { StatsD } from 'hot-shots';
import { getMetricName, resolveValue } from './util';

/**
 * For Usage see histogram.spec.ts
 *
 * @param client
 * @constructor
 */
export const HistogramBeforeWrapper = (client: StatsD) => {
  return (name = '', value?: number | string | Function, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value,  args);
        client.histogram(metric, actualValue, tags);
        original.apply(this, args);
      };
      return descriptor;
    };
  };
};

export const HistogramAfterWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        original.apply(this, args);
        const actualValue = resolveValue(value,  args);
        client.histogram(metric, actualValue, tags);
      };
      return descriptor;
    };
  };
};

export const HistogramOnErrorWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        try {
          original.apply(this, args);
        } catch (error) {
          const actualValue = resolveValue(value,  args);
          client.histogram(metric, actualValue, tags);
        }
      };
      return descriptor;
    };
  };
};

export const HistogramAroundWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      const attempted = metric + '.attempted';
      const success = metric + '.success';
      const failure = metric + '.failure';
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value,  args);
        try {
          client.histogram(attempted, actualValue, tags);
          original.apply(this, args);
          client.histogram(success, actualValue, tags);
        } catch (error) {
          client.histogram(failure, actualValue, tags);
        }
      };
      return descriptor;
    };
  };
};
