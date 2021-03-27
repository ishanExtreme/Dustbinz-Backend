const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const BinSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    // location field(Object type)
    latitude: {
        type: String,
        required: [true, 'latitude is required'],
        maxlength: 255
    },
    longitude: {
        type: String,
        required: [true, 'longitude is required'],
        maxlength: 255
    },
    // rating field(Number type)
    rating: {
        type: Number,
        validate: {
            validator: (rating)=> rating>=0 && rating<=5,
            message: 'Rating must be between 1 and 5'
        },
        default: 0,
        required: true
    },
    // contributor detail
    contributor: {
        type: Schema.Types.ObjectId,
        // reference to user object
        ref: 'User',
        required: true,
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
});

const Bin = mongoose.model('Bin', BinSchema);

/**
 * Verifying request before sending to database 
 * 
 *
 */
const validateBin = (bin)=>{

    const Schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required()
    });

    return Schema.validate(bin);
}

exports.Bin = Bin;
exports.validate = validateBin;