const assetsExplore = require('@ucdesigner:/Designer/util/assetsExplore.uc');
const { pathInfo } = require('ucbuilder/build/common');
const { UcRendarer } = require('ucbuilder/build/UcRendarer.js');
const { codeFileInfo } = require('ucbuilder/build/codeFileInfo');

class previewHandler {
    constructor() {

    }
    /** @type {UcRendarer}  */
    uc_rendar = new UcRendarer();
    /** @param {assetsExplore} main */
    init(main) {
        let _this = this;
        this.main = main;
        //this.main.fileExplorer1.init();
        this.main.records = this.main.fileExplorer1.listview1.lvUI;

        this.main.fileExplorer1.listviewEvents.itemMouseUp.on((index) => {
                if (this.main.lastElement != undefined) this.main.lastElement.delete();
                       
                let row = this.main.fileExplorer1.currentRecord;
                switch (row.type) {
                    case pathInfo.CODEFILE_TYPE.ucHtmlFile:
                        _this.main.currentFilePreview = new codeFileInfo(codeFileInfo.getExtType(row.path));
                        _this.main.currentFilePreview.parseUrl(row.path);
                        _this.uc_rendar.init(_this.main.currentFilePreview, _this.main);
                        let uc = this.uc_rendar.generateUC();
                        this.main.lastElement = uc.ucExtends.self;
                        _this.main.op_target.append(this.main.lastElement);
                        break;
                    case pathInfo.CODEFILE_TYPE.ucTemplateFile:
                        _this.main.currentFilePreview = new codeFileInfo(codeFileInfo.getExtType(row.path));
                        _this.main.currentFilePreview.parseUrl(row.path);
                        this.uc_rendar.init(_this.main.currentFilePreview, _this.main);
                        let tpt = this.uc_rendar.generateTpt();
                        //this.main.lastElement = tpt.extended.generateNode({});
                        //_this.main.op_target.append(this.main.lastElement);
                        break;
                }
            });
        this.main.fileExplorer1.fileExplorerEvents.filterFiles = (row) => {
            row.iconFilePath = this.main.fileExplorer1.manager.iconFilePath.otherFile;
            if (row.path.includes(".uc.")) {
                if (row.path.endsWith(".uc.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucHtmlFile;
                    row.iconFilePath = "stageContent/resource/form.png";
                    return true;
                } else {
                    return false;
                }
            } else if (row.path.includes(".tpt.")) {
                if (row.path.endsWith(".tpt.html")) {
                    row.type = pathInfo.CODEFILE_TYPE.ucTemplateFile;
                    row.iconFilePath = "stageContent/resource/template.png";
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}
module.exports = { previewHandler };