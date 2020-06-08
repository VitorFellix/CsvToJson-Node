const dump = require('./dump')
const fs = require('fs');

class JsonSaver {
    constructor(savePath) {
        this.path = savePath
        this.file = fs.createWriteStream(this.path)
    }

    save() {
        return new Promise((resolve, reject) => {
            try {
                const startTime = new Date().getTime();

                if (dump.parserFinished == true) {
                    /*
                    file.write(
                            JSON.stringify(dump.jsonDump)
                    )
                    */
                    dump.jsonDump.forEach(element => {

                        var savetimeStart = new Date().getTime()

                        this.write(element)
                            .then((res) => {
                                var savetimeFinish = new Date().getTime()
                                var Time_for_save = savetimeFinish - savetimeStart
                                dump.saveTime.push(Time_for_save)
                                if (Time_for_save > dump.maxsaveTime) { dump.maxsaveTime = Time_for_save }
                                if (Time_for_save < dump.minsaveTime) { dump.minsaveTime = Time_for_save }
                            })
                    })



                    this.file.on('error', function (err) {
                        console.log({
                            'Method': 'save error',
                            'Class': this.Class,
                            'Result': error
                        });
                    });

                    //dump.jsonDump.forEach(element => {
                    //file.write(i.join(', ') + '\n')
                    //file.write(element + '\n')
                    //})

                    this.file.end(() => {
                        var finishTime = new Date().getTime();
                        var Time = finishTime - startTime;
                        this.averagetime().then((res) => {
                            dump.medsaveTime = res
                        })
                        resolve({
                            'Process': 'Save',
                            'Result': 'Success',
                            'StartTime': startTime + ' ms',
                            'FinishTime': finishTime + ' ms',
                            'Time': Time + ' ms'
                        })
                    }
                    )
                }


            } catch (error) {
                reject({ 'Class': 'JsonSaver', 'Erro': error })
            }
            finally {
                this.file.close
            }
        })
    }
    write(element) {
        return new Promise((resolve, reject) => {
            try {
                this.file.write(
                    JSON.stringify(element) + '\n'
                )
                resolve('yeah')
            } catch (error) {
                reject({
                    'Method': 'write',
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
                dump.saveTime.forEach(element => {
                    medTime += element
                })
                resolve(medTime / dump.saveTime.length)
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

module.exports = JsonSaver