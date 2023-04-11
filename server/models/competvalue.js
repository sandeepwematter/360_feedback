const mongoose = require("mongoose");

const CompetencyValue = new mongoose.Schema({
    questioncode: {
        type: Array,
        required: true,
    },
    question: {
        type: Array,
        required: true,
    },
    themecode: {
        type: Array,
        required: true,
    },
    theme: {
        type: Array,
        required: true,
    },
    driver: {
        type: Array,
        required: true,
    },
    statement: {
        type: Array,
        required: true,
    },
    description: {
        type: Array,
        required: true,
    },
    imageicon: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model("competvalue",CompetencyValue);