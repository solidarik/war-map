class ObjControl {
    constructor() {
        this.cName = $("#objectName");
        this.cKind = $("#objectKind");
        this.cCounter = $("#objectCounter");
        this.cInnerInfo = $("#objectInnerInfo");

        this.currentUid = undefined;
        this.count = 0;
        this.getObjPositionFn = (obj) => {return undefined;};
        this.prevFn = (obj) => {};
        this.nextFn = (obj) => {};
        this.changeFn = (obj) => {};
        this.getPrevObjectFn = (obj) => {};
        this.getNextObjectFn = (obj) => {};
        
        this.btnPrev = $("#btnPrevObject");
        this.btnNext = $("#btnNextObject");
        this.btnChange = $("#btnChangeObject");
        this.btnDelete = $("#btnDeleteObject");

        this.btnPrev.click(() => {
            if (!this.currentUid) return;
            this.prevFn(this.currentUid);
        });
        
        this.btnNext.click(() => {
            if (!this.currentUid) return;
            this.nextFn(this.currentUid);
        });

        this.btnChange.click(() => {
            if (!this.currentUid) return;
            let obj = { uid: this.currentUid }
            obj.name = this.cName.val();
                
            this.changeFn(obj);
        });

        this.checkActiveButtons();
    }

    static create() {
        return new ObjControl();
    }

    changeCount(newCnt) {
        this.count = newCnt;
        this.updatePosition();
    }

    showInfo(mo, cnt) {
        var one_mo = mo;
        if (Array.isArray(mo))
            one_mo = mo[0];
        
        this.currentUid = one_mo.uid;
        this.cName[0].value = one_mo.name ? one_mo.name : "";
        this.cInnerInfo[0].value = JSON.stringify(one_mo);
        this.changeCount(cnt ? cnt : this.count);
        this.checkActiveButtons();
    }

    updatePosition() {
        let pos = this.getObjPositionFn(this.currentUid);
        this.cCounter.text("");
        if (-1 < pos) {
            pos += 1;
            this.cCounter.text( pos + ' из ' + this.count );
        }            
    }

    checkActiveButtons() {

        if (!this.currentUid) {
            enableButton(this.btnPrev, false);
            enableButton(this.btnNext, false);
        } else {
            enableButton(this.btnPrev, this.currentUid != this.getPrevObjectFn(this.currentUid).uid);
            enableButton(this.btnNext, this.currentUid != this.getNextObjectFn(this.currentUid).uid);
        }

        enableButton(this.btnChange, (this.currentUid));
        enableButton(this.btnDelete, (this.currentUid));
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
            case("getPrevObject"):
                this.getPrevObjectFn = cb;
            break;
            case("getNextObject"):
                this.getNextObjectFn = cb;
            break;            
            break;
        }        
    }
}