var defineBoootstrapCardDialog = function() {
   var registerBootstrapDialog = function(image2DialogDefinition) {
        var bootstrapcardDialogDefinition = function(editor) {
            definition = image2DialogDefinition(editor);
            definition.title = 'Card properties';
            return definition;
        };
        CKEDITOR.dialog.add('bootstrapcard', bootstrapcardDialogDefinition);
    };
    
    var image2DialogDefinition = CKEDITOR.dialog._.dialogDefinitions.image2;

    if ( typeof image2DialogDefinition == 'function' ) {
        registerBootstrapDialog(image2DialogDefinition);
    } else if ( image2DialogDefinition == 'failed' ) {
        throw new Error( '[CKEDITOR.dialog.openDialog] Dialog "image2" failed when loading definition.' );

    } else if ( typeof image2DialogDefinition == 'string' ) {
        
        CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( image2DialogDefinition ),
            function() {
                var image2DialogDefinition = CKEDITOR.dialog._.dialogDefinitions[ 'image2' ];
                // In case of plugin error, mark it as loading failed.
                if ( typeof image2DialogDefinition != 'function' )
                    CKEDITOR.dialog._.dialogDefinitions[ 'image2' ] = 'failed';
                registerBootstrapDialog(image2DialogDefinition);
            }, this, 0, 1 );
    };
};


CKEDITOR.plugins.add( 'bootstrapcard', {
    // This plugin requires the Widgets System defined in the 'widget' plugin.
    requires: 'widget,dialog,image2',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: 'bootstrapcard',

    // The plugin initialization logic goes inside this method.
    init: function( editor ) {

        defineBoootstrapCardDialog();
        var widgetDef = CKEDITOR.tools.prototypedCopy( editor.widgets.registered.image );
        var origInit = widgetDef.init;
        widgetDef.init = function() {
            origInit.apply(this);
            this.wrapper.removeClass('cke_image_nocaption');
            resizers = this.wrapper.find('.cke_image_resizer');
            for (i = 0; i < resizers.count(); i++) { 
                resizers.getItem(i).removeClass('cke_image_resizer');
            }
        }
        widgetDef.template = 
            '<div class="bootstrapcard-wrapper card">' +
                 '<img class="card-img-top" alt="" src="" />' +
                 '<div class="card-block">' +
                      '<h4 class="card-title">Card title</h4>' +
                      '<div class="card-text">Some sample text to make it look like a card</div>' +
                 '</div>'+
            '</div>';
        widgetDef.button = 'Create a bootstrap card';
        widgetDef.editables["bootstrapcard_title"] = {
            // Define CSS selector used for finding the element inside widget element.
            selector: '.card-title',
            // Define content allowed in this nested editable. Its content will be
            // filtered accordingly and the toolbar will be adjusted when this editable
            // is focused.
                allowedContent: 'br'
            };
        widgetDef.editables["bootstrapcard_text"] = {
            selector: '.card-text',
            allowedContent: 'br a p'
        };
        widgetDef.upcast = bcw_upcast;
        widgetDef.dialog = 'bootstrapcard';
        widgetDef.allowedContent.div['classes'] = 'bootstrapcard-wrapper,card-block,card-text';
        widgetDef.allowedContent['h4'] = { classes: 'card-title' }
        widgetDef.requiredContent = 'div(bootstrapcard-wrapper)';
        // Register the bootstrapcard widget.
        editor.widgets.add( 'bootstrapcard', widgetDef );
    }
} );

function bcw_upcast(el) {
    if (el.name == "div" && el.hasClass("bootstrapcard-wrapper")) {
        return el;
    }    
};

CKEDITOR.on( 'dialogDefinition', function( ev ) {
    // Take the dialog name and its definition from the event
    // data.
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;

    if ( dialogName == 'bootstrapcard' ) {
        var infoTab = dialogDefinition.getContents( 'info' );
        // Remove hbox with, width, height, lock
        infoTab.elements.splice(2,1);
        // Remove src events as they depend on width and heigh
        var src = infoTab.get('src');
        src.onKeyUp = function() {};
        src.onChange = function() {};
        src.label = 'Image src';
        var align = infoTab.get('align');
        align.items = [
            [ 'Top', 'top' ],
            [ 'Bottom', 'bottom' ]
        ];
    }
});
