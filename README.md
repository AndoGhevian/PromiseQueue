# PromiseQueue
This is simple class to queue promises with **maxQueueCapacity** and **timer**.

## Usage
Simply create **PromiseQueue** instance with **maxLength**, and initial **timer**
and start to add promisies to it.

```javascript
const PromiseQueue = require('promise-queue')

const queue = new PromiseQueue(2, 2000)
queue.addPromise(Promise.resolve(10), async (promise, queueMeta) => {
    console.log(queueMeta)
    const result = await promise // Here Promise is already out of pending state.
})
queue.addPromise(Promise.reject('REJECT'))
queue.addPromise(Promise.reject('REJECT2'))
queue.addPromise(Promise.reject('REJECT3'))
queue.addPromise(Promise.reject('REJECT4'))
queue.addPromise(Promise.reject('REJECT5'))
```

Here promises will be added to queue when possible, i.e. if queue capacity
is not reached **maxLength** limit, promise will be added to queue, and awaited.

If it is reached limit, queue will idle for **timer** time(2000ms in this case), and there after check again if there is any free capacity. **timer** default value
is **25ms.**

You can also await **queue.addPromise()** call, to be aware when current promise
already added to queue, but not proccessed yet, i.e. **checked** for **ReadyState**.
```javascript
await queue.addPromise(Promise.resolve('already added to queue'))
// ...In here promise already added to queue,
// but not yet checked for ReadyState - if its resolved or rejected.
```

Buy second argument you can give callback as you see, that will be called, when promise rejected or resolved and poped out from the queue.

There you will get as a first argument same promise, that is allready in **ReadyState**, and **QueueMeta** information with second argument, which presents state of a queue at a time callback called.

Currently you can change **timer** value of queue instance, and when next time timer starts, it will use new value. **See when timer starts above.**