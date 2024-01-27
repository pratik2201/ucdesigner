export interface AttrRecord {
    nodeName: string;
    value: string;
    ownerControl?: HTMLElement;
    assigned: boolean;
}

export const attrRecord: AttrRecord = {
    nodeName: "",
    value: "",
    ownerControl: undefined,
    assigned: true,
};