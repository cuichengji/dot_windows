// || <=> & ���ݕϊ�
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

function convertString(text) {
	var ret = text;
	ret = ret.replace(/[ \t]*\|\|[ \t]*/g," & ");
	ret = ret.replace(/--.+/gm,"");		// �R�����g�s�폜
	return ret;
}
