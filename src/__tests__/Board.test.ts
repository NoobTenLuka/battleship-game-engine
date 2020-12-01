import { Board } from "../index";

test("Count ships on board", () => {
  let trueCount:number = 0, falseCount:number = 0;
  new Board(5, 5).map.forEach((array) => {
    array.forEach((value) => {
      value === true ? trueCount++ : falseCount++;
    })
  })

  expect(trueCount).toBe(9);
  expect(falseCount).toBe(16);
})