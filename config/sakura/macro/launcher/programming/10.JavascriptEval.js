// javascript eval
main();

function main(){
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
   
	try {
		e.InsText( modifyReturnCode(
			convertString(text)
			));
	} catch (exp) {
	}
	// ���ʒu�𕜌�
	e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// �����񐶐�
function convertString(text){
	return eval(text);
}

