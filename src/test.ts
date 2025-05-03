const target = {
  one: (ar1: string) => "one is " + ar1,
  two: 2,
};

const handler1 = {
  get(target: any, prop: any, receiver: any) {
    console.log(target, prop, receiver);
    return "world";
  },
};

const proxy1 = new Proxy(target, handler1);
console.log(proxy1.one("fdsfhjk"));
