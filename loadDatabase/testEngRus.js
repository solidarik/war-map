let dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol');

dictEngRusProtocol.getEngRusObject('Одесская наступательная операция')
.then( (obj) => {
    console.log('obj: ', JSON.stringify(obj));
})
.catch( (err) => {
    console.log('err: ', err);
})