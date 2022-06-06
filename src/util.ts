import { Tags } from "hot-shots";
import { resolvePath } from "path-value";

export type TagDerivation = Tags | TagDerivationFunc | undefined;
export type ValueDerivation = number | string | ValueDerivationFunc | undefined;
type ValueDerivationFunc = (...args: unknown[]) => number;
type TagDerivationFunc = (...args: unknown[]) => Tags;

/**
 * Helper function that determines metric name. If empty or undefined metric name is passed, ClassName#methodName will
 * be used as default metric name
 *
 * @param name
 * @param target
 * @param descriptor
 */
export function getMetricName(
  name: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  descriptor: PropertyDescriptor
) {
  return name && name.length !== 0
    ? name
    : target.constructor.name + "." + descriptor.value.name;
}

function numericValueResolver(
  actualValue: number,
  value: ValueDerivation
): number {
  if (value === undefined) return actualValue;
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    if (!Number.isNaN(value)) {
      return Number(value);
    } else {
      return actualValue;
    }
  } else if (typeof value === "function") {
    return value(actualValue);
  }
  return actualValue;
}

function functionValueResolver(
  value: ValueDerivationFunc,
  args: unknown[],
  actualValue: number
) {
  {
    const result = value(...args);
    if (Number.isFinite(result)) {
      actualValue = result;
    } else {
      console.error(
        "Given function " +
          value +
          " derived value " +
          result +
          " is not a number. Defaulting to 1."
      );
    }
  }
  return actualValue;
}

function pathValueResolver(
  args: unknown[],
  value: string,
  actualValue: number
) {
  {
    const resolved = resolvePath(args, value);
    if (!resolved.exists) {
      console.error(
        "Given path for increment value " +
          value +
          " does not exist. Defaulting to 1"
      );
    } else if (!Number.isFinite(resolved.value)) {
      console.error(
        "Given path for increment value " +
          value +
          " is not a number. Defaulting to 1"
      );
    } else {
      actualValue = resolved.value;
    }
  }
  return actualValue;
}

/**
 * Metric value resolver.
 * * If the passed value is of type Number, it will be reported as is.
 * * If the passed value is a string, it will be resolved from arguments using path-value semantics https://github.com/vitaly-t/path-value#features
 * * If the passed value is a function, it will called and returned value will be use as value
 *
 * If any of the resolved values is not a number, value will default to 1.
 * @param value 25 | "0.deeply.nested.path"
 * @param args
 */
export function resolveValue(value: ValueDerivation, args: unknown[]) {
  let actualValue = 1;

  try {
    if (value === undefined) actualValue = 1;
    else if (Number.isFinite(value))
      actualValue = numericValueResolver(actualValue, value);
    else if (typeof value === "function")
      actualValue = functionValueResolver(value, args, actualValue);
    else if (typeof value === "string")
      actualValue = pathValueResolver(args, value, actualValue);
  } catch (e) {
    console.error("Failed to derive metric value! " + value, e);
  }

  return actualValue;
}

function functionTagResolver(
  tags: TagDerivationFunc,
  ...args: unknown[]
): Tags {
  return tags(...args);
}

/**
 * Tag resolver. Resolves tags
 * @param tags
 * @param args
 */

export function resolveTags(tags: TagDerivation, args: unknown[]): Tags {
  try {
    if (tags === undefined) return {};
    else if (typeof tags === "function")
      return functionTagResolver(tags, ...args);
    return tags;
  } catch (e) {
    console.error("Failed to derive tags! " + tags, e);
    return {};
  }
}
