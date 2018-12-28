const SuperJsonMediator = require('./superJsonMediator');
const usersModel = require('../models/usersModel');

class UserJsonMediator extends SuperJsonMediator {

    constructor() {
        super();
        this.equilFields = ['login', 'email'];
        this.model = usersModel;
    }

    //processJson from parent class
}

module.exports = new UserJsonMediator();