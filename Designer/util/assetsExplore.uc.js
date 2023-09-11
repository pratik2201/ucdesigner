const { designer } = require('./assetsExplore.uc.designer.js');
const { previewHandler } = require('@ucdesigner:/Designer/util/assetsExplore.uc.previewHandler.js');
const { spliterType } = require('@uccontrols:/controls/Splitter.uc.enumAndMore.js');
const { splitHandler } = require('@ucbuilder:/global/splitHandler');
class assetsExplore extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
        // this.singleSplitter1.type = spliterType.COLUMN;
        this.splHandler = new splitHandler();
        this.splHandler.uc = this;
        this.splHandler.spliterType = 'columns';
        this.splHandler.init(this.container, this.container);
    }
    previewHandle = new previewHandler();

    /** @type {HTMLElement}  */
    lastElement = undefined;
    /** @type {codeFileInfo}  */
    currentFilePreview = undefined;
    init() {

        let _this = this;
        this.previewHandle.init(_this);
        this.fileExplorer1.fillRows();
    }
}
module.exports = assetsExplore;