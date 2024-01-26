import { ucOutput } from "ucdesigner/stageContent/ucOutput.uc";
import { templeteItemRow } from "ucdesigner/stageContent/ucOutput/tpt_templeteItem.tpt.templeteItemRow";

export class tptManager {
    main: ucOutput | undefined;
   
    constructor() { }
   
    init(main: ucOutput) {
        this.main = main;
    }
}