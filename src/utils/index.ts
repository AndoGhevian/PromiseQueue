/**
 * Wait provided "time" milliseconds and resolve.
 * @param time - Time number in milliseconds to resolve returned promise. **MUST** be nonnegative integer.
 * @param onFinish - Defines if to resolve or reject after time passed.
 * 
 * **Default - 'res'**
 * 
 * **Failover - 'res'**
 */
export function wait(time: number, onFinish?: 'res' | 'rej'): Promise<void> {
    return new Promise((res, rej) => setTimeout(() => onFinish === 'rej' ? rej(void(0)) : res(void(0)), time))
}