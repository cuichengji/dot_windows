// Array -> JSON + Array
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
	
	if (line.length <= 1) return;
	var head = line[0].split("\t");
	var ret = [];
	for (var i=1,l=line.length; i<l ;i++){
		var list = line[i].split("\t");
		ret.push( arrayToJSON(head, list) );
	}
	if (ret.length == 1) return ret[0];
	return "[" + ret.join(", ") + "];";
}

function arrayToJSON(head, data){
	var ret = [];
	var len = head.length > data.length? data.length: head.length;
	for (var i=0; i<len; i++){
		ret.push(head[i]+':"'+data[i]+'"');
	}
	return "{\n\t"+ret.join(",\n\t")+"\n}";
}
