
/*
    asynPool is a function that limits the number of concurrent tasks.
    concurrency: number of concurrent tasks
    params: array of parameters to pass to the function
    func: async function to call with each parameter
*/
export const asyncPool = async (concurrency, params, func) => {
    let i = 0;
    const ret = []; // all tasks
    const executing = new Set(); // active tasks

    const enqueue = function () {
        if (i === params.length) {
            return Promise.resolve();
        }
        const item = params[i++]; // next task
        const p = Promise.resolve().then(() => func(item, params));
        ret.push(p);
        executing.add(p);
        const clean = () => executing.delete(p);
        p.then(clean).catch(clean);
        let r: any = Promise.resolve();
        if (executing.size >= concurrency) {
            r = Promise.race(executing);
        }
        // Once a task is complete, add the next one to the queue
        return r.then(() => enqueue());
    };

    return enqueue().then(() => Promise.all(ret));
}