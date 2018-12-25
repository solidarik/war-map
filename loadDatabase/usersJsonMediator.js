const SuperJsonMediator = require('./superJsonMediator');
const usersModel = require('../models/user');

class UserJsonMediator extends SuperJsonMediator {

    constructor() {
        super();
        this.equilFields = ['email'];
        this.model = usersModel;
    }

    //processJson from parent class
}

module.exports = new UserJsonMediator();