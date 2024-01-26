import { Template, TemplateNode } from 'ucbuilder/Template.js';
import { TptOptions, templatePathOptions } from 'ucbuilder/enumAndMore';
 

type primary_ELEMENT_MAP = {cmd_clear : HTMLUnknownElement,txt_attrName : HTMLInputElement,txt_attrValue : HTMLInputElement,cmd_remove : HTMLUnknownElement,}
class primary_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): primary_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as primary_ELEMENT_MAP;
    }
}
 

type newitem_ELEMENT_MAP = {cmd_clear : HTMLUnknownElement,txt_attrName : HTMLInputElement,txt_attrValue : HTMLInputElement,cmd_addnew : HTMLUnknownElement,}
class newitem_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): newitem_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as newitem_ELEMENT_MAP;
    }
}


export class Designer extends Template {
        
    public primary:primary_TEMPLATE; 
       
    public newitem:newitem_TEMPLATE; 
   

    constructor(args:IArguments){    
        super();    
        let fargs = arguments[0];
        fargs = fargs[fargs.length-1] as TptOptions;
        let ext = this.extended;
        let tpts = Template.getTemplates.byDirectory(fargs.source.cfInfo.code.fullPath,false);
        
        
        ext._templeteNode = new primary_TEMPLATE(this);
        this.primary = ext._templeteNode as primary_TEMPLATE;
        this.primary.extended.initializecomponent(fargs,tpts['primary'],"primary"); 
       
        
        ext._templeteNode = new newitem_TEMPLATE(this);
        this.newitem = ext._templeteNode as newitem_TEMPLATE;
        this.newitem.extended.initializecomponent(fargs,tpts['newitem'],"newitem"); 
       

        fargs.elementHT.remove();
    }
}