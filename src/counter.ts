import {StatsD, Tags} from 'hot-shots';
import {getMetricName, resolveTags, resolveValue, TagDerivation, ValueDerivation} from './util';

/**
 * For Usage see counter.spec.ts
 *
 * @param client
 * @constructor
 */
export const IncrementBeforeWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const actualValue = resolveValue(value, args);
        const tags = resolveTags(tagsDerivation, args);
        client.increment(metric, actualValue, tags);
        return original.apply(this, args);
      };
      return descriptor;
    };
  };
};

export const IncrementAfterWrapper = (client: StatsD) => {
  return (name = '', value?: ValueDerivation, tagsDerivation:TagDerivation = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const original = descriptor.value;
      const metric = getMetricName(name, target, descriptor);
      descriptor.value = (...args: any) => {
        const returnValue = original.apply(this, args);

        const actualValue = resolveValue(value, [...args, returnValue]);
        const tags = resolveTags(tagsDerivation, [...args, returnValue]);
        client.increment(metric, actualValue, tags);

        return returnValue;
      };
      return descriptor;
    };
  };
};

export const IncrementOnErrorWrapper = (client: StatsD) => {
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
          client.increment(metric, actualValue, tags);

          throw error;
        }
      };
      return descriptor;
    };
  };
};

export const IncrementAroundWrapper = (client: StatsD) => {
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
          client.increment(attempted, actualValueBefore, tags);
          const returnValue = original.apply(this, args);

          tags = resolveTags(tagsDerivation, [...args, returnValue]);
          const actualValueAfter = resolveValue(value, [...args, returnValue]);
          client.increment(success, actualValueAfter, tags);

          return returnValue;
        } catch (error) {
          const actualValueOnError = resolveValue(value, [...args, error]);
          const tags = resolveTags(tagsDerivation, [...args, error]);
          client.increment(failure, actualValueOnError, tags);

          throw error;
        }
      };
      return descriptor;
    };
  };
};
