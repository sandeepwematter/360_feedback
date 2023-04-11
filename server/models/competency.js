const mongoose = require("mongoose");

const Competency = new mongoose.Schema({
    themecode: {
        type: Array,
        required: true,
    },
    theme: {
        type: Array,
        required: true,
    },
    statement: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model("competency",Competency);