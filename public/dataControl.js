class DataControl {
    constructor() {
        this.cHeader = $("#dataHeader");
        this.cTable = $("#dataTable");
        this.cCounter = $("#dataCounter");
        
        this.data = [["", "", ""]];
        this.headerStr = "";
        this.headerArr = [];

        this.cHeader.keyup( (e) => {
            if (e.keyCode == 13) {
                this.headerChange(this.cHeader.val());
            }
        });

        this.changeFn = () => {};
        this.deleteFn = () => {};
        this.currentUid = undefined;

        this.btnChange = $("#btnChangeData");
        this.btnDelete = $("#btnDeleteData");

        this.btnChange.click( () => this.applyChange() );
        this.btnDelete.click( () => {
            this.cHeader.val("");
            this._showData([]);            
            this.applyChange();
        });

        this.init();
    }

    static create() {
        return new DataControl();
    }

    init() {        
                    
        this.hotTable = new Handsontable(this.cTable[0], {
            data: this.data,
            stretchH: 'all',
            columnSorting: true,
            rowHeaders: true,
            colHeaders: true,
            filters: true,
            language: 'ru-RU',
            contextMenu: true,
            dropdownMenu: true
        }); 
        
        this._showData(this.data);
    }

    applyChange() {       
        if (!this.currentUid) return;

        this.headerChange(this.cHeader.val());
        let obj = { uid: this.currentUid, headerStr: this.cHeader.val(), headerArr: this.headerArr, data: this._getData()};
            
        this.changeFn(obj);
    }

    headerChange(newHeader) {
        this.headerStr = newHeader;
        let headerArr = newHeader.split(';');

        if ("" == newHeader) {
            this.headerArr = [];
            this.hotTable.updateSettings({colHeaders: true});
        } else {            
            this.hotTable.updateSettings({colHeaders: headerArr})
            this.headerArr = headerArr;
        }

        let dateColumnIdx = this._getDateColumn(headerArr);
        if (0 <= dateColumnIdx) {
            this._updateDateRow(this.data, dateColumnIdx, this.hotTable);
        }
    }

    _getDateColumn(headerArr) {
        let searchArr = ['год', 'year', 'дата'];
        
        for (let i = 0; i < headerArr.length; i++) {
            let words = headerArr[i].split(" ");
            if (!words) continue;
            
            let firstWord = words[0].toLowerCase();
            if (0 <= searchArr.indexOf(firstWord))
                return i;
        }
        return -1;
    }

    _updateDateRow(data, dateColumnIdx, hotTable) {
        let newData = [];
        data.forEach(row => {
            row[dateColumnIdx] = this._getNormalizeStringDate(row[dateColumnIdx]);
        });
        hotTable.loadData(data);
    }    

    _getNormalizeStringDate(value) {
        if (!value) return "";

        let resDate = undefined;

        let month3year2_reg = /\S{3}-(\d{2})/i;
        if (month3year2_reg.test(value)) {
            resDate = new Date(value);

            var yyyy = '1900';
            let parseStr = value.match( month3year2_reg );
            if (parseStr && (0 < parseStr.length)) {
                yyyy = 1900 + parseInt(parseStr[1]);
            }
                            
            if (checkDate(resDate)) {
                resDate = new Date(yyyy, resDate.getMonth(), 1);
            }
        } else {            
            resDate = new Date(value);
        }

        if (checkDate(resDate)) {            
            var dd = resDate.getDate();
            var mm = resDate.getMonth() + 1; //January is 0!
            var yyyy = resDate.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            } 
            if (mm < 10) {
                mm = '0' + mm;
            }             

            return yyyy + '.' + mm + '.' + dd;
        }
    
        return value;        
    }    

    showInfo(obj) {

        if (undefined == obj.uid) {
            this.cHeader[0].value = "";
            this.currentUid = undefined;
            this.checkActiveButtons();
            return;
        }        
        
        this.cCounter.text(obj.name);
        this.currentUid = obj.uid;
        
        this.cHeader[0].value = obj.headerStr ? obj.headerStr : "";
        this.headerStr = obj.headerStr ? obj.headerStr : "";
        this.headerArr = obj.headerArr ? obj.headerArr : [];
                
        this._showData(obj.data);

        if (Array.isArray(this.headerArr) && (0 < this.headerArr.length)) {            
            this.hotTable.updateSettings({colHeaders: this.headerArr})
        } 

        this.checkActiveButtons();
    }

    _getData() {
        let data = this.hotTable.getData();
        if (!data || (0 == data.length)) {
            data = [["", "", ""]];
        }
        return data;
    }

    _showData(data) {
        if ((undefined == data) || (0 == data.length)) {
            data = [["", "", ""]];
        }
        this.data = data;
        this.hotTable.loadData(data);
    }

    on(event, cb) {        
        switch(event) {            
            case("changeObject"):
                this.changeFn = cb;
            break;            
        }
    }

    checkActiveButtons() {

        //enableButton(this.btnChange, (this.currentUid));
        enableButton(this.btnDelete, (this.currentUid));
        //enableButton(this.btnData, (this.currentUid));
    }
}