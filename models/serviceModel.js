import mongoose from 'mongoose'

var serviceSchema = new mongoose.Schema(
    {
        name: String,
        value: String,
        model: String,
    },
    {
        timestamps: true,
    }
)

serviceSchema.statics.publicFields = ['name', 'value']

export default mongoose.model('service', serviceSchema)
