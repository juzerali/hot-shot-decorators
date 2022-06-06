import { resolvePath } from "path-value";

describe("resolvePath", () => {
  const x = [
    {
      a: {
        b: [
          undefined,
          {
            c: {
              d: [
                {
                  e: "z",
                },
              ],
            },
          },
        ],
      },
    },
  ];

  it("should resolve path when exists", () => {
    const existingPath = "0.a.b.1.c.d.0.e";
    const result = resolvePath(x, existingPath);
    expect(result.exists).toBeTruthy();
    expect(result.value).toEqual("z");
  });

  it("should resolve path when not exists", () => {
    const notExistingPath = "0.a.b.1.c.e.0.e";
    const result = resolvePath(x, notExistingPath);
    expect(result.value).toBeUndefined();
  });

  it("should resolve path for nested classes", () => {
    class A {
      constructor(public readonly value = "X") {}
    }
    class B {
      constructor(public readonly a: A) {}
    }
    class C {
      constructor(public readonly b: B) {}
    }

    const c = new C(new B(new A("Z")));
    const path = "b.a.value";
    const result = resolvePath(c, path);
    expect(result.value).toEqual("Z");
  });
});
