/**
 * @typedef {import ("ucdesigner/stageContent/ucOutput.uc")} ucOutput
 */

class ucManager {
    constructor() { }
    /** @type {ucOutput}  */
    main = undefined;
    init(main) {
        this.main = main;

    }
}
module.exports = { ucManager };