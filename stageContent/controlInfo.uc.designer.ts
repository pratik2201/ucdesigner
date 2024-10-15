import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { Movable } from 'uccontrols/controls/Movable.uc';
import { attributeTemplate } from 'ucdesigner/stageContent/controlInfo/attributeTemplate.tpt';
import { comboBox } from 'uccontrols/controls/comboBox.uc';
import { datagrid } from 'uccontrols/controls/datagrid.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { controlInfo } from './controlInfo.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
        
    public dgvrowTpt: import('ucdesigner/stageContent/controlInfo/attributeTemplate.tpt').attributeTemplate;
         
   
    public comboBox1: import('uccontrols/controls/comboBox.uc').comboBox;
         
   
    public listview1: import('uccontrols/controls/datagrid.uc').datagrid;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: controlInfo) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.movable1 = intenseGenerator.generateUC('uccontrols/controls/Movable.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"movable1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.movable1 
                        }) as any;
        
        
        this.dgvrowTpt = intenseGenerator.generateTPT('ucdesigner/stageContent/controlInfo/attributeTemplate.tpt.ts',{ 
                            parentUc : this, 
                            elementHT : CONTROLS.dgvrowTpt 
                       }) as any;
         
        
       
        this.comboBox1 = intenseGenerator.generateUC('uccontrols/controls/comboBox.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"comboBox1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.comboBox1 
                        }) as any;
         
        
       
        this.listview1 = intenseGenerator.generateUC('uccontrols/controls/datagrid.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"listview1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.listview1 
                        }) as any;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}