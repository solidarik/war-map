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

class ParseHolyPersons {

  parseExcel(fileFromXLSX, fileToJSON) {

    try {
      var obj = [] //JSON.parse(data); //now it an object
      var workbook = XLSX.readFile(fileFromXLSX, {
        cellDates: true,
        dateNF: 'dd/mm/yyyy',
      }) // ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
      var sheet_name_list = workbook.SheetNames // SheetNames is an ordered list of the sheets in the workbook
      console.log(sheet_name_list);
      var data = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
        { dateNF: 'YYYY-MM-DD', raw: true, defval: null }
      ) //if you have multiple sheets
      console.log(data);
      for (var key in data) {

          var vSurname = '' //Фамилия	
          var vName = '' //Имя 	
          var vMiddleName = '' //Отчество	
          var vDateBirth = '' //Дата рождения	
          var vPlaceBirth = '' //Место рождения	
          var vNameInMonasticism = '' //Имя в монашестве	
          var vPlaceAchievement = ''//Место подвига	
          var vDateAchievement = '' //Время подвига	
          var vPlaceAchievement1 = ''//Место подвига	
          var vDateAchievement1 = '' //Время подвига	
          var vPlaceAchievement2 = ''//Место подвига	
          var vDateAchievement2 = '' //Время подвига	
          var vDateCanonization = '' //Дата канонизации	
          var vHolinessStatus = ''//Статус святости	
          var vDateVeneration = '' //Дата почитания	
          var vFieldActivity = '' //Сфера деятельности	
          var vDescription = '' //Жизнеописание	
          var vSource = '' //Источник	
          var vPhotoUrl = '' //Ссылка на фото	
          var vDateDeath = '' //Дата смерти	
          var vPlaceDeath = '' //Похоронен	
          var vEparchy = '' //Епархия

          var dataArr = Object.values(data[key])
          console.log(dataArr);
          if (typeof dataArr[0] !== 'undefined' && dataArr[0]) {
            vSurname = dataArr[0]
          }
          if (typeof dataArr[1] !== 'undefined' && dataArr[1]) {
            vName = dataArr[1]
          }
          if (typeof dataArr[2] !== 'undefined' && dataArr[2]) {
            vMiddleName = dataArr[2]
          }
          if (typeof dataArr[3] !== 'undefined' && dataArr[3]) {
            if (dataArr[3] instanceof Date) {
              vDateBirth = formatDate(dataArr[3])
            } else {
              vDateBirth = dataArr[3]
            }
          }
          if (typeof dataArr[4] !== 'undefined' && dataArr[4]) {
            vPlaceBirth = dataArr[4]
          }
          if (typeof dataArr[5] !== 'undefined' && dataArr[5]) {
            vNameInMonasticism = dataArr[5]
          }
          if (typeof dataArr[6] !== 'undefined' && dataArr[6]) {
            vPlaceAchievement = dataArr[6]
          }
          if (typeof dataArr[7] !== 'undefined' && dataArr[7]) {
            if (dataArr[7] instanceof Date) {
              vDateAchievement = formatDate(dataArr[7])
            } else {
              vDateAchievement = dataArr[7]
            }
          }
          if (typeof dataArr[8] !== 'undefined' && dataArr[8]) {
            vPlaceAchievement1 = dataArr[8]
          }
          if (typeof dataArr[9] !== 'undefined' && dataArr[9]) {
            if (dataArr[9] instanceof Date) {
              vDateAchievement1 = formatDate(dataArr[9])
            } else {
              vDateAchievement1 = dataArr[9]
            }
          }
          if (typeof dataArr[10] !== 'undefined' && dataArr[10]) {
            vPlaceAchievement2 = dataArr[10]
          }
          if (typeof dataArr[11] !== 'undefined' && dataArr[11]) {
            if (dataArr[11] instanceof Date) {
              vDateAchievement2 = formatDate(dataArr[11])
            } else {
              vDateAchievement2 = dataArr[11]
            }
          }
          if (typeof dataArr[12] !== 'undefined' && dataArr[12]) {
            if (dataArr[12] instanceof Date) {
              vDateCanonization = formatDate(dataArr[12])
            } else {
              vDateCanonization = dataArr[12]
            }
          }
          if (typeof dataArr[13] !== 'undefined' && dataArr[13]) {
            vHolinessStatus = dataArr[13]
          }
          if (typeof dataArr[14] !== 'undefined' && dataArr[14]) {
            if (dataArr[14] instanceof Date) {
              vDateVeneration = formatDate(dataArr[14])
            } else {
              vDateVeneration = dataArr[14]
            }
          }
          if (typeof dataArr[15] !== 'undefined' && dataArr[15]) {
            vFieldActivity = dataArr[15]
          }
          if (typeof dataArr[16] !== 'undefined' && dataArr[16]) {
            vDescription = dataArr[16]
          }
          if (typeof dataArr[17] !== 'undefined' && dataArr[17]) {
            vSource = dataArr[17]
          }
          if (typeof dataArr[18] !== 'undefined' && dataArr[18]) {
            vPhotoUrl = dataArr[18]
          }
          if (typeof dataArr[19] !== 'undefined' && dataArr[19]) {
            if (dataArr[19] instanceof Date) {
              vDateDeath = formatDate(dataArr[19])
            } else {
              vDateDeath = dataArr[19]
            }
          }
          if (typeof dataArr[20] !== 'undefined' && dataArr[20]) {
            vPlaceDeath = dataArr[20]
          }
          if (typeof dataArr[21] !== 'undefined' && dataArr[21]) {
            vEparchy = dataArr[21]
          }

          obj.push({
            Surname: vSurname,
            Name: vName,
            MiddleName: vMiddleName,
            DateBirth: vDateBirth,
            PlaceBirth: vPlaceBirth,
            NameInMonasticism: vNameInMonasticism,
            PlaceAchievement: vPlaceAchievement,
            DateAchievement: vDateAchievement,
            PlaceAchievement1: vPlaceAchievement1,
            DateAchievement1: vDateAchievement1,
            PlaceAchievement2: vPlaceAchievement2,
            DateAchievement2: vDateAchievement2,
            DateCanonization: vDateCanonization,
            HolinessStatus: vHolinessStatus,
            DateVeneration: vDateVeneration,
            FieldActivity: vFieldActivity,
            Description: vDescription,
            Source: vSource,
            PhotoUrl: vPhotoUrl,
            DateDeath: vDateDeath,
            PlaceDeath: vPlaceDeath,
            Eparchy: vEparchy,
          }) //add some data
      }

      obj.sort((a, b) => {
        const bandA = a.Eparchy.toUpperCase()+a.Surname.toUpperCase()+a.Name.toUpperCase()
        const bandB = b.Eparchy.toUpperCase()+b.Surname.toUpperCase()+b.Name.toUpperCase()

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
          } catch (err) {
            console.log('Error trim ' + item + ' err=' + err)
          }
        })
      })

      var json = JSON.stringify(obj) //convert it back to json
      //console.log(json);
      fs.writeFile(fileToJSON, json, 'utf8', function (
        err
      ) {
        if (err) console.log('Error write ' + fileToJSON + ' err=' + err)
        console.log('complete parse ' + fileFromXLSX + ' to ' + fileToJSON)
      }) // write it back
    } catch (err) {
      console.log('Error parse ' + fileFromXLSX + ' err=' + err)
    }

  }
}

module.exports = new ParseHolyPersons()
