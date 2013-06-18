(function(){
	var e = Editor;
	// �I���Ȃ��̏ꍇ�A�S�s�I��
	if (e.IsTextSelected == 0) e.SelectAll();
	
	// ���s�R�[�h�����݂̕����ɍ��킹��
	var modifyReturnCode = function(text){
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, new Array("\r\n","\r","\n")[Editor.GetLineCode()]);
	};
	
	var strTable = textToHtmlTable( e.GetSelectedString() );
	
	if (strTable.length <= 0) return;
	e.InsText(modifyReturnCode(strTable));
	return;

	// �e�[�u���쐬
	function textToHtmlTable(text){
		var indent = "\t";   // �C���f���g������
		var td_indent = indent + indent;
		//��s���Ƃ̔z��ɕ�����
		var lines = text.replace(/\r\n+/g,"\n").split("\n");
		var table = ["<table>"];
		for (var i=0, len = lines.length; i<len; i++) {
			if (!lines[i]) continue;
			table.push(indent + "<tr>");
			table.push(td_indent + "<td>" + lines[i].toString().replace(/[,\t]/g,"</td>\n"+td_indent + "<td>") + "</td>");
			table.push(indent + "</tr>");
		}
		if (table.length <= 1) return text;
		table.push("</table>");
		return table.join("\n");
	}
})();
