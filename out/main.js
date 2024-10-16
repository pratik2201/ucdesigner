"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDesigner = void 0;
//import { intenseGenerator } from 'ucbuilder/intenseGenerator';
//console.log('~~~:['+ __dirname +']');
console.log('abc');
const ct = __importStar(require("uccontrols/main"));
const register_1 = __importDefault(require("ucbuilder/register"));
const intenseGenerator_1 = require("ucbuilder/intenseGenerator");
const path_1 = __importDefault(require("path"));
register_1.default.registar({
    // srcDir: __dirname,
    outDir: "/out/",
    rootDir: path_1.default.dirname(__dirname),
    /*html: __dirname,
    style: __dirname,
    perameters: __dirname,
    designer:__dirname,
    designerSrc:__dirname,
    code: __dirname,
    codeSrc: __dirname,*/
});
const startDesigner = (sessionFilePath = "") => {
    let s = ct;
    const frm = intenseGenerator_1.intenseGenerator.generateUC('ucdesigner/formDesigner.uc.js', {
        wrapperHT: document.body,
        session: { loadBySession: true }
    }, sessionFilePath);
    frm.winFrame1.showDialog();
};
exports.startDesigner = startDesigner;
