"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dgvManage = void 0;
const fs_1 = require("fs");
const codeFileInfo_1 = require("ucbuilder/build/codeFileInfo");
class dgvManage {
    constructor(main) {
        this.jsnSources = [];
        this.main = main;
        let finfo = new codeFileInfo_1.FileInfo();
        finfo.parse("ucdesigner/stageContent/controlInfo.uc.jsnData.json");
        this.jsnSources = JSON.parse((0, fs_1.readFileSync)(finfo.fullPath, "binary"));
        this.jsnSources.sort((a, b) => {
            let fa = "", fb = "", ca = "", cb = "";
            /*fa = a.first_name; //.toLowerCase();
            fb = b.first_name; //.toLowerCase();
            ca = a.color; //.toLowerCase();
            cb = b.color; //.toLowerCase();*/
            return ca.localeCompare(cb) || fa.localeCompare(fb);
            if (fa < fb || ca < cb) {
                return -1;
            }
            if (fa > fb || ca > cb) {
                return 1;
            }
            return 0;
        });
        // this.main.datagrid1.detail.source.rows = this.jsnSources;
        // this.main.datagrid1.fill({
        //   addFooter: true,
        // });
    }
}
exports.dgvManage = dgvManage;
