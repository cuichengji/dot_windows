// SQL ���A���t�H�[�}�b�g����
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
	
	text = e.GetSelectedString(0);
	if (!text) return;
	
	var sql = getUnFormatSql(text);
	if (sql.length<=0) return;
	sql+="\n";
	e.InsText( modifyReturnCode(sql) );
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// �����񐶐�
function getUnFormatSql(text){
	return text.replace(/[\r\n]+/g," ")
		.replace(/\s+/g," ")
		.replace(/\s*,\s*/g,", ")
		.replace(/\s*=\s*/g," = ");
}

