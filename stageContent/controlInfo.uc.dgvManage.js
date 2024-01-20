const { fileDataBank } = require("@ucdesigner:/../ucbuilder/global/fileDataBank");
const controlInfo = require("@ucdesigner:/stageContent/controlInfo.uc");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { fileInfo } = require("ucbuilder/build/codeFileInfo");
const { rootPathHandler } = require("ucbuilder/global/rootPathHandler");
class dgvManage {

    /** @type {{}[]}  */
    jsnSources = [];
    /**  @param {controlInfo} main */
    constructor(main) {
        this.main = main;

        let finfo = new fileInfo()
        finfo.parse('@ucdesigner:/stageContent/controlInfo.uc.jsnData.json');
        this.jsnSources = JSON.parse(readFileSync(finfo.fullPath, "binary"));
        this.jsnSources.sort((a, b) => {
            let fa = '',
                fb = '',
                ca = '',
                cb = '';
            fa = a.first_name;//.toLowerCase();
            fb = b.first_name;//.toLowerCase();
            ca = a.color;//.toLowerCase();
            cb = b.color;//.toLowerCase();
            return ca.localeCompare(cb) || fa.localeCompare(fb);
            if (fa < fb || ca < cb) {
                return -1;
            }
            if (fa > fb || ca > cb) {
                return 1;
            }
            return 0;
        });
        //this.main.datagrid1.colsResizeMng.varName = "gridsizeinfo";
        //this.main.datagrid1.colsResizeMng.cssVar = '';
        this.main.datagrid1.detail.source.rows = this.jsnSources;
        this.main.datagrid1.fill({
            addFooter: true,
        });

        /*let row = this.main.dgvrowTpt.footer.getAllControls(this.main.datagrid1.footerGridHT1);
        let cntr = this.jsnSources.reduce((summery) => summery + 1, 0);
        row.lbl_total.innerHTML = cntr.toFixed(2);*/
    }
}
module.exports = { dgvManage };
