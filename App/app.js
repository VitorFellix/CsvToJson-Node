const loadCsv = require('./loadCsv')
const parsetoJson = require('./parseToJson')
const saveJson = require('./saveJson')
const dump = require('./dump')

// CLASSES
const csvLoader = new loadCsv('../Resources/brasil.csv');
//const csvLoader = new loadCsv('../Resources/test.csv');
const jsonParser = new parsetoJson();
const jsonSaver = new saveJson('../Resources/jsonArray.txt');

//var i = new Date().getTime()
//var it = new Date().getTime() - i;
//console.log(it);

// METODOS
const start = async () => {
    const prmiro = await read().then(res => {
        console.log(res)
        dump.resolves.push(res)
    })
    const sgundo = await parse().then(res => {
        console.log(res)
        dump.resolves.push(res)
    })
    const trciro = await save().then(res => {
        console.log(res)
        dump.resolves.push(res)
    })
    const quarto = await showTime().then(res => {
        console.log(res)
    })
}

const read = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log('reading...')
            csvLoader.readFile().then(res => {
                resolve(res);
            })
        } catch (error) {
            reject({ 'Promise': 'read', 'Erro': error })
        }
    })
}

const parse = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log('parsing...')
            jsonParser.parse().then(res => {
                resolve(res)
            })
        } catch (error) {
            reject({ 'Promise': 'parse', 'Erro': error })
        }
    })
}

const save = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log('saving...')
            jsonSaver.save().then(res => {
                resolve(res)
            })
        } catch (error) {
            reject({ 'Promise': 'save', 'Erro': error })
        }
    })
}

const showTime = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                'Max_read': dump.maxreadTime,
                'Min_read': dump.minreadTime,
                'Med_read': dump.medreadTime,

                'Max_parse': dump.maxparseTime,
                'Min_parse': dump.minparseTime,
                'Med_parse': dump.medparseTime,

                'Max_save': dump.maxsaveTime,
                'Min_save': dump.minsaveTime,
                'Med_save': dump.medsaveTime,

                'read': dump.readTime,
                'parse': dump.parseTime,
                'save': dump.saveTime
            })
        } catch (error) {
            reject({ 'Promise': 'showTime', 'Erro': error })
        }
    })
}

start();