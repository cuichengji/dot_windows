// ascii2native ���ǂ�
main();

function main(){
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0);//.replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
   
	text = text.replace(/\\(u[0-9a-fA-F]{4})/g, "%$1"); // \u �� %u
	text = unescape(text);                              // �f�R�[�h

	// ���ʂ����
	e.InsText(text);
	// ���ʒu�𕜌�
	e.MoveHistPrev();
}

