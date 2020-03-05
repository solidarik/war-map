var http = require('http');
var fs = require('fs');
const XLSX = require('xlsx');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('.');
}

class LoadPersons {
    download(url, dest, cb) {
        var file = fs.createWriteStream(dest);
        var request = http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(cb);  // close() is async, call cb after close completes.
            });
        }).on('error', function (err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    };

    parseExcel() {
        fs.readFile('./public/data/persons_old.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                 try{
                    var obj = [];//JSON.parse(data); //now it an object
                    var workbook = XLSX.readFile('./public/data/persons.xlsx', { cellDates: true, dateNF: 'dd/mm/yyyy' });// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
                    var sheet_name_list = workbook.SheetNames; // SheetNames is an ordered list of the sheets in the workbook
                    //console.log(sheet_name_list);
                    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { dateNF: "YYYY-MM-DD" }); //if you have multiple sheets
                    var i = 1;
    
                    for (var key in data) {
                        if (i >= -1) {
                            var vIsInventor = "";
                            var vSurname = "";
                            var vName = "";
                            var vMiddleName = "";
                            var vDateBirth = "";
                            var vPlaceBirth = "";
                            var vFieldActivity = "";
                            var vDescription = "";
                            var vSource = "";
                            var vPhotoUrl = "";
                            var vDateDeath = "";
                            var vPlaceDeath = "";
                            var vDateAchievement = "";
                            var vPlaceAchievement = "";
                            var vFullDescription = "";
                            var vLink = "";
                            var dataArr = Object.values(data[key]);
                            if (typeof dataArr[0] !== 'undefined' && dataArr[0]) {
                                vIsInventor = dataArr[0];
                            }
                            if (typeof dataArr[1] !== 'undefined' && dataArr[1]) {
                                vSurname = dataArr[1];
                            }
                            if (typeof dataArr[2] !== 'undefined' && dataArr[2]) {
                                vName = dataArr[2];
                            }
                            if (typeof dataArr[3] !== 'undefined' && dataArr[3]) {
                                vMiddleName = dataArr[3];
                            }
                            if (typeof dataArr[4] !== 'undefined' && dataArr[4]) {
                                if (dataArr[4] instanceof Date) {
                                    vDateBirth = formatDate(dataArr[4]);
                                } else {
                                    vDateBirth = dataArr[4];
                                }
                            }
                            if (typeof dataArr[5] !== 'undefined' && dataArr[5]) {
                                vPlaceBirth = dataArr[5];
                            }
                            if (typeof dataArr[6] !== 'undefined' && dataArr[6]) {
                                vFieldActivity = dataArr[6];
                            }
                            if (typeof dataArr[7] !== 'undefined' && dataArr[7]) {
                                vDescription = dataArr[7];
                            }
                            if (typeof dataArr[8] !== 'undefined' && dataArr[8]) {
                                vSource = dataArr[8];
                            }
                            if (typeof dataArr[9] !== 'undefined' && dataArr[9]) {
                                vPhotoUrl = dataArr[9];
                            }
                            if (typeof dataArr[10] !== 'undefined' && dataArr[10]) {
                                if (dataArr[10] instanceof Date) {
                                    vDateDeath = formatDate(dataArr[10]);
                                } else {
                                    vDateDeath = dataArr[10];
                                }
                            }
                            if (typeof dataArr[11] !== 'undefined' && dataArr[11]) {
                                vPlaceDeath = dataArr[11];
                            }
                            if (typeof dataArr[12] !== 'undefined' && dataArr[12]) {
                                if (dataArr[12] instanceof Date) {
                                    vDateAchievement = this.formatDate(dataArr[12]);
                                } else {
                                    vDateAchievement = dataArr[12];
                                }
                            }
                            if (typeof dataArr[13] !== 'undefined' && dataArr[13]) {
                                vPlaceAchievement = dataArr[13];
                            }
                            if (typeof dataArr[14] !== 'undefined' && dataArr[14]) {
                                vFullDescription = dataArr[14];
                            }
                            if (typeof dataArr[15] !== 'undefined' && dataArr[15]) {
                                vLink = dataArr[15];
                            }
                            obj.push({
                                IsInventor: vIsInventor,
                                Surname: vSurname,
                                Name: vName,
                                MiddleName: vMiddleName,
                                DateBirth: vDateBirth,
                                PlaceBirth: vPlaceBirth,
                                FieldActivity: vFieldActivity,
                                Description: vDescription,
                                Source: vSource,
                                PhotoUrl: vPhotoUrl,
                                DateDeath: vDateDeath,
                                PlaceDeath: vPlaceDeath,
                                DateAchievement: vDateAchievement,
                                PlaceAchievement: vPlaceAchievement,
                                FullDescription: vFullDescription,
                                Link: vLink
                            }); //add some data                                    
                        }
                        i++;
                    }
    
                    obj.sort((a, b) => {
                        const bandA = a.Surname.toUpperCase();
                        const bandB = b.Surname.toUpperCase();
                      
                        let comparison = 0;
                        if (bandA > bandB) {
                          comparison = 1;
                        } else if (bandA < bandB) {
                          comparison = -1;
                        }
                        return comparison;
                    });

                    var json = JSON.stringify(obj); //convert it back to json
                    //console.log(json);
                    fs.writeFile('./public/data/persons.json', json, 'utf8', function (err) {
                        if (err) throw err;
                        console.log('complete');
                    }); // write it back 
                }
                catch(e){
                    console.log(err);
                }
            }
        });
    }

    //download("http://www.historian.by/ww2/person.xlsx","./public/data/persons.xlsx",parseExcel);

}

module.exports = new LoadPersons();


