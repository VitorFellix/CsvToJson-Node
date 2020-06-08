const dump = require('./dump')
const papa = require('papaparse')

class JsonParser {
    parse() {
        return new Promise((resolve, reject) => {
            try {
                const startTime = new Date().getTime();
                var porcent = 0

                // CRIA UM LOOP QUE IRA REALIZAR A CONVERSAO
                const loop = setInterval(() => {
                    if (dump.csvDump.length === 0 && dump.csvLoaded == true) {
                        // ENCERRA O LOOP
                        dump.parserFinished = true;

                        var finishTime = new Date().getTime()
                        var Time = finishTime - startTime;

                        this.averagetime().then((res) => {
                            dump.medparseTime = res
                        })

                        resolve({
                            'Process': 'Parse',
                            'Result': 'Success',
                            'StartTime': startTime,
                            'FinishTime': finishTime,
                            'Time': Time
                        })

                        clearInterval(loop);
                    } else {
                        var parsetimeStart = new Date().getTime()

                        this.pushParseShift().then(() => {

                            var parsetimeFinish = new Date().getTime()
                            var Time_for_parse = parsetimeFinish - parsetimeStart
                            dump.parseTime.push(Time_for_parse)
                            if (Time_for_parse > dump.maxparseTime) { dump.maxparseTime = Time_for_parse }
                            if (Time_for_parse < dump.minparseTime) { dump.minparseTime = Time_for_parse }

                        })
                        if (dump.csvDump.length % (dump.numberOfRegistries / 10) < 1) {
                            porcent += 10
                            console.log(porcent + '%...')
                            // console.log('csv :' + dump.csvDump.length + ' left')
                            // console.log('json:' + dump.jsonDump.length + ' parsed')
                        }
                    }
                }, 1);

            } catch (error) {
                reject({
                    'Method': 'parse',
                    'Class': this.Class,
                    'Result': 'error ' + error
                });
            }
        })
        //console.log('Time for Parse: ' + (startTime - finishTime))
    }
    pushParseShift() {
        return new Promise((resolve, reject) => {
            try {
                // PUXA DO CSV E COLOCA NO JSON
                dump.jsonDump.push(papa.parse(dump.csvDump.shift()))
                resolve('yeah')
            } catch (error) {
                reject({
                    'Method': 'pushParseShift',
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
                dump.parseTime.forEach(element => {
                    medTime += element
                })
                resolve(medTime / dump.parseTime.length)
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
module.exports = JsonParser