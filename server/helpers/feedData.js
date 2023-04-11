const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const Value = require('../models/value');
const Competency = require('../models/competency');
const CompetencyValue = require('../models/competvalue');

const DATA_CSV_FILE_PATH = './datas/datas.csv';
const VALUES_CSV_FILE_PATH = './datas/values.csv';
const COMPETENCIES_CSV_FILE_PATH = './datas/competencies.csv';
const COMPETENCYVALUE_CSV_FILE_PATH = './datas/competvalue.csv';

const createSchema = () => {
    const schemaModel = new mongoose.Schema({
        _empcode: {
            type: String,
            required: true,
        },
        empname: {
            type: String,
            required: true,
        },
        _people: {
            type: String,
            required: true,
        },
        _location: {
            type: String,
            required: true,
        },
        _department: {
            type: String,
            required: true,
        },
        competency01Q01: {
            type: Number,
        },
        competency01Q02: {
            type: Number,
        },
        competency01Q03: {
            type: Number,
        },
        competency02Q01: {
            type: Number,
        },
        competency02Q02: {
            type: Number,
        },
        competency02Q03: {
            type: Number,
        },
        competency03Q01: {
            type: Number,
        },
        competency03Q02: {
            type: Number,
        },
        competency03Q03: {
            type: Number,
        },
        competency04Q01: {
            type: Number,
        },
        competency04Q02: {
            type: Number,
        },
        competency04Q03: {
            type: Number,
        },
        competency05Q01: {
            type: Number,
        },
        competency05Q02: {
            type: Number,
        },
        competency05Q03: {
            type: Number,
        },
        competency06Q01: {
            type: Number,
        },
        competency06Q02: {
            type: Number,
        },
        value01Q01: {
            type: Number,
        },
        value01Q02: {
            type: Number,
        },
        value01Q03: {
            type: Number,
        },
        value02Q01: {
            type: Number,
        },
        value02Q02: {
            type: Number,
        },
        value02Q03: {
            type: Number,
        },
        value03Q01: {
            type: Number,
        },
        value03Q02: {
            type: Number,
        },
        value03Q03: {
            type: Number,
        },
        value04Q01: {
            type: Number,
        },
        value04Q02: {
            type: Number,
        },
        value04Q03: {
            type: Number,
        },
        value05Q01: {
            type: Number,
        },
        value05Q02: {
            type: Number,
        },
        value05Q03: {
            type: Number,
        },
    }, { strict: false });

return schemaModel;
};

const feedData = () => {
    let DataModel;
    try {
        DataModel = mongoose.model('Data');
    } catch (error) {
        DataModel = mongoose.model('Data', dataSchema);
    }

    fs.createReadStream(DATA_CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (data) => {
            const d = new DataModel({
                _empcode: data['Employee Code'],
                empname: data['Employee Name'],
                _people: data['Respondant Role '],
                _location: data['Location'],
                _department: data['Department'],
                    value01Q01: data['VALUE01Q1'],
                    value01Q02: data['VALUE01Q2'],
                    value01Q03: data['VALUE01Q3'],
                    value02Q01: data['VALUE02Q1'],
                    value02Q02: data['VALUE02Q2'],
                    value02Q03: data['VALUE02Q3'],
                    value03Q01: data['VALUE03Q1'],
                    value03Q02: data['VALUE03Q2'],
                    value03Q03: data['VALUE03Q3'],
                    value04Q01: data['VALUE04Q1'],
                    value04Q02: data['VALUE04Q2'],
                    value04Q03: data['VALUE04Q3'],
                    value05Q01: data['VALUE05Q1'],
                    value05Q02: data['VALUE05Q2'],
                    value05Q03: data['VALUE05Q3'],
                    competency01Q01: data['COMPETENCY01Q1'],
                    competency01Q02: data['COMPETENCY01Q2'],
                    competency01Q03: data['COMPETENCY01Q3'],
                    competency02Q01: data['COMPETENCY02Q1'],
                    competency02Q02: data['COMPETENCY02Q2'],
                    competency02Q03: data['COMPETENCY02Q3'],
                    competency03Q01: data['COMPETENCY03Q1'],
                    competency03Q02: data['COMPETENCY03Q2'],
                    competency03Q03: data['COMPETENCY03Q3'],
                    competency04Q01: data['COMPETENCY04Q1'],
                    competency04Q02: data['COMPETENCY04Q2'],
                    competency04Q03: data['COMPETENCY04Q3'],
                    competency05Q01: data['COMPETENCY05Q1'],
                    competency05Q02: data['COMPETENCY05Q2'],
                    competency05Q03: data['COMPETENCY05Q3'],
                    competency06Q01: data['COMPETENCY06Q1'],
                    competency06Q02: data['COMPETENCY06Q2'],
            });

            await d.save();
        })
    fs.createReadStream(VALUES_CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (data) => {
            const d = new Value({
                themecode: data['THEME_CODE'],
                theme: data['THEME'],
                statement: data['STATEMENT'],
            });

            await d.save();
        })
    fs.createReadStream(COMPETENCIES_CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (data) => {
            const d = new Competency({
                themecode: data['THEME_CODE'],
                theme: data['THEME'],
                statement: data['STATEMENT'],
            });

            await d.save();
        })
    fs.createReadStream(COMPETENCYVALUE_CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (data) => {
            const d = new CompetencyValue({
                themecode: data['Theme_code'],
                questioncode: data['Question_code'],
                question: data['Question'],
                driver: data['Driver'],
                imageicon: data['Image_Icon'],
                theme: data['Theme'],
                statement: data['Statement'],
                description: data['Description'],
            });

            await d.save();
        })
        .on('end', () => {
            console.log('Data fed successfully.');
        });
};

module.exports = { createSchema, feedData };
