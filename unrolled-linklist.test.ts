import { UnrolledLinkedlist } from "./unrolled-linkedlist";

const getRandom = (low: number, high: number) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

test("Can't create list with zero blocks", () => {
  expect(() => new UnrolledLinkedlist<number>(0)).toThrow();
});

describe("Push elements", () => {
  test("Push first element", () => {
    const list = new UnrolledLinkedlist<number>(1);
    expect(list.getSize()).toBe(0);
    list.push(1);
    expect(list.getSize()).toBe(1);
    expect(list.get(0)).toBe(1);
    expect(() => list.get(1)).toThrow();
  });

  test("Push more elements", () => {
    const list = new UnrolledLinkedlist<number>(2);
    list.push(1);
    list.push(2);
    expect(list.get(0)).toBe(1);
    list.push(3);
    list.push(4);
    expect(list.getSize()).toBe(4);
    for (let i = 0; i < 4; i++) {
      expect(list.get(i)).toBe(i + 1);
    }
  });

  test("Push more elements to new block", () => {
    const list = new UnrolledLinkedlist<number>(1);
    list.push(1);
    expect(list.get(0)).toBe(1);
    list.push(2);
    expect(list.get(1)).toBe(2);
    list.push(3);
    list.push(4);
    expect(list.getSize()).toBe(4);
    list.push(5);
    for (let i = 0; i < 4; i++) {
      expect(list.get(i)).toBe(i + 1);
    }
    expect(list.getSize()).toBe(5);
  });

  test("Push more elements to check increase in block count", () => {
    const list = new UnrolledLinkedlist<number>(10);
    for (let i = 0; i < 100; i++) {
      list.push(i);
    }
    expect(list.getSize()).toBe(100);

    for (let i = 0; i < 100; i++) {
      expect(list.get(i)).toBe(i);
    }

    list.push(100);
    expect(list.getSize()).toBe(101);
    expect(list.get(100)).toBe(100);

    for (let i = 101; i < 200; i++) {
      list.push(i);
      expect(list.getSize()).toBe(i + 1);
    }

    for (let i = 0; i < 200; i++) {
      expect(list.get(i)).toBe(i);
    }
    expect(list.getSize()).toBe(200);
  });

  test("Push 5k elements", () => {
    const list = new UnrolledLinkedlist<number>(10);
    for (let i = 0; i < 5000; i++) {
      expect(() => list.push(i)).not.toThrow();
    }
    expect(list.getSize()).toBe(5000);
    for (let i = 0; i < 5000; i++) {
      expect(list.get(i)).toBe(i);
    }
  });
});

describe("Delete elements", () => {
  test("Delete one element from one block list", () => {
    const list = new UnrolledLinkedlist(1);
    expect(() => list.push(1)).not.toThrow();
    expect(() => list.delete(1)).toThrow();
    expect(() => list.delete(0)).not.toThrow();
    expect(list.getSize()).toBe(0);
    expect(() => list.delete(0)).toThrow();
  });

  test("Delete all element from 0th", () => {
    const list = new UnrolledLinkedlist(5);
    for (let i = 0; i < 25; i++) {
      list.push(i);
    }
    for (let i = 0; i < 25; i++) {
      list.delete(0);
    }
    expect(list.getSize()).toBe(0);
  });

  test("Delete all element from 1st", () => {
    const list = new UnrolledLinkedlist(5);
    for (let i = 0; i < 25; i++) {
      list.push(i);
    }
    for (let i = 0; i < 24; i++) {
      list.delete(1);
    }
    expect(list.getSize()).toBe(1);
  });

  test("Delete all element from last", () => {
    const list = new UnrolledLinkedlist(5);
    for (let i = 0; i < 25; i++) {
      list.push(i);
    }
    while (list.getSize()) {
      list.delete(list.getSize() - 1);
    }
    expect(list.getSize()).toBe(0);
  });

  test("Delete all element randomly", () => {
    const c = 20;
    const list = new UnrolledLinkedlist(c);
    for (let i = 0; i < c * c; i++) {
      list.push(i);
    }
    let count = 0;
    while (list.getSize()) {
      count++;
      const index = getRandom(0, list.getSize() - 1);
      list.delete(index);
      expect(list.getSize()).toBe(c * c - count);
    }
  });

  test("Delete last element of each block", () => {
    const list = new UnrolledLinkedlist(8);
    for (let i = 0; i < 64; i++) {
      list.push(i);
    }

    for (let i = 7; i < 56; i = i + 8) {
      list.delete(i);
    }
    expect(list.getSize()).toBe(64 - 7);
    expect(() => list.delete(57)).toThrow();
    expect(list.get(56)).toBe(63);
    list.delete(56);

    expect(list.getSize()).toBe(64 - 8);
  });
});

describe("Insert elements", () => {
  test("Insert First element", () => {
    const list = new UnrolledLinkedlist(1);
    list.insert(0, 0);
    expect(list.getSize()).toBe(1);
    expect(list.get(0)).toBe(0);
  });

  test("Insert Elements at 0 index always", () => {
    let list = new UnrolledLinkedlist(1);
    for (let i = 0; i < 2000; i++) list.insert(0, i);

    for (let i = 0; i < 2000; i++) {
      expect(list.get(i)).toBe(1999 - i);
    }
    expect(list.getSize()).toBe(2000);
    expect(list.get(0)).toBe(1999);

    list = new UnrolledLinkedlist(10);
    for (let i = 0; i < 2000; i++) list.insert(0, i);

    for (let i = 0; i < 2000; i++) {
      expect(list.get(i)).toBe(1999 - i);
    }
    expect(list.getSize()).toBe(2000);
    expect(list.get(0)).toBe(1999);
  });

  test("Insert elements contiguously at the end", () => {
    let list = new UnrolledLinkedlist(1);
    for (let i = 0; i < 200; i++) {
      list.insert(i, i);
    }
    expect(list.getSize()).toBe(200);
    for (let i = 0; i < 200; i++) {
      expect(list.get(i)).toBe(i);
    }
  });

  test("Insert elements randomly", () => {
    let list = new UnrolledLinkedlist<number>(1);
    while (list.getSize() < 40) {
      list.insert(getRandom(0, list.getSize()), 2);
    }
    expect(list.getSize()).toBe(40);

    list = new UnrolledLinkedlist(10);
    while (list.getSize() < 4000) {
      list.insert(getRandom(0, list.getSize()), 2);
    }
    expect(list.getSize()).toBe(4000);

    list = new UnrolledLinkedlist(2);
    for (let i = 0; i < 20; i++) {
      list.push(i);
    }
    for (let i = 0; i < 2000; i++) {
      list.insert(getRandom(0, list.getSize()), i);
    }
    const itemsFromlist: number[] = [];
    list.loopOver((a) => {
      itemsFromlist.push(a);
    });

    for (let i = 0; i < 2000; i++) {
      expect(itemsFromlist.includes(i)).toBe(true);
    }

    expect(list.getSize()).toBe(2020);
  });
});

describe("Loopover correct data", () => {
  test("loopOver to correct data", () => {
    const data: number[] = [];
    const list = new UnrolledLinkedlist(1);
    while (data.length < 2000) {
      const rand = getRandom(0, 2000);
      list.push(rand);
      data.push(rand);
    }

    list.loopOver((item, index) => {
      expect(data[index]).toBe(item);
    });
  });

  test("loopOver to correct data after delete, insert, push", () => {
    const list = new UnrolledLinkedlist(5);
    for (let i = 0; i < 25; i++) {
      list.push(i);
    }

    list.delete(20);
    list.delete(12);
    list.insert(getRandom(0, 25), 90);
    list.insert(getRandom(0, 25), 91);

    expect(list.getSize()).toBe(25);

    list.loopOver((item) => {
      expect(item).not.toBe(20);
      expect(item).not.toBe(12);
    });
  });
});

describe("Constructor with array", () => {
  test("Constructor with more elements than size", () => {
    const arr = new Array(10).fill(0);
    expect(() => new UnrolledLinkedlist(2, arr)).toThrow();
  });

  test("Constructor with less elements than size", () => {
    const arr = new Array(10).fill(0);
    expect(() => new UnrolledLinkedlist(4, arr)).not.toThrow();
  });

  test("Constructor with array elements", () => {
    const arr = new Array(10).fill(0);

    for (let i = 0; i < 2000; i++) {
      arr[i] = i;
    }
    const list = new UnrolledLinkedlist(45, arr);
    expect(list.getSize()).toBe(2000);
    list.loopOver((item, index) => {
      expect(arr[index]).toBe(item);
    });
  });
});

describe("Replace data", () => {
  const list = new UnrolledLinkedlist(5);
  for (let i = 0; i < 25; i++) {
    list.push(i);
  }

  for (let i = 0; i < 25; i++) {
    list.replace(i, 25 - i);
  }

  for (let i = 0; i < 25; i++) {
    expect(list.get(i)).toBe(25 - i);
  }
});
