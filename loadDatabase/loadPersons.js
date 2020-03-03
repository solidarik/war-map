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
                            if (typeof data[key]['Изобретатель'] !== 'undefined' && data[key]['Изобретатель']) {
                                vIsInventor = data[key]['Изобретатель'];
                            }
                            if (typeof data[key]['Фамилия'] !== 'undefined' && data[key]['Фамилия']) {
                                vSurname = data[key]['Фамилия'];
                            }
                            if (typeof data[key]['Имя'] !== 'undefined' && data[key]['Имя']) {
                                vName = data[key]['Имя'];
                            }
                            if (typeof data[key]['Отчество'] !== 'undefined' && data[key]['Отчество']) {
                                vMiddleName = data[key]['Отчество'];
                            }
                            if (typeof data[key]['Дата рож'] !== 'undefined' && data[key]['Дата рож']) {
                                if (data[key]['Дата рож'] instanceof Date) {
                                    vDateBirth = formatDate(data[key]['Дата рож']);
                                } else {
                                    vDateBirth = data[key]['Дата рож'];
                                }
                            }
                            if (typeof data[key]['Место рожд'] !== 'undefined' && data[key]['Место рожд']) {
                                vPlaceBirth = data[key]['Место рожд'];
                            }
                            if (typeof data[key]['Сфера деятельности'] !== 'undefined' && data[key]['Сфера деятельности']) {
                                vFieldActivity = data[key]['Сфера деятельности'];
                            }
                            if (typeof data[key]['Описание подвига'] !== 'undefined' && data[key]['Описание подвига']) {
                                vDescription = data[key]['Описание подвига'];
                            }
                            if (typeof data[key]['Источник'] !== 'undefined' && data[key]['Источник']) {
                                vSource = data[key]['Источник'];
                            }
                            if (typeof data[key]['Ссылка на фото'] !== 'undefined' && data[key]['Ссылка на фото']) {
                                vPhotoUrl = data[key]['Ссылка на фото'];
                            }
                            if (typeof data[key]['Дата смерти'] !== 'undefined' && data[key]['Дата смерти']) {
                                if (data[key]['Дата смерти'] instanceof Date) {
                                    vDateDeath = formatDate(data[key]['Дата смерти']);
                                } else {
                                    vDateDeath = data[key]['Дата смерти'];
                                }
                            }
                            if (typeof data[key]['Похоронен'] !== 'undefined' && data[key]['Похоронен']) {
                                vPlaceDeath = data[key]['Похоронен'];
                            }
                            if (typeof data[key]['Дата подвига'] !== 'undefined' && data[key]['Дата подвига']) {
                                if (data[key]['Дата подвига'] instanceof Date) {
                                    vDateAchievement = this.formatDate(data[key]['Дата подвига']);
                                } else {
                                    vDateAchievement = data[key]['Дата подвига'];
                                }
                            }
                            if (typeof data[key]['Место подвига'] !== 'undefined' && data[key]['Место подвига']) {
                                vPlaceAchievement = data[key]['Место подвига'];
                            }
                            if (typeof data[key]['Описание'] !== 'undefined' && data[key]['Описание']) {
                                vFullDescription = data[key]['Описание'];
                            }
                            if (typeof data[key]['Ссылка ни изобретение / подвиг / вооружение'] !== 'undefined' && data[key]['Ссылка ни изобретение / подвиг / вооружение']) {
                                vLink = data[key]['Ссылка ни изобретение / подвиг / вооружение'];
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


