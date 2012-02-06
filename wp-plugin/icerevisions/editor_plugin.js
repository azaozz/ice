(function() {
	tinymce.create('tinymce.plugins.IceRevisionsPlugin', {

		init: function(ed, url) {
			var self = this;

			// use another textarea to submit the unmodified content then remove all tracking tags from the content
			ed.onInit.add(function(ed) {
				var DOM = tinymce.DOM, buttons, div, form = DOM.get('post'), ice_settings = ed.getParam('ice', {});

				if ( !form )
					return;

				div = DOM.create( 'div', {'class':'hidden'}, '<textarea name="ice-revisions-content" id="ice-revisions-content"></textarea>' );
				form.appendChild(div);

				buttons = DOM.select('#wp-fullscreen-save input[type="button"], #publish');

				DOM.bind(
					buttons,
					'mousedown',
					function() {
						var content;

						if ( ( ed.id != 'content' && ed.id != 'wp_mce_fullscreen' ) || !ice_settings.isTracking || ed.isHidden() )
							return;

						content = ed.getContent();
						if ( ed.getParam('wpautop', true) && typeof(switchEditors) != 'undefined' )
							content = switchEditors.pre_wpautop( content );

						DOM.get('ice-revisions-content').value = content;

						// remove change tracking spans
						ed.execCommand('iceacceptall');
					}
				);
			});

			// init Ice after MCE is ready and content is loaded and re-init Ice when switching from HTML to Visual mode
			ed.onLoadContent.add(function(ed, o) {
				if ( ed.id != 'content' && ed.id != 'wp_mce_fullscreen' ) // only on the main editor 
					return;

				if ( ed.isHidden() )
					return;

				if ( o.initial )
					setTimeout( function(){
						ed.execCommand('initializeice');
					}, 1000);
				else
					ed.execCommand('ice_initenv');
			});
		}
	});

	tinymce.PluginManager.add('icerevisions', tinymce.plugins.IceRevisionsPlugin);
})();
