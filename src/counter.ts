import { StatsD } from 'hot-shots';
import { getMetricName, resolveValue } from './util';

/**
 * For Usage see counter.spec.ts
 *
 * @param client
 * @constructor
 */
export const IncrementBeforeWrapper = (client: StatsD) => {
  return (name = '', value?: number | string | Function, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value, args);
        client.increment(metric, actualValue, tags);
        original.apply(this, args);
      };
      return descriptor;
    };
  };
};

export const IncrementAfterWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        original.apply(this, args);
        const actualValue = resolveValue({value: value, args: args});
        client.increment(metric, actualValue, tags);
      };
      return descriptor;
    };
  };
};

export const IncrementOnErrorWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        try {
          original.apply(this, args);
        } catch (error) {
          const actualValue = resolveValue({value: value, args: args});
          client.increment(metric, actualValue, tags);
        }
      };
      return descriptor;
    };
  };
};

export const IncrementAroundWrapper = (client: StatsD) => {
  return (name = '', value?: number | string, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      const attempted = metric + '.attempted';
      const success = metric + '.success';
      const failure = metric + '.failure';
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue({value: value, args: args});
        try {
          client.increment(attempted, actualValue, tags);
          original.apply(this, args);
          client.increment(success, actualValue, tags);
        } catch (error) {
          client.increment(failure, actualValue, tags);
        }
      };
      return descriptor;
    };
  };
};
