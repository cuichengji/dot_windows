// native2ascii ���ǂ�
main();

function main(){
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0);
   
	text = escape(text);                                // �G���R�[�h
	text = text.replace(/%(u[0-9a-fA-F]{4})/g, "\\$1"); // 4 ���̂��̂��� %u �� \u
	text = unescape(text);                              // �c�������̂��f�R�[�h

	// ���ʂ����
	e.InsText(text);
	// ���ʒu�𕜌�
	e.MoveHistPrev();
}

