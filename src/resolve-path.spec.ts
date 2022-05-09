import {resolvePath} from "path-value";

describe("resolvePath", () => {
    const x = [{
        a: {
            b: [undefined, {
                c: {
                    d: [{
                        e: "z"
                    }]
                }
            }]
        }
    }];

    it('should resolve path when exists', () => {
        const existingPath = "0.a.b.1.c.d.0.e";
        const result = resolvePath(x, existingPath);
        expect(result.exists).toBeTruthy();
        expect(result.value).toEqual("z");
    });

    it('should resolve path when not exists', () => {
        const nonExistantPath = "0.a.b.1.c.e.0.e";
        const result = resolvePath(x, nonExistantPath);
        expect(result.value).toBeUndefined();

    });
});
