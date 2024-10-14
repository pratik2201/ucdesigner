import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
/**
 *  code filename must same and case sensitive with classname 
 */
import { formDesigner } from './formDesigner.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    
         
   
    public winFrame1: import('uccontrols/controls/winFrame.uc').winFrame;
    public cmd_built: HTMLButtonElement;
    public cmd_fileExplorer: HTMLButtonElement;
    public cmd_sample1: HTMLButtonElement;
    public cmd_sample2: HTMLButtonElement;
    public cmd_logsession: HTMLButtonElement;
    public cmd_controlInfo: HTMLButtonElement;
    public cmd_layout: HTMLButtonElement;
    public cmd_style: HTMLButtonElement;
    public cmd_jsonPera: HTMLButtonElement;
    public cmd_print: HTMLButtonElement;
    public cmd_ucbrowser: HTMLButtonElement;
    public cmd_deletesesion: HTMLButtonElement;
    public cmd_resetsesion: HTMLButtonElement;
         
   
    public splitter1: import('uccontrols/controls/Splitter.uc').Splitter;
    public container1: HTMLDivElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: formDesigner) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.winFrame1 = intenseGenerator.generateUC('uccontrols/controls/winFrame.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"winFrame1" , 
                                addNodeToParentSession:true,
                            },                           
                            replaceWrapperWith : CONTROLS.winFrame1 
                        }) as any;
          this.cmd_built = CONTROLS.cmd_built as HTMLButtonElement;
          this.cmd_fileExplorer = CONTROLS.cmd_fileExplorer as HTMLButtonElement;
          this.cmd_sample1 = CONTROLS.cmd_sample1 as HTMLButtonElement;
          this.cmd_sample2 = CONTROLS.cmd_sample2 as HTMLButtonElement;
          this.cmd_logsession = CONTROLS.cmd_logsession as HTMLButtonElement;
          this.cmd_controlInfo = CONTROLS.cmd_controlInfo as HTMLButtonElement;
          this.cmd_layout = CONTROLS.cmd_layout as HTMLButtonElement;
          this.cmd_style = CONTROLS.cmd_style as HTMLButtonElement;
          this.cmd_jsonPera = CONTROLS.cmd_jsonPera as HTMLButtonElement;
          this.cmd_print = CONTROLS.cmd_print as HTMLButtonElement;
          this.cmd_ucbrowser = CONTROLS.cmd_ucbrowser as HTMLButtonElement;
          this.cmd_deletesesion = CONTROLS.cmd_deletesesion as HTMLButtonElement;
          this.cmd_resetsesion = CONTROLS.cmd_resetsesion as HTMLButtonElement;
         
        
       
        this.splitter1 = intenseGenerator.generateUC('uccontrols/controls/Splitter.uc.ts',{ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"splitter1" , 
                                addNodeToParentSession:true,
                            },                           
                            replaceWrapperWith : CONTROLS.splitter1 
                        }) as any;
          this.container1 = CONTROLS.container1 as HTMLDivElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
        ucExt.Events.loaded.fire();
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}