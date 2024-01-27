import { FileDataBank } from "ucbuilder/global/fileDataBank";
import { controlInfo } from "ucdesigner/stageContent/controlInfo.uc";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { FileInfo } from "ucbuilder/build/codeFileInfo";
import { rootPathHandler } from "ucbuilder/global/rootPathHandler";

export class dgvManage {
  jsnSources: {}[] = [];
  main: controlInfo;

  constructor(main: controlInfo) {
    this.main = main;

    let finfo = new FileInfo();
    finfo.parse("ucdesigner/stageContent/controlInfo.uc.jsnData.json");
    this.jsnSources = JSON.parse(readFileSync(finfo.fullPath, "binary"));
    this.jsnSources.sort((a, b) => {
      let fa = "",
        fb = "",
        ca = "",
        cb = "";
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