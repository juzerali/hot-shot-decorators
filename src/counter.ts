import {StatsD} from 'hot-shots';
import {getMetricName} from "./util";

/**
 * For Usage see counter.spec.ts
 *
 * @param client
 * @constructor
 */
export const IncrementBeforeWrapper = (client: StatsD) => {
    return (name = "", value = 1, tags = {}): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
            const original = descriptor.value;
            const metric =  getMetricName(name, target, descriptor);
            descriptor.value = (...args: any) => {
                client.increment(metric, value, tags);
                original.apply(this, args);
            }
            return descriptor;
        }
    }

}

export const IncrementAfterWrapper = (client: StatsD) => {
    return  (name = "", value = 1, tags = {}): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
            const original = descriptor.value;
            const metric =  getMetricName(name, target, descriptor);
            descriptor.value = (...args: any) => {
                original.apply(this, args);
                client.increment(metric, value, tags);
            }
            return descriptor;
        }
    }
}

export const IncrementOnErrorWrapper = (client: StatsD) => {
    return (name = "", value = 1, tags = {}): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
            const original = descriptor.value;
            const metric =  getMetricName(name, target, descriptor);
            descriptor.value = (...args: any) => {
                try {
                    original.apply(this, args);
                } catch (error) {
                    client.increment(metric, value, tags);
                }
            }
            return descriptor;
        }
    }
}

export const IncrementAroundWrapper = (client: StatsD) => {
    return (name: string, value = 1, tags = {}): MethodDecorator => {

        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
            const original = descriptor.value;
            const metric =  getMetricName(name, target, descriptor);
            const attempted = metric + ".attempted";
            const success = metric + ".success";
            const failure = metric + ".failure";
            descriptor.value = (...args: any) => {
                try {
                    client.increment(attempted, value, tags);
                    original.apply(this, args);
                    client.increment(success, value, tags);
                } catch (error) {
                    client.increment(failure, value, tags);
                }
            }
            return descriptor;
        }
    }
}
