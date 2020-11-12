"makes strict";

const log = console.log

const chainInterface = () => {
    const verbs = {}
    const subVerbs = {}
    const subBuilders = {}
    const chainer = {
        register: (name, fn) => {
            verbs[name] = (...fnargs) => {
                fn(...fnargs);
                return verbs;
            };
            return chainer;
        },
        subRegister: (name, builder) => {
            const subInterface = chainInterface();
            subInterface.register(name);            
            subVerbs[name] = subInterface;
            subBuilders[name] = builder;
            return subInterface;
        },
        show: () => log(verbs),
        make: (...args) => {
            const executableVerbs = {};
            for (let verb in verbs) {
                executableVerbs[verb] = (...verbArgs) => {
                    verbs[verb](...args, ...verbArgs);
                    return executableVerbs;
                }
            }
            for (let verb in subVerbs) {
                executableVerbs[verb] = (...verbArgs) => {
                    return subVerbs[verb].make(...subBuilders[verb](...args), ...verbArgs);
                }
            }
            return executableVerbs
        }
    }
    return chainer;
}


const chainInt = chainInterface();
chainInt
    .register("verb1", (counter1, counter2) => { log("verb 1"); counter1["count"]++; counter2["count"] += 2 })
    .register("verb2", (counter1, counter2) => log("verb 2", counter1, counter2))
    .subRegister("verb3", (counter1, counter2) => [{ context1: counter1 }, { context2: counter2 }])
    .register("verb4", (context1, context2) => log("verb 4", context1, context2))
    .subRegister("verb5", (context1, context2) => [{ context3: context1 }, { context4: context2 }])
    .register("verb6", (context1, context2) => log("verb 6", context1, context2))
    ;
const chainer = chainInt.make({ count: 0 }, { count: 0 });
const verb1Res = chainer.verb1("Relish").verb1("Mustard").verb2();
const v3 = chainer.verb3();
log(v3)
v3.verb4()
v3.verb4().verb5().verb6();
