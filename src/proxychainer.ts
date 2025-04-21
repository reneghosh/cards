const log = console.log;

//check integrity of definitions
const checkDefinitions = (definitions) => {
  for (let collection in definitions) {
    const buildFunction = definitions[collection].build;
    if (buildFunction == undefined || typeof buildFunction != "function") {
      log(
        "Error in definitions: each element in the definitions object must have a build function",
      );
      return;
    }
  }
};

const extractFunctions = (obj) => {
  const functionMap = {};
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value == "function") {
      functionMap[key] = value;
    }
  }
  return functionMap;
};

export const proxyChainer = (
  definitions: { [key: string]: any },
  builderArguments: any[],
) => {
  checkDefinitions(definitions);
  const accessor: { [key: string]: Function } = {};

  for (let collection in definitions) {
    //top-level accessor methods create a proxy accessor per definition
    accessor[collection] = (...otherArgs: any[]) => {
      const collectionNode = definitions[collection].build(
        ...builderArguments,
        ...otherArgs,
      );
      const proxy: { [key: string]: Function } = {};
      for (let method in collectionNode) {
        proxy[method] = (...args: any[]) => {
          const output = collectionNode[method](...args);
          if (output) {
            return extractFunctions(output);
          } else {
            return proxy;
          }
        };
      }
      return proxy;
    };
  }
  return accessor;
};
