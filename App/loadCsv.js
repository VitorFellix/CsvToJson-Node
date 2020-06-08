const fs = require('fs');
const readline = require('readline')
const dump = require('./dump')

class CsvLoader {

    constructor(Path) {
        this.csvPath = Path
        this.counter = 0
    }

    readFile() {
        return new Promise((resolve, reject) => {
            try {
                this.counter = 0
                const startTime = new Date().getTime();

                const rl = readline.createInterface({
                    input: fs.createReadStream(this.csvPath),
                    output: process.stdout,
                    terminal: false
                })
                rl.on('line', (line) => {
                    var readLinetimeStart = new Date().getTime()

                    this.pushLine(line).then(() => {

                        var readLinetimeFinish = new Date().getTime()
                        var readLinetime = readLinetimeFinish - readLinetimeStart

                        dump.readTime.push(readLinetime, true)

                        if (readLinetime > dump.maxreadTime) { dump.maxreadTime = readLinetime }
                        if (readLinetime < dump.minreadTime) { dump.minreadTime = readLinetime }
                    })
                })
                rl.on('close', () => {
                    this.counter--;
                    dump.csvLoaded = true
                    dump.numberOfRegistries = this.counter

                    var finishTime = new Date().getTime()
                    var Time = finishTime - startTime;

                    this.averagetime().then((res) => {
                        dump.medreadTime = res / dump.readTime.length
                    })


                    resolve({
                        'Process': 'Read',
                        'Result': 'Success',
                        'Start_Time': startTime + ' ms',
                        'Finish_Time': finishTime + ' ms',
                        'Time': Time + ' ms',
                        'Total_of_Lines': this.counter
                    })
                })
            } catch (error) {
                reject({
                    'Method': 'readFile',
                    'Class': this.Class,
                    'Result': 'error ' + error
                });
            }
        })
    }

    pushLine(line) {
        return new Promise((resolve, reject) => {
            try {
                if (this.counter == 0) {
                    this.counter++;
                } else {
                    dump.csvDump.push(line);
                    this.counter++;
                }
                resolve('yeah');
            } catch (error) {
                reject({
                    'Method': 'pushLine',
                    'Class': this.Class,
                    'Result': 'error ' + error
                });
            }
        })
    }

    averagetime() {
        return new Promise((resolve, reject) => {
            try {
                var medTime = 0
                dump.readTime.forEach(element => {
                    medTime += element
                })
                resolve(medTime)
            } catch (error) {
                reject({
                    'Method': 'averagetime',
                    'Class': this.Class,
                    'Result': 'error ' + error
                });
            }
        })

    }
}

module.exports = CsvLoader