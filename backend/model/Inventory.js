const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    product: {
        type: String,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    deleteComment: {
        type: String,
        default: ""
    },
    delete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = Inventory = mongoose.model('Inventory', InventorySchema);