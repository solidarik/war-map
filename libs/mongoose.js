import mongoose from 'mongoose'
import config from 'config'

if (process.env.MONGOOSE_DEBUG) {
    mongoose.set('debug', true);
}

mongoose.set('strictQuery', true)

async function main() {
    mongoose.Promise = global.Promise;
    await mongoose.connect(config.mongoose.uri, config.mongoose.options)
}
// .then(res => console.log('success connection: ' + res))
// .catch(err => console.log(`error by mongoose connection ${err}`))

main().catch(err => console.log(`error connection to mongoose ${err}`))

export default mongoose
