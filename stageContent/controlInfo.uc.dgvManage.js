const { fileDataBank } = require("@ucdesigner:/../ucbuilder/global/fileDataBank");
const controlInfo = require("@ucdesigner:/stageContent/controlInfo.uc");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { fileInfo } = require("@ucbuilder:/build/codeFileInfo");
const { rootPathHandler } = require("@ucbuilder:/global/rootPathHandler");
class dgvManage {
    
    /** @type {{}[]}  */ 
    jsnSources = [];
    /**  @param {controlInfo} main */
    constructor(main) {
        this.main = main;

        let finfo = new fileInfo()
        finfo.parse('@ucdesigner:/stageContent/controlInfo.uc.jsnData.json');
        this.jsnSources = JSON.parse(readFileSync(finfo.fullPath,"binary"));
       
        this.main.datagrid1.detail.source.rows =  this.jsnSources;
        this.main.datagrid1.fill({ addHeader: true, addFooter: true, });

        let row = this.main.dgvFooter.getAllControls(this.main.datagrid1.footerGridHT1);
        let cntr = this.jsnSources.reduce((summery) => summery + 1,     0);
        row.lbl_total.innerHTML = cntr.toFixed(2);
    }
}
module.exports = { dgvManage };