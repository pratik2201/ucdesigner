export interface RootPathRow {
    key: string;
    path: string;
    openedFolderList: string[];
}

export const templateType = Object.freeze({
    view: "viewNode",
    edit: "editNode"
});