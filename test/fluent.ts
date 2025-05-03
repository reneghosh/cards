interface Does {
  doit: () => {};
}
const does: Does = {
  doit: () => console.log("done"),
};
function makeFluent<Type>(source: Type): Type {
  const fluent = {};
  for (let key in source) {
    if (source[key]) {
      const keyFunction = source[key];
      if (keyFunction && keyFunction instanceof Function) {
        Object.assign(fluent, {
          [key]: () => {
            keyFunction();
            return fluent;
          },
        });
      }
    }
  }
  return fluent as Type;
}
const fluent = makeFluent<Does>(does);
fluent.doit().doit();
