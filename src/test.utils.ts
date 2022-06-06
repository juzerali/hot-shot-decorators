import { Tags } from "hot-shots";

export type ReturnValue = { tags: Tags };

export function doNotAddError(...args: unknown[]): Tags {
  const arg = typeof args[0] === "string" ? args[0] : "";
  if (args[1] instanceof Error) {
    return { arg, constTag: "const-tag", error: args[1].message };
  } else if (typeof args[1] === "string") {
    return { arg, constTag: "const-tag", returnValue: args[1] };
  } else {
    return { arg, constTag: "const-tag" };
  }
}

export function returnValueOrError(...args: unknown[]) {
  function isReturnValue(arg: unknown): arg is ReturnValue {
    return typeof arg === "object" && arg !== null && "tags" in arg;
  }

  const arg = typeof args[0] === "string" ? args[0] : "";
  const tags = { arg, constTag: "const-tag" };
  if (!args[1]) return tags;

  if (args[1] instanceof Error) {
    return { ...tags, error: args[1].message };
  } else if (isReturnValue(args[1]) && "returnValue" in args[1].tags) {
    return { ...tags, returnValue: args[1].tags.returnValue };
  } else {
    return tags;
  }
}

export function extractAmount(arg1: unknown, _arg2: unknown): number {
  function hasAmount(arg: unknown): arg is { amount: number } {
    return typeof arg === "object" && arg !== null && "amount" in arg;
  }
  if (hasAmount(arg1)) {
    return arg1.amount;
  }
  return -1;
}
