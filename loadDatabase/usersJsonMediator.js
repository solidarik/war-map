import SuperJsonMediator from './superJsonMediator.js'
import UserModel from '../models/usersModel.js'

export default class UsersJsonMediator extends SuperJsonMediator {

    constructor() {
        super()
        this.equilFields = ['login', 'email']
        this.model = UserModel
    }

    //processJson from parent class
    processJson(json) {
        return new Promise((resolve) => { resolve(json) })
    }
}