const { fileDataBank } = require("@ucdesigner:/../ucbuilder/global/fileDataBank");
const controlInfo = require("@ucdesigner:/stageContent/controlInfo.uc");

class dgvManage {
    jsnSources = [
        { "id": 1, "code": 1, "stateName": "JAMMU AND KASHMIR", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}1" },
        { "id": 2, "code": 2, "stateName": "HIMACHAL PRADESH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}2" },
        { "id": 3, "code": 3, "stateName": "PUNJAB", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}3" },
        { "id": 4, "code": 4, "stateName": "CHANDIGARH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}4" },
        { "id": 5, "code": 5, "stateName": "UTTARAKHAND", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}5" },
        { "id": 6, "code": 6, "stateName": "HARYANA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}6" },
        { "id": 7, "code": 7, "stateName": "DELHI", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}7" },
        { "id": 8, "code": 8, "stateName": "RAJASTHAN", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}8" },
        { "id": 9, "code": 9, "stateName": "UTTAR PRADESH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}9" },
        { "id": 10, "code": 10, "stateName": "BIHAR", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}10" },
        { "id": 11, "code": 11, "stateName": "SIKKIM", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}11" },
        { "id": 12, "code": 12, "stateName": "ARUNACHAL PRADESH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}12" },
        { "id": 13, "code": 13, "stateName": "NAGALAND", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}13" },
        { "id": 14, "code": 14, "stateName": "MANIPUR", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}14" },
        { "id": 15, "code": 15, "stateName": "MIZORAM", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}15" },
        { "id": 16, "code": 16, "stateName": "TRIPURA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}16" },
        { "id": 17, "code": 17, "stateName": "MEGHLAYA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}17" },
        { "id": 18, "code": 18, "stateName": "ASSAM", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}18" },
        { "id": 19, "code": 19, "stateName": "WEST BENGAL", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}19" },
        { "id": 20, "code": 20, "stateName": "JHARKHAND", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}20" },
        { "id": 21, "code": 21, "stateName": "ODISHA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}21" },
        { "id": 22, "code": 22, "stateName": "CHATTISGARH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}22" },
        { "id": 23, "code": 23, "stateName": "MADHYA PRADESH", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}23" },
        { "id": 24, "code": 24, "stateName": "GUJARAT", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}24" },
        { "id": 25, "code": 25, "stateName": "DAMAN AND DIU", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}25" },
        { "id": 26, "code": 26, "stateName": "DADRA AND NAGAR HAVELI", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}26" },
        { "id": 27, "code": 27, "stateName": "MAHARASHTRA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}27" },
        { "id": 28, "code": 28, "stateName": "ANDHRA PRADESH(BEFORE DIVISION)", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}28" },
        { "id": 29, "code": 29, "stateName": "KARNATAKA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}29" },
        { "id": 30, "code": 30, "stateName": "GOA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}30" },
        { "id": 31, "code": 31, "stateName": "LAKSHWADEEP", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}31" },
        { "id": 32, "code": 32, "stateName": "KERALA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}32" },
        { "id": 33, "code": 33, "stateName": "TAMIL NADU", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}33" },
        { "id": 34, "code": 34, "stateName": "PUDUCHERRY", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}34" },
        { "id": 35, "code": 35, "stateName": "ANDAMAN AND NICOBAR ISLANDS", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}35" },
        { "id": 36, "code": 36, "stateName": "TELANGANA", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}36" },
        { "id": 37, "code": 37, "stateName": "ANDHRA PRADESH (NEW)", "allowdelete": 0, "alices": "", "guid": "${f.DEFAULT_GUID}37" }
    ];
    /**  @param {controlInfo} main */
    constructor(main) {
        this.main = main;
        this.main.datagrid1.detail.source.rows = this.jsnSources;
       // debugger;
        this.main.datagrid1.detail.Records.fill();
    }
}
module.exports = { dgvManage };