const { designerToolsType } = require('@ucdesigner:/enumAndMore.js');
const formDesigner = require('@ucdesigner:/formDesigner.uc.js');
const { designer } = require('./ucStyle.uc.designer.js');
const { rootPathHandler } = require('ucbuilder/global/rootPathHandler');
const { ResourcesUC } = require('ucbuilder/ResourcesUC.js');

class ucStyle extends designer {


    /** @type {formDesigner} */
    main = undefined;

    get activeEditor() { return this.main.tools.activeEditor; }
    get mainNode() { return this.activeEditor.mainNode; }

    refreshText = () => {
        this.editor.getSession().setValue(this.activeEditor.cssContent);
    }
    constructor() { eval(designer.giveMeHug);
        
        let _this = this;

        /** @type {formDesigner}  */
        this.main = ResourcesUC.resources[designerToolsType.mainForm];
        this.main.tools.set(designerToolsType.styler, this);
        this.main.editorEvent.activateEditor.on(this.refreshText);
        this.ucExtends.Events.beforeClose.on(evt => {
            this.main.tools.styleEditor = undefined;
            this.main.editorEvent.activateEditor.off(this.refreshText);
        });
        if (this.activeEditor != undefined)
            this.codeeditor1.value = this.activeEditor.cssContent;
        
        /*
        packaged: false,
        workerPath: null,
        modePath: null,
        themePath: null,
        basePath: "",
        suffix: ".js",
        $moduleUrls: {},
        loadWorkerFromBlob: true,
        sharedPopups: false,
        useStrictCSP: null
        */
        let inf = rootPathHandler.getInfoByAlices('@ucdesigner:');
        ace.config.set('basePath', inf.path+"/ace_files");
        this.editor = ace.edit(this.codeeditor1);
        
      
        this.editor.setTheme("ace/theme/dreamweaver");
        this.editor.session.setMode("ace/mode/scss");
        this.editor.session.setTabSize(4);
        this.editor.setOptions({
            enableBasicAutocompletion: true
        });

        this.ucExtends.self.addEventListener("focusin", (e) => {
            this.editor.getSession().on('change', this.onchangeText);
        });
        this.ucExtends.self.addEventListener("blur", (e) => {
            this.editor.getSession().off('change', this.onchangeText);
        });

        _this.main.editorEvent.activateEditor.on(() => {
            if (this.activeEditor != undefined)
                this.codeeditor1.value = this.activeEditor.cssContent;
        });
    }
    onchangeText = () => {
        let contnet = this.editor.getSession().getValue();
        this.main.tools.activeEditor.onCSSChange(contnet);
    };
    /* iswritting = false;
     update(val) {
         if (this.iswritting) return;
         this.iswritting = true;

         timeoutCall.start(() => {
             if (this.activeEditor!=undefined) {
                 //prg.ref.build.buildFile(this.activeEditor.fInfo);
                 this.activeEditor.Run();
                 this.iswritting = false;
             }
         }, 0);
     }*/
}
module.exports = ucStyle;