const router = require('express').Router();
const mongoose = require('mongoose');
const {createSchema} = require("../helpers/feedData");
const competency = require('../models/competency');
const Data = mongoose.model('Data', createSchema());
const CompetencyValue = require('../models/competvalue');


router.get('/alldata', async (req, res) => {
    try {
        const data = await Data.find();
        res.send(data);
    }
    catch (err) {
        console.log("Data get ----->", err);
        res.send({
            message: "SOMETHING WENT WRONG",
            status: 0
        })
    }
})
router.get('/competvalues', async (req, res) => {
    try {
        const data = await CompetencyValue.find();
        res.send(data);
    }
    catch (err) {
        console.log("Data get ----->", err);
        res.send({
            message: "SOMETHING WENT WRONG",
            status: 0
        })
    }
})

router.get('/:entity', async (req, res) => {
    try {
      const entity = "_" + req.params.entity;
      const updatedEntity = entity.slice(0,-1);
      console.log(updatedEntity)
        const data = await Data.find().distinct(updatedEntity);
        res.send(data);
    }
    catch (err) {
        console.log("Data get ----->", err);
        res.send({
            message: "SOMETHING WENT WRONG",
            status: 0
        })
    }
})

module.exports = router;