import { ucOutput } from "ucdesigner/stageContent/ucOutput";

export class ucManager {
    main: ucOutput | undefined;
    constructor() { }
    init(main: ucOutput) {
        this.main = main;
    }
}