import { existsSync } from "fs";
import { pathInfo } from "ucbuilder/build/common";
export class pathRecord {
    iconFilePath: string = "";
    nodeName: string = "";
    path: string = "";
    level: number = 0;
    get leftSpace(): number { return this.level * 10; }
    sort: number = 0;
    type: pathInfo.TYPE = pathInfo.TYPE.directory;

    isFolder: boolean = true;

    isOpened: boolean = false;
    children: pathRecord[] = [];
    parent: pathRecord | undefined = undefined;

    relevantElement: HTMLElement | undefined = undefined;

    get exists(): boolean {
        return existsSync(this.path);
    }
}