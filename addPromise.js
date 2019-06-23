function addPromise(a, b, timeout) {
    return new Promise((resolve, reject) => {
        try {
            let addPromiseTimeout = setTimeout(() => {
                reject('minor addPromise timeout')
            }, timeout)
            clearTimeout(addPromiseTimeout)
            resolve(a + b)
        } catch (err) {
            reject(`major addPromise error ${util.inspect(err)}`)
        }
    })
}
// addPromise(2, 2, 10000).then(ans => {
//     console.log(ans)
// }).catch(err => {
//     console.log(err)
// })
console.log(addPromise(2,2,10000));
addPromise(2,2,10000).then(sum => {
    console.log(sum)
}).catch((error)=>{
    console.log(error);
})