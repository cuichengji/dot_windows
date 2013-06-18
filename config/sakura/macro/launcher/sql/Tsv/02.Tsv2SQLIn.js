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
		getConvertString(text)
		));
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// �����񐶐�
function getConvertString(text){
	var _line=text.split("\n");
	var matrix = [];
	var regex = /[^\d,]/;
	
	for (var i=0, l=_line.length; i<l ; i++) {
		var list = _line[i].split("\t");
		for (var j=0, ll=list.length; j<ll ;j++) {
			if (i==0) matrix.push([list[j]]);
			else if (matrix.length > j && list[j]) matrix[j].push(list[j]);
			// else -> do nothing
		}
	}
	
	var line = [];
	for (var i=0, l=matrix.length; i<l ; i++){
		var head = matrix[i].shift();
		var str = matrix[i] + "";
		if (regex.test(str)) str = "'" + str.replace(/,/g, "','") + "'";
		line.push( head + " in (" + str + ")");
	}
	
	return line.join("\n");
}

