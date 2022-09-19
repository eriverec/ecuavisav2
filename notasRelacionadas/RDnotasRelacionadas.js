console.log ('cargado');

function notasRelacionadas() {
	if(jQryIter("body.signed-out").size() > 0) {

		var rel = jQryIter(".ly-detail .related-viewer-portlet").html();
		rel = "<div class='notasrelacionadas c_002_001'>" + rel + "</div>";	
		jQryIter(".ly-detail .related-viewer-portlet").empty()

		var content = $('.DETAIL_TXT .text').find('p');  
		var midLength = parseInt(content.length/2);
		content.eq(midLength).after(rel);

	}
}
