const testArr = [
  { name: 'hello', value: 2 },
  { name: 'some', value: 3 },
  { name: 'third', value: 3 },
]

const nextArr = testArr.map((elem) => {
  return { ...elem, hello: 'world' }
})

console.log(JSON.stringify(nextArr))
