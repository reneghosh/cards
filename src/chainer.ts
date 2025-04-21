const log = console.log;

interface Makeable {
  make: Function;
}
const chainInterface = () => {
  const verbs: { [key: string]: Function } = {};
  const subVerbs: { [key: string]: Makeable } = {};
  const subBuilders: { [key: string]: any } = {};
  const chainer = {
    register: (name: string, fn: Function) => {
      verbs[name] = (...fnargs: any[]) => {
        if (fn) {
          fn(...fnargs);
        }
        return verbs;
      };
      return chainer;
    },
    subRegister: (name: string, builder: any) => {
      const subInterface = chainInterface();
      subInterface.register(name, () => {});
      subVerbs[name] = subInterface;
      subBuilders[name] = builder;
      return subInterface;
    },
    show: () => log(verbs),
    make: (...args: any[]) => {
      const executableVerbs: { [key: string]: any } = {};
      for (let verb in verbs) {
        executableVerbs[verb] = (...verbArgs: any[]) => {
          verbs[verb](...args, ...verbArgs);
          return executableVerbs;
        };
      }
      for (let verb in subVerbs) {
        executableVerbs[verb] = (...verbArgs: any[]) => {
          return subVerbs[verb].make(
            ...subBuilders[verb](...args),
            ...verbArgs,
          );
        };
      }
      return executableVerbs;
    },
  };
  return chainer;
};
