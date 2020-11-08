"uses strict";
const log = console.log;


//check integrity of definitions
const checkDefinitions = (definitions) => {
    for (let collection in definitions) {
        const buildFunction = definitions[collection].build;
        if ((buildFunction == undefined) || (typeof (buildFunction) != 'function')) {
            log("Error in definitions: each element in the definitions object must have a build function");
            return;
        }
    }
}


const extractFunctions = (obj) => {
    const functionMap =  {};
    for (let [key, value] of Object.entries(obj)){
        if (typeof(value) == 'function') {
            functionMap[key] = value;
        }
    }
    return functionMap;
}

export const proxyChainer = (definitions, builderArguments) => {
    checkDefinitions(definitions);
    const accessor = {};

    for (let collection in definitions) {
        //top-level accessor methods create a proxy accessor per definition
        accessor[collection] = (...otherArgs) => {
            const collectionNode = definitions[collection].build(...builderArguments, ...otherArgs);
            const proxy = {};
            for (let method in collectionNode) {
                proxy[method] = (...args) => {
                    const output = collectionNode[method](...args);                    
                    if (output != undefined) {
                        return extractFunctions(output);
                    } else {
                        return proxy;
                    }
                }
            }
            return proxy;
        }
    }
    return accessor;
}
