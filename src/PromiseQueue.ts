import { wait } from './utils'


interface QueueMeta {
    maxLength: number
    timer: number

    queueCapacity: number

    processedPromiseCount: number
    resPromiseCount: number
    rejPromiseCount: number

    promiseStatus: 'res' | 'rej'
}

export default class PromiseQueue {
    static defaultTimer = 25

    maxLength: number
    timer: number

    queue: Promise<any>[] = []

    processedPromiseCount = 0
    resPromiseCount = 0
    rejPromiseCount = 0

    protected _timer?: Promise<void>

    constructor(maxLength: number, timer?: number) {
        this.timer = !timer ? PromiseQueue.defaultTimer : timer
        this.maxLength = maxLength
    }

    protected async process(cb: (promise: Promise<any>, queueMeta: QueueMeta) => void) {
        const promise = this.queue[this.queue.length - 1]
        let promiseStatus!: 'res' | 'rej'
        try {
            await promise

            promiseStatus = 'res'
            this.resPromiseCount++
        } catch {
            promiseStatus = 'rej'
            this.rejPromiseCount++
        }
        this.processedPromiseCount++

        const index = this.queue.indexOf(promise)
        this.queue.splice(index, 1)

        this._timer = undefined
        cb(promise, {
            maxLength: this.maxLength,
            timer: this.timer,
            queueCapacity: this.queue.length,
            processedPromiseCount: this.processedPromiseCount,
            resPromiseCount: this.resPromiseCount,
            rejPromiseCount: this.rejPromiseCount,
            promiseStatus: promiseStatus,
        })
    }

    async addPromise<T>(promise: Promise<T>, cb?: (promise: Promise<T>, queueMeta: QueueMeta) => void) {
        while (this.queue.length >= this.maxLength) {
            if (!this._timer) {
                this._timer = wait(this.timer)
            }
            await this._timer
        }

        this.queue.push(promise)
        this.process(typeof cb === 'function' ? cb : () => { })
    }
}

// // !!!___testing ReqQueue___!!!
// const test = async () => {
//     const promiseQueue = new PromiseQueue(2, 2000)


//     const promise = Promise.resolve(10)
//     promiseQueue.addPromise(
//         promise,
//         async (p, meta) => {
//             console.log(1)
//             console.log(await p)
//         }
//     )
//     promiseQueue.addPromise(
//         promise,
//         async (p, meta) => {
//             console.log(2)
//             console.log(await p)
//         }
//     )
//     promiseQueue.addPromise(
//         promise,
//         async (p, meta) => {
//             console.log(3)
//             console.log(await p)
//         }
//     )
//     promiseQueue.addPromise(
//         promise,
//         async (p, meta) => {
//             console.log(4)
//             console.log(await p)
//         }
//     )
//     console.log('hey')
// }

// test()