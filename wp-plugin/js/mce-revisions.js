jQuery(document).ready(function($){
	var has_mce = ( typeof(tinymce) != 'undefined' );

	$('#publish').bind('click.ice_revisions', function(e){
		var content = $('#content'), ed, has_tracking = ( content.val().indexOf('data-username=') != -1 ), stopped = false;

		if ( !has_mce ) {
			if ( has_tracking ) {
				stopped = true;
				e.preventDefault();
				alert('This post contains embedded revision tracking information. To save it without using the Visual Editor, please remove all revision tracking spans. Note: that will permanently remove the current revision tracking information from the post.');
			} else {
				$('#ice-revisions-content').val( content.val() );
			}
		} else {
			ed = tinymce.get('content');

			if ( !ed )
				return;

			if ( ed.isHidden() ) {
				if ( has_tracking ) {
					stopped = true;
					e.preventDefault();
					alert('Please switch to Visual mode before saving.');
				} else {
					$('#ice-revisions-content').val( content.val() );
				}
			}
		}

		if ( stopped ) {
			$(this).removeClass('button-primary-disabled');
			$('#ajax-loading').css('visibility', '');
		}
	});

	$('#wp-fullscreen-save input[type="button"]').attr('onclick', '').bind('click.ice_revisions', function(e) {
		var ed, has_tracking = ( $('#wp_mce_fullscreen').val().indexOf('data-username=') != -1 ), content;

		if ( !has_mce ) {
			if ( has_tracking ) {
				alert('This post contains embedded revision tracking information. To save it without using the Visual Editor, please remove all revision tracking spans. Note: that will permanently remove the current revision tracking information from the post.');
			} else {
				fullscreen.save();
				$('#ice-revisions-content').val( $('#wp_mce_fullscreen').val() );
			}
		} else {
			ed = tinymce.get('wp_mce_fullscreen');

			if ( !ed || ed.isHidden() ) {
				if ( has_tracking ) {
					alert('Please switch to Visual mode before saving.');
				} else {
					fullscreen.save();
					$('#ice-revisions-content').val( $('#wp_mce_fullscreen').val() );
				}
				return;
			}

			fullscreen.save();
			ed.setContent( $('#ice-revisions-content').val() );
		}
	});

	// switching to fullscreen before the MCE instance is initiated, Ice range errors
	if ( has_mce && $('#wp-content-wrap').hasClass('html-active') ) {
		var css = $('<style type="text/css">#wp-content-wrap #qt_content_fullscreen{display:none}</style>')
		$(document.head).append(css);

		$('#content-tmce').one('click', function(){
			css.remove();
		});
	}
});

function ice_toggleshowchanges() {
	var ed = tinymce.get('wp_mce_fullscreen');

	if ( ed )
		ed.execCommand('ice_toggleshowchanges');
}
