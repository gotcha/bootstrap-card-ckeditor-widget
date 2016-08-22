CKEDITOR.plugins.add('bootstrapcard', {
    // This plugin requires the Widgets System defined in the 'widget' plugin.
    requires: 'widget,dialog,image2',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: 'bootstrapcard',

    // The plugin initialization logic goes inside this method.
    init: function(editor) {

 	CKEDITOR.dialog.add('bootstrapcard', this.path + 'dialogs/bootstrapcard.js');
        var widgetDef = {};
        widgetDef.template = 
            '<div class="bootstrapcard-wrapper card card-gray">' +
                 '<div class="card-block">' +
                      '<h4 class="card-title">Card title</h4>' +
                      '<div class="card-text">Some sample text to make it look like a card</div>' +
                 '</div>'+
            '</div>';
        widgetDef.button = 'Create a card';
        widgetDef.editables = {};
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
        widgetDef.data = bcw_data;
        widgetDef.init = bcw_init;
        widgetDef.dialog = 'bootstrapcard';
        widgetDef.allowedContent = {};
        widgetDef.allowedContent['div'] = { classes: 'bootstrapcard-wrapper,card-block,card-text'};
        widgetDef.allowedContent['h4'] = { classes: 'card-title' }
        widgetDef.requiredContent = 'div(bootstrapcard-wrapper)';
        // Register the bootstrapcard widget.
        editor.widgets.add('bootstrapcard', widgetDef);
    }
});

function bcw_upcast(el) {
    if (el.name == "div" && el.hasClass("bootstrapcard-wrapper")) {
        return el;
    }    
};

function bcw_init() {
    if (this.element.hasClass('card-gray'))
        this.setData('color', 'gray');
    if (this.element.hasClass('card-primary'))
        this.setData('color', 'primary');
    if (this.element.hasClass('card-secondary'))
        this.setData('color', 'secondary');
    if (this.element.hasClass('card-50-50'))
        this.setData('size_left', 'half');
    if (this.element.hasClass('card-25-75'))
        this.setData('size_left', 'fourth');
    var src = '';
    var images = this.element.find('.card-img-top');
    if (images.count() != 0) {
        this.setData('align', 'top');
        var src = extract_image_src(images);
    }
    var images = this.element.find('.card-img-left');
    if (images.count() != 0) {
        this.setData('align', 'left');
        var src = extract_image_src(images);
    }
    var images = this.element.find('.card-img');
    if (images.count() != 0) {
        this.setData('align', 'background');
        var src = extract_image_src(images);
    }
    this.setData('src', src);
    this.setData('align', 'top');
};

var img_src_regexp = /url\(([^)]*)\)/;
function extract_image_src(images) {
    var image = images.getItem(0);
    var style = image.getStyle('background-image');
    var match = img_src_regexp.exec(style);
    if (match != null) {
        return match[0];
    }
    return ''
};

function bcw_data() {
    this.element.removeClass('card-gray');
    this.element.removeClass('card-primary');
    this.element.removeClass('card-secondary');
    this.element.addClass('card-' + this.data.color);
    this.element.removeClass('card-50-50');
    this.element.removeClass('card-25-75');
    this.element.removeClass('card-cover');
    this.element.removeClass('card-inverse');
    images = this.element.find('.card-img-top');
            for (i = 0; i < images.count(); i++) { 
                images.getItem(i).remove();
            }
    images = this.element.find('.card-img-left');
            for (i = 0; i < images.count(); i++) { 
                images.getItem(i).remove();
            }
    images = this.element.find('.card-img');
            for (i = 0; i < images.count(); i++) { 
                images.getItem(i).remove();
            }
    elements = this.element.find('.card-block');
    if (elements.count() != 0) {
        block = elements.getItem(0);
        block.removeClass('card-block');
    }
    elements = this.element.find('.card-img-overlay');
    if (elements.count() != 0) {
        block = elements.getItem(0);
        block.removeClass('card-img-overlay');
    }
    var new_image;
    if (this.data.align == 'top') {
        new_image = CKEDITOR.dom.element.createFromHtml('<div class="card-img-top"></div>');
        block.addClass('card-block');
    } else if (this.data.align == 'left') {
        new_image = CKEDITOR.dom.element.createFromHtml('<div class="card-img-left"></div>');
        block.addClass('card-block');
        if (this.data.size_left == 'half') {
            this.element.addClass('card-50-50');
        }
        if (this.data.size_left == 'fourth') {
            this.element.addClass('card-25-75');
        }
    } else if (this.data.align == 'background') {
        new_image = CKEDITOR.dom.element.createFromHtml('<div class="card-img"></div>');
        this.element.addClass('card-cover');
        this.element.addClass('card-inverse');
        block.addClass('card-img-overlay');
    }
    new_image.setStyle('background-image', "url(" + this.data.src + ")");
    new_image.insertBefore(block);
};
