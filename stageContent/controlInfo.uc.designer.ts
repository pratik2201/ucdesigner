import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { controlInfo } from './controlInfo.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public movable1: import('uccontrols/controls/Movable.uc').Movable;
        
    public dgvrowTpt: import('ucdesigner/stagecontent/controlinfo/attributeTemplate.tpt').attributeTemplate;
         
   
    public comboBox1: import('uccontrols/controls/combobox.uc').comboBox;
         
   
    public listview1: import('uccontrols/controls/datagrid.uc').datagrid;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: controlInfo) {
         //let fargs = argsLst[0];
        //let args = fargs[fargs.length - 1];
        let args = argsLst[argsLst.length - 1] as UcOptions;
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
                            wrapperHT : CONTROLS.movable1 
                        }) as any;
        
        
        this.dgvrowTpt = intenseGenerator.generateTPT('ucdesigner/stagecontent/controlinfo/attributeTemplate.tpt.ts',{ 
                            parentUc : this, 
                            elementHT : CONTROLS.dgvrowTpt 
                       }) as any;
         
        
       
        this.comboBox1 = intenseGenerator.generateUC('uccontrols/controls/combobox.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"comboBox1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.comboBox1 
                        }) as any;
         
        
       
        this.listview1 = intenseGenerator.generateUC('uccontrols/controls/datagrid.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"listview1" , 
                                addNodeToParentSession:true,
                            },                           
                            wrapperHT : CONTROLS.listview1 
                        }) as any;

        ucExt.finalizeInit(args);
    }
}