import DbHelper from '../loadDatabase/dbHelper.js'
import BattlesModel from '../models/battlesModel.js'
import GeoHelper from '../helper/geoHelper.js'
import inetHelper from '../helper/inetHelper.js'

const dbHelper = new DbHelper()

const checkedCoordsPath = 'loadDatabase\\dataSources\\checkedCoords.json'
inetHelper.loadCoords(checkedCoordsPath)

const filePath1 = 'file:///C:/GubaydullinII/projects/freelance/war-map/models/battlesModel.js';
const filePath2 = '../models/battlesModel.js';

;(async function() {
  try {

    const coords = await inetHelper.getLonLatSavedCoords('Цецылювка, Польша')
    console.log(coords)

    await dbHelper.connect();
    const model1 = await import(filePath1)
    const model2 = await import(filePath2)
    console.log(`Import model1: ${JSON.stringify(model1)}`)
    console.log(`Import model2: ${JSON.stringify(model2)}`)

    // const data = await model2.default.find({});
    // console.log(data);
  } finally {
    dbHelper.free();
  }
}
)()