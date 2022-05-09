import { resolvePath } from 'path-value';

/**
 * Helper function that determines metric name. If empty or undefined metric name is passed, Classname#methodName will
 * be used as default metric name
 *
 * @param name
 * @param target
 * @param descriptor
 */
export function getMetricName(name: string, target: any, descriptor: PropertyDescriptor) {
  return (name && name.length !== 0) ? name : target.constructor.name + '#' + descriptor.value.name;
}

/**
 * Metric value resolver.
 * * If the passed value is of type Number, it will be reported as is.
 * * If the passed value is a string, it will be resolved from arguments using path-value semantics https://github.com/vitaly-t/path-value#features
 * @param value 25 | "0.deeply.nested.path"
 * @param args
 */
export function resolveValue(value: number | string | undefined, args: any) {
  let actualValue = 1;
  if (value === undefined) actualValue = 1;
  else if (Number.isFinite(value)) actualValue = value as number;
  else if (typeof value === 'string') {
    const resolved = resolvePath(args, value);
    if (!resolved.exists) {
      console.error('Given path for increment value ' + value + ' does not exist. Defaulting to 1.');
    } else if (!Number.isFinite(resolved.value)) {
      console.error('Given path for increment value ' + value + ' is not a number. Defaulting to 1.');
    } else {
      actualValue = resolved.value;
    }
  }
  return actualValue;
}
