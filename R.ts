import { UcOptions } from 'ucbuilder/enumAndMore';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';

export const R = {
    demo:{create_ledger: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/demo/create_ledger.uc').create_ledger => intenseGenerator.generateUC('ucdesigner/demo/create_ledger.uc', pera, args) as any,
},},Designer:{util:{assetsExplore: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/Designer/util/assetsExplore.uc').assetsExplore => intenseGenerator.generateUC('ucdesigner/Designer/util/assetsExplore.uc', pera, args) as any,
},fileExplorer: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/Designer/util/fileExplorer.uc').fileExplorer => intenseGenerator.generateUC('ucdesigner/Designer/util/fileExplorer.uc', pera, args) as any,
},},},formDesigner: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/formDesigner.uc').formDesigner => intenseGenerator.generateUC('ucdesigner/formDesigner.uc', pera, args) as any,
},stageContent:{controlInfo: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/controlInfo.uc').controlInfo => intenseGenerator.generateUC('ucdesigner/stageContent/controlInfo.uc', pera, args) as any,
},projHandler: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/projHandler.uc').projHandler => intenseGenerator.generateUC('ucdesigner/stageContent/projHandler.uc', pera, args) as any,
},ucJsonPerameterEditor: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/ucJsonPerameterEditor.uc').ucJsonPerameterEditor => intenseGenerator.generateUC('ucdesigner/stageContent/ucJsonPerameterEditor.uc', pera, args) as any,
},ucLayout: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/ucLayout.uc').ucLayout => intenseGenerator.generateUC('ucdesigner/stageContent/ucLayout.uc', pera, args) as any,
},ucOutput: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/ucOutput.uc').ucOutput => intenseGenerator.generateUC('ucdesigner/stageContent/ucOutput.uc', pera, args) as any,
},ucStyle: {
    load: (pera: UcOptions, ...args: any[]): import('ucdesigner/stageContent/ucStyle.uc').ucStyle => intenseGenerator.generateUC('ucdesigner/stageContent/ucStyle.uc', pera, args) as any,
},},
}