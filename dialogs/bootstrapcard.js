'use strict';

CKEDITOR.dialog.add( 'bootstrapcard', function( editor ) {

	// RegExp: 123, 123px, empty string ""
	var regexGetSizeOrEmpty = /(^\s*(\d+)(px)?\s*$)|^$/i,

		lang = editor.lang.image2,
		commonLang = editor.lang.common,

		// Editor instance configuration.
		config = editor.config,

		// Content restrictions defined by the widget which
		// impact on dialog structure and presence of fields.
		features = editor.widgets.registered.image.features,
                doc, preLoader, widget;



	// Creates a function that pre-loads images. The callback function passes
	// [image, width, height] or null if loading failed.
	//
	// @returns {Function}
	function createPreLoader() {
		var image = doc.createElement( 'img' ),
			listeners = [];

		function addListener( event, callback ) {
			listeners.push( image.once( event, function( evt ) {
				removeListeners();
				callback( evt );
			} ) );
		}

		function removeListeners() {
			var l;

			while ( ( l = listeners.pop() ) )
				l.removeListener();
		}

		// @param {String} src.
		// @param {Function} callback.
		return function( src, callback, scope ) {
			addListener( 'load', function() {
				// Don't use image.$.(width|height) since it's buggy in IE9-10 (#11159)
				var dimensions = getNatural( image );

				callback.call( scope, image, dimensions.width, dimensions.height );
			} );

			addListener( 'error', function() {
				callback( null );
			} );

			addListener( 'abort', function() {
				callback( null );
			} );

			image.setAttribute( 'src',
				( config.baseHref || '' ) + src + '?' + Math.random().toString( 16 ).substring( 2 ) );
		};
	}

	var hasFileBrowser = !!( config.filebrowserImageBrowseUrl || config.filebrowserBrowseUrl ),
		srcBoxChildren = [
			{
				id: 'src',
				type: 'text',
				label: 'Image URL',
				setup: function( widget ) {
					this.setValue( widget.data.src );
				},
				commit: function( widget ) {
					widget.setData( 'src', this.getValue() );
				},
				validate: CKEDITOR.dialog.validate.notEmpty( lang.urlMissing ),
                                onChange: function( evt ) {
                                                                        var dialog = this.getDialog(), 
                                                                        value = evt.data.value,
                                                                        elem = dialog.getContentElement('info', 'align');   
                                                                        if (value == '') {
                                                                                elem.disable();
                                                                        } else {
                                                                               elem.enable();
                                                                        }
                                                                },
                                onKeyUp: function( evt ) {
                                                                        var dialog = this.getDialog(), 
                                                                        value = this.getValue(),
                                                                        alignElem = dialog.getContentElement('info', 'align'),
                                                                        sizeElem = dialog.getContentElement('info', 'align');   
                                                                        if (value == '') {
                                                                               alignElem.disable();
                                                                               sizeElem.disable();
                                                                        } else {
                                                                               alignElem.enable();
                                                                        }
                                                                }
			}
		];


	// Render the "Browse" button on demand to avoid an "empty" (hidden child)
	// space in dialog layout that distorts the UI.
	if ( hasFileBrowser ) {
		srcBoxChildren.push( {
			type: 'button',
			id: 'browse',
			// v-align with the 'txtUrl' field.
			// TODO: We need something better than a fixed size here.
			style: 'display:inline-block;margin-top:14px;',
			align: 'center',
			label: commonLang.browseServer,
			hidden: true,
			filebrowser: 'info:src'
		} );
	}

	return {
		title: 'Card',
		minWidth: 250,
		minHeight: 100,
		onLoad: function() {
			// Create a "global" reference to the document for this dialog instance.
			doc = this._.element.getDocument();

			// Create a pre-loader used for determining dimensions of new images.
			preLoader = createPreLoader();
		},
		onShow: function() {
			// Create a "global" reference to edited widget.
			widget = this.widget;
		},
		contents: [
			{
				id: 'info',
				label: lang.infoTab,
				elements: [
					{
						type: 'hbox',
						id: 'colorbox',
						children: [
							{
								id: 'color',
								type: 'select',
								items: [
									[ 'Gray', 'gray' ],
									[ 'Primary', 'primary' ],
									[ 'Secondary', 'secondary' ],
								],
								label: 'Card color',
								setup: function( widget ) {
									this.setValue( widget.data.color );
								},
								commit: function( widget ) {
									widget.setData( 'color', this.getValue() );
								}
							}
						]
					},
					{
						type: 'vbox',
						padding: 0,
						children: [
							{
								type: 'hbox',
								widths: [ '100%' ],
								children: srcBoxChildren
							}
						]
					},
					{
						type: 'hbox',
						id: 'alignment',
						requiredContent: features.align.requiredContent,
						children: [
							{
								id: 'align',
								type: 'select',
								items: [
									[ commonLang.alignTop, 'top' ],
									[ commonLang.alignLeft, 'left' ],
									[ 'Background', 'background' ],
								],
								label: 'Image alignment',
								setup: function( widget ) {
									this.setValue( widget.data.align );
								},
								commit: function( widget ) {
									widget.setData( 'align', this.getValue() );
								},
                                                                onChange: function( evt ) {
                                                                        var dialog = this.getDialog(), 
                                                                        elem = dialog.getContentElement('info', 'size');   
                                                                        if (evt.data.value == 'left') {
                                                                                elem.enable();
                                                                        } else {
                                                                               elem.disable();
                                                                               elem.setValue('');
                                                                        }
                                                                }
							}
						]
					},
					{
						type: 'hbox',
						id: 'sizebox',
						requiredContent: 'img',
						children: [
							{
								id: 'size',
								type: 'select',
								items: [
									[ 'None', '' ],
									[ 'Fourth', 'fourth' ],
									[ 'Half', 'half' ],
								],
								label: 'Size',
								setup: function( widget ) {
									this.setValue( widget.data.size_left );
								},
								commit: function( widget ) {
									widget.setData( 'size_left', this.getValue() );
								}
							}
						]
					}
				]
			}
		]
	};
} );
