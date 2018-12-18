
class SuperJsonMediator {

    addObjectToBase(json) {
        return new Promise( (resolve, reject) => {
            const obj = new this.model(json);
            obj.save()
            .then(
                res => resolve(obj['_id'.toString()]),
                err => { throw err; }
            );
        });
    }

    isExistObject(json) {
        return new Promise( (resolve, reject) => {
            let findJson = {};
            this.equilFields.forEach(element => {
                findJson[element] = json[element];
            });

            this.model.findOne(findJson, (err, res) => {

                if (err) {
                    reject(`Ошибка в isExistObject: не удалось найти объект ${err}`);
                }

                resolve(res);
            });
        });
    }
}