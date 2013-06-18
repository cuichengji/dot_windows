// Tsv -> Array
var e = Editor;

main();

function main(){
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n");//.replace(/\r/g,"\n");	// ���s��\n�œ���
   
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// ���ʒu�𕜌�
	e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// �����񐶐�
function convertString(text){
	text = text.replace(/\r/g,'\\n').replace(/^"|"$/mg,'').replace(/\n$/g,'');
	var line = text.split("\n");
	
	if (line.length <= 0) return;
	if (line[0].split("\t").length <= 1) return arrayToString(line)+";";
	
	var ret = [];
	for (var i=0,l=line.length; i<l ;i++){
		var list = line[i].split("\t");
		if (list.length <= 0) continue;
		else ret.push( arrayToString(list));
	}
	if (ret.length == 1) return ret[0]+";";
	return "[\n\t" + ret.join(",\n\t") + "\n];";
}

function arrayToString(array){
	return '["'+array.join('", "')+'"]';
}
