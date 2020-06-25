var http = require('http')
var fs = require('fs')
const XLSX = require('xlsx')

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join('.')
}

class LoadPersons {
  download(url, dest, cb) {
    try {
      var file = fs.createWriteStream(dest)
      var request = http
        .get(url, function (response) {
          try {
            response.pipe(file)
            file.on('finish', function () {
              try {
                console.log(`>>>>>>>> finish file `)
                file.close(cb) // close() is async, call cb after close completes.
              } catch (e) {
                console.log(e)
              }
            })
          } catch (e) {
            console.log(e)
          }
        })
        .on('error', function (err) {
          // Handle errors
          fs.unlink(dest) // Delete the file async. (But we don't check the result)
          if (cb) console.log(err.message)
        })
    } catch (e) {
      console.log(e)
    }
  }

  parseExcel() {
    fs.readFile(
      './public/data/persons_old.json',
      'utf8',
      function readFileCallback(err, data) {
        if (err) {
          console.log(err)
        } else {
          try {
            var obj = [] //JSON.parse(data); //now it an object
            var workbook = XLSX.readFile('./public/data/persons.xlsx', {
              cellDates: true,
              dateNF: 'dd/mm/yyyy',
            }) // ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
            var sheet_name_list = workbook.SheetNames // SheetNames is an ordered list of the sheets in the workbook
            //console.log(sheet_name_list);
            data = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet_name_list[0]],
              { dateNF: 'YYYY-MM-DD', raw: true, defval: null }
            ) //if you have multiple sheets
            var i = 1

            for (var key in data) {
              if (i >= -1) {
                var vIsInventor = ''
                var vSurname = ''
                var vName = ''
                var vMiddleName = ''
                var vDateBirth = ''
                var vPlaceBirth = ''
                var vFieldActivity = ''
                var vDescription = ''
                var vSource = ''
                var vPhotoUrl = ''
                var vDateDeath = ''
                var vPlaceDeath = ''
                var vDateAchievement = ''
                var vPlaceAchievement = ''
                var vFullDescription = ''
                var vLink = ''
                var dataArr = Object.values(data[key])
                var z
                // if(dataArr[0]=='Да'||dataArr[0]=='да'||dataArr[0]=='Нет'||dataArr[0]=='нет'){
                //     z=1
                // }
                // else{
                //     z=0
                // }
                z = 0
                if (typeof dataArr[0 + z] !== 'undefined' && dataArr[0 + z]) {
                  vIsInventor = dataArr[0 + z]
                }
                if (typeof dataArr[1 + z] !== 'undefined' && dataArr[1 + z]) {
                  vSurname = dataArr[1 + z]
                }
                if (typeof dataArr[2 + z] !== 'undefined' && dataArr[2 + z]) {
                  vName = dataArr[2 + z]
                }
                if (typeof dataArr[3 + z] !== 'undefined' && dataArr[3 + z]) {
                  vMiddleName = dataArr[3 + z]
                }
                if (typeof dataArr[4 + z] !== 'undefined' && dataArr[4 + z]) {
                  if (dataArr[4 + z] instanceof Date) {
                    vDateBirth = formatDate(dataArr[4 + z])
                  } else {
                    vDateBirth = dataArr[4 + z]
                  }
                }
                if (typeof dataArr[5 + z] !== 'undefined' && dataArr[5 + z]) {
                  vPlaceBirth = dataArr[5 + z]
                }
                if (typeof dataArr[6 + z] !== 'undefined' && dataArr[6 + z]) {
                  vFieldActivity = dataArr[6 + z]
                }
                if (typeof dataArr[7 + z] !== 'undefined' && dataArr[7 + z]) {
                  vDescription = dataArr[7 + z]
                }
                if (typeof dataArr[8 + z] !== 'undefined' && dataArr[8 + z]) {
                  vSource = dataArr[8 + z]
                }
                if (typeof dataArr[9 + z] !== 'undefined' && dataArr[9 + z]) {
                  vPhotoUrl = dataArr[9 + z]
                }
                if (typeof dataArr[10 + z] !== 'undefined' && dataArr[10 + z]) {
                  if (dataArr[10 + z] instanceof Date) {
                    vDateDeath = formatDate(dataArr[10 + z])
                  } else {
                    vDateDeath = dataArr[10 + z]
                  }
                }
                if (typeof dataArr[11 + z] !== 'undefined' && dataArr[11 + z]) {
                  vPlaceDeath = dataArr[11 + z]
                }
                if (typeof dataArr[12 + z] !== 'undefined' && dataArr[12 + z]) {
                  if (dataArr[12 + z] instanceof Date) {
                    vDateAchievement = formatDate(dataArr[12 + z])
                  } else {
                    vDateAchievement = dataArr[12 + z]
                  }
                }
                if (typeof dataArr[13 + z] !== 'undefined' && dataArr[13 + z]) {
                  vPlaceAchievement = dataArr[13 + z]
                }
                if (typeof dataArr[14 + z] !== 'undefined' && dataArr[14 + z]) {
                  vFullDescription = dataArr[14 + z]
                }
                if (typeof dataArr[15 + z] !== 'undefined' && dataArr[15 + z]) {
                  vLink = dataArr[15 + z]
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
                  Link: vLink,
                }) //add some data
              }
              i++
            }

            obj.sort((a, b) => {
              const bandA = a.Surname.toUpperCase()
              const bandB = b.Surname.toUpperCase()

              let comparison = 0
              if (bandA > bandB) {
                comparison = 1
              } else if (bandA < bandB) {
                comparison = -1
              }
              return comparison
            })

            obj.forEach((item) => {
              Object.keys(item).map((k) => {
                try {
                  if (typeof item[k].trim === 'function')
                    item[k] = item[k].trim()
                } catch (error) {
                  console.log(item)
                }
              })
            })

            var json = JSON.stringify(obj) //convert it back to json
            //console.log(json);
            fs.writeFile('./public/data/persons.json', json, 'utf8', function (
              err
            ) {
              if (err) console.log('Error write persons.json')
              console.log('complete')
            }) // write it back
          } catch (e) {
            console.log(e)
          }
        } 
        // console.log('end parse');
      }
    )
  }
 
  //download("http://www.historian.by/ww2/person.xlsx","./public/data/persons.xlsx",parseExcel);
}

module.exports = new LoadPersons()
