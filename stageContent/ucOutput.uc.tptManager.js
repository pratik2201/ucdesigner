/**
 * @typedef {import ("ucdesigner/stageContent/ucOutput.uc")} ucOutput
 */
const { templeteItemRow } = require("ucdesigner/stageContent/ucOutput/tpt_templeteItem.tpt.templeteItemRow");

class tptManager {
    constructor() { }
    /** @type {ucOutput}  */
    main = undefined;
   
    init(main) {
        this.main = main;
        
    }
}
module.exports = { tptManager };