import { existsSync } from "fs";
import { nodeType } from "./fileexplorer.uc";
export type TemplateViewType = "viewNode" | "editNode";
export class pathRecord {
    iconFilePath: string = "";
    nodeName: string = "";
    path: string = "";
    level: number = 0;
    get leftSpace(): number { return this.level * 10; }
    sort: number = 0;
    type: nodeType = 'directory';
    isFolder: boolean = true;
    isOpened: boolean = false;
    children: pathRecord[] = [];
    parent: pathRecord = undefined;
    viewType: TemplateViewType = 'viewNode';
    relevantElement: HTMLElement = undefined;

    get exists(): boolean {
        return existsSync(this.path);
    }
}