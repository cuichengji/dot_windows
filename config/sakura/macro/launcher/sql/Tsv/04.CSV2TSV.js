// TSV��"�tCSV�ɕϊ�
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
		convertCsv2Tsv(text)
		));
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// CSV �`����TSV�`���ɕϊ�
function convertCsv2Tsv(text){
	var ret="";
	var l = text.split("\n");
	var len = l.length;
	for (var i=0;i<len;i++){
		if (!l[i]) continue;
		var item = l[i].split(",");
		var jlen = item.length;
		for (var j=0;j<jlen-1;j++) {
			ret+=item[j].replace(/^"|"$/g,'').replace(/""/g,'"')+'\t';		//"
		}
		if (jlen-1 == j) ret+=item[j].replace(/^"|"$/g,'').replace(/""/g,'"')+'\n';	//"
	}
	return ret;
}

