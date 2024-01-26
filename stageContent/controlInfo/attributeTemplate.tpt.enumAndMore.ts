export interface AttrRecord {
    nodeName: string;
    value: string;
    ownerControl?: HTMLElement;
    assigned: number;
}

export const attrRecord: AttrRecord = {
    nodeName: "",
    value: "",
    ownerControl: undefined,
    assigned: 1,
};