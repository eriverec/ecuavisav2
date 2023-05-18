import mongoose from "mongoose";

const polly = mongoose.Schema({
    idarticulo: {
        type: String,
        default:'',
        required: true,
    },
    audio: {
        data: Buffer,
        contentType: String
    },
    data:[{}],
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const pollySchema = mongoose.model('polly', polly);