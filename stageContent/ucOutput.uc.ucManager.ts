import { ucOutput } from "ucdesigner/stageContent/ucOutput.uc";

export class ucManager {
    main: ucOutput;
    constructor() { }
    init(main: ucOutput) {
        this.main = main;
    }
}