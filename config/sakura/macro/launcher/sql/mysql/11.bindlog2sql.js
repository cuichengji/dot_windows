// autobind to sql statement
main();

function main(){
	var e = Editor;
	// ���ʒu�����p
	//e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		getSqlString(text)
		));
	// ���ʒu�𕜌�
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// �����񐶐�
function getSqlString(text){
	var regex = /SQL\[([^]]*)\] BINDS\[([^]]*)\]/;
	text = text.replace(/\n/g, '');
	
	text.match(regex);
	sqltext = RegExp.$1;
	bindtext = RegExp.$2;
	
	// unformat
	sqltext = sqltext.replace(/[ \t]+/g, " ");
	
	binds = bindtext.split(" ");
	for (var i=0; i<binds.length; i++) {
		if (binds[i].length <= 0) continue;
		var param = binds[i].replace(/^[^=]*=/, '');
		sqltext = sqltext.replace('?', "'"+ param +"'");
	}
	return sqltext + "\n";
}

