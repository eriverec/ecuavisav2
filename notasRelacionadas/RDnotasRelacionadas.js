console.log ('cargado');

function notasRelacionadas() {
	if(jQryIter("body.signed-out").size() > 0) {




		var rel = jQryIter(".ly-detail .related-viewer-portlet").html();
		rel = "<div class='notasrelacionadas c_002_001'>" + rel + "</div>";	
		jQryIter(".ly-detail .related-viewer-portlet").empty()

		var content = $('.subheadline');  
		// var midLength = parseInt(content.length/2);
		content.after(rel);

	}
}
		var rel = jQryIter(".ly-detail .related-viewer-portlet").html();
		rel = "<div class='notasrelacionadas c_002_001'>" + rel + "</div>";	
		jQryIter(".ly-detail .related-viewer-portlet").empty()

		var content = $('.subheadline');  
		// var midLength = parseInt(content.length/2);
		content.after(rel);