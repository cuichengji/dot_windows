// mysql �̏o�͌��ʂ� TSV�Ƀt�H�[�}�b�g����
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
	
	var sql = getConvertText(text);
	if (sql.length<=0) return;
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
function getConvertText(text){
	text = text.replace(/([\r\n]+\|[^\r\n]+[^ \|\r\n])[\r\n]+/g,'$1').replace(/^[^\n\+\|].+/gm,'');
	return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/([^\|][^ \|])[\r\n]+/g,'$1')
			.replace(/^\| +| +\|$/gm,'').replace(/ *\| +/gm,"\t").replace(/^\n/m,'');		// �J�������̉��s�͖�������
//	return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/([^\|][^ \|])[\r\n]+/g,'$1')
//			.replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// �J�������̉��s�͖�������
	//return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// �J�������̉��s�͍l�����Ȃ�
	//return text.replace(/([^\|][^ ])[\r\n]+/g,'$1\r').replace(/^[\+\-\r\n]+$/gm,'').replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// �J�������̉��s��CR�ɂ���
}

