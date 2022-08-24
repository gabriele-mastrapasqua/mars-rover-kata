import { clone, mod } from "./utils";

describe("utils functions", () => {
  it("should calculate module of a number", () => {
    expect(mod(4, 4)).toBe(0);
    expect(mod(1, 4)).toBe(1);
    expect(mod(5, 4)).toBe(1);
  });
  it("should clone an object", () => {
    expect(clone({a: 1, b: 2})).toEqual({a: 1, b: 2});
  });
});
