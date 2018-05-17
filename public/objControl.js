class ObjControl {
    constructor() {
        this.cName = $("#objectName");
        this.cKind = $("#objectKind");
        this.cCounter = $("#objectCounter");
        this.cCountry = $("#objectCountry");
        
        //this.cInnerInfo = $("#objectInnerInfo");

        this.cName.focusout( () => {
            this.applyChange();
        });

        this.cName.keyup( (e) => {
            if (e.keyCode == 13) {
                this.applyChange();
            }
        });

        this.currentUid = undefined;
        this.count = 0;
        this.getObjPositionFn = (obj) => {return undefined;};
        this.prevFn = (obj) => {};
        this.nextFn = (obj) => {};
        this.changeFn = (obj) => {};
        this.getPrevObjectFn = (obj) => {};
        this.getNextObjectFn = (obj) => {};
        this.selectObjectFn = (obj) => {};
        this.deleteFn = (obj) => {};
        
        this.btnPrev = $("#btnPrevObject");
        this.btnNext = $("#btnNextObject");
        //this.btnChange = $("#btnChangeObject");
        this.btnData = $("#btnDataObject");
        this.btnDelete = $("#btnDeleteObject");

        this.btnPrev.click(() => {
            if (!this.currentUid) return;
            this.prevFn(this.currentUid);
        });
        
        this.btnNext.click(() => {
            if (!this.currentUid) return;
            this.nextFn(this.currentUid);
        });

        this.btnDelete.click(() => {
            this.deleteFn(this.currentUid);
        });

        // this.btnChange.click(() => {
        //     this.applyChange();            
        // });

        this.checkActiveButtons();
    }

    static create() {
        return new ObjControl();
    }

    changeCount(newCnt) {
        this.count = newCnt;
        this.updatePosition();
    }

    applyChange() {
        if (!this.currentUid) return;
        let obj = { uid: this.currentUid }
        obj.name = this.cName.val();
        obj.country = this.getCurrentCountry();
            
        this.changeFn(obj);
    }

    showInfo(data) {

        if (undefined == data.obj) {
            this.cCounter.text('');
            this.currentUid = undefined;
            this.cName[0].value = '';            
            this.changeCount(data.count);
            this.checkActiveButtons();
            return;
        }

        var one_mo = data.obj;
        if (Array.isArray(data.obj))
            one_mo = data.obj[0];
        
        this.currentUid = one_mo.uid;
        this.cName[0].value = one_mo.name ? one_mo.name : "";
        //this.cInnerInfo[0].value = JSON.stringify(one_mo);
        this.cCountry[0].value = one_mo.country;

        this.changeCount(data.count ? data.count : this.count);
        this.checkActiveButtons();

        if (false !== data.selectOnMap)
            this.selectObjectFn(one_mo);
    }

    updatePosition() {
        let pos = this.getObjPositionFn(this.currentUid);
        this.cCounter.text("");
        if (-1 < pos) {
            pos += 1;
            this.cCounter.text( pos + ' из ' + this.count );
        }            
    }

    getCurrentCountry() {
        return this.cCountry.val();
    }

    checkActiveButtons() {

        if (!this.currentUid) {
            enableButton(this.btnPrev, false);
            enableButton(this.btnNext, false);
        } else {
            enableButton(this.btnPrev, this.currentUid != this.getPrevObjectFn(this.currentUid).uid);
            enableButton(this.btnNext, this.currentUid != this.getNextObjectFn(this.currentUid).uid);
        }

        //enableButton(this.btnChange, (this.currentUid));
        enableButton(this.btnDelete, (this.currentUid));
        enableButton(this.btnData, (this.currentUid));
    }

    on(event, cb) {        
        switch(event) {
            case("getObjectPosition"):                
                this.getObjPositionFn = cb;
            break;
            case("prev"):
                this.prevFn = cb;
            break;
            case("next"):
                this.nextFn = cb;
            break;
            case("changeObject"):
                this.changeFn = cb;
            break;
            case("deleteObject"):
                this.deleteFn = cb;
            break;
            case("getPrevObject"):
                this.getPrevObjectFn = cb;
            break;
            case("getNextObject"):
                this.getNextObjectFn = cb;
            break;
            case("selectObject"):
                this.selectObjectFn = cb;        
                break;
            }        
        }
}