import { resolvePath } from 'path-value';

export function getMetricName(name: string, target: any, descriptor: PropertyDescriptor) {
  return name.length !== 0 ? name : target.constructor.name + '#' + descriptor.value.name;
}

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
