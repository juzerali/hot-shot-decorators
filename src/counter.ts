import { StatsD } from 'hot-shots';
import { getMetricName, resolveValue } from './util';

export type ValueDerivation = number | string | Function;

/**
 * For Usage see counter.spec.ts
 *
 * @param client
 * @constructor
 */
export const IncrementBeforeWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value, args);
        client.increment(metric, actualValue, tags);
        return original.apply(this, args);
      };
      return descriptor;
    };
  };
};

export const IncrementAfterWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const returnValue = original.apply(this, args);
        const actualValue = resolveValue(value, [...args, returnValue]);
        client.increment(metric, actualValue, tags);
        return returnValue;
      };
      return descriptor;
    };
  };
};

export const IncrementOnErrorWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        try {
          return original.apply(this, args);
        } catch (error) {
          const actualValue = resolveValue(value, args);
          client.increment(metric, actualValue, tags);
          throw error;
        }
      };
      return descriptor;
    };
  };
};

export const IncrementAroundWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tags = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      const attempted = metric + '.attempted';
      const success = metric + '.success';
      const failure = metric + '.failure';
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value, args);
        try {
          client.increment(attempted, actualValue, tags);
          const returnValue = original.apply(this, args);
          client.increment(success, actualValue, tags);
          return returnValue;
        } catch (error) {
          client.increment(failure, actualValue, tags);
          throw error;
        }
      };
      return descriptor;
    };
  };
};
