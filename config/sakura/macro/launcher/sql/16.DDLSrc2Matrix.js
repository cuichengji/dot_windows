// SPC -> Tab
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
	return exchangeTsvMatrix(text.replace(/^\n/g,"").replace(/NOT NULL/ig,"").replace(/ +/g,"\t"));
}

// �����񐶐�
function exchangeTsvMatrix(text){
	var line=text.split("\n");
	var strlist = new Array();
	for (var i=0; i<line.length; i++) {
		var l=line[i].split("\t");
		if (i==0) {
		}
		for (var j=0; j<l.length; j++) {
			if (i==0) strlist.push( l[j] );
			else if (strlist.length <= j) {
				var tmp = "";
				for (var k=0; k<j; k++) tmp += "\t";
				strlist.push(tmp);
			} else strlist[j]+="\t"+l[j];
		}
	}
	
	var ret = "";
	for (var i=0; i<strlist.length; i++){
		ret += strlist[i]+"\n";
	}
	return ret;
}
