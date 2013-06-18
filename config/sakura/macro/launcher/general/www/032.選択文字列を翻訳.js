// �|��}�N��
// Macro/���e/178 - SakuraEditorWiki ���Q�l�ɍ쐬
// http://sakura.qp.land.to/?Macro%2F%C5%EA%B9%C6%2F178
(function(){//})
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0);//.replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) {
		e.MoveHistPrev();
		return;
	}
	
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// ���ʒu�𕜌�
	e.MoveHistPrev();

	// ���s�R�[�h�����݂̕����ɍ��킹��
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	// �����񐶐�
	function convertString(text){
		var url      = 'http://www.google.co.jp/translate_t?';
		var ajax     = new ActiveXObject('MSXML2.XMLHTTP');   
		
		// �|����@�̔���
		var langpair = 'ja|en';
		if ( text.match(/^[a-zA-Z]/) ) langpair = 'en|ja';

		// POST����Ł[
		ajax.Open( 'POST', url + 'langpair=' + langpair, false );
		ajax.Send( "text=" + encodeURI( text ) );

		//XML�Ƃ��ă��[�h�ł���Ȃ�AinnerText�Ƃ��Ă����ǂ��񂾂낤���ǁB
		var res = ajax.responseText;
		var ret = '';
		if ( res.match( /<div.*id=result_box[^>]+>([^/]+)<\/div>/g ) ) {
			ret = RegExp.$1.replace(/<br>/g,"\n");
			if ( text.match(/[\r\n]+$/)) ret += "\n";
		}
		return ret;
	}
})();
