// �T�N���G�f�B�^�}�N���e���v��
(function(){//})
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
	
	e.TABToSPACE();
	
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	
	e.InsText( modifyReturnCode(text.replace(/ +$/m,'') ));
	// ���ʒu�𕜌�
	e.MoveHistPrev();
	return;
	
	// ���s�R�[�h�����݂̕����ɍ��킹��
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

})();
