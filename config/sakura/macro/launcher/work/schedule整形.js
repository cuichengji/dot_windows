(function(){

	var e = Editor;
	String.prototype.chomp = function() { return this.replace(/[\r\n]+/g,'');};
	String.prototype.lpad = function(n) { 
		var s=new Array(n).join("0")+this;
		return s.substring(s.length-n);
	};
	var TSV = {
		parse : function(text) {
			text = text.replace(/(^|\t)"[^\t]+/g, function(s) {//"
				return s.replace(/\r\n/g, '\n');
			});
			var ret = [];
			var l = text.split("\r\n");
			for (var i=0, ll=l.length; i<ll ;i++){
				var list = l[i].split("\t");
				for (var j=0, lll=list.length; j<lll; j++)
					if (list[j].charAt(0) == '"') list[j] = list[j].replace(/^"|"$/g,'').replace(/""/g,'"');
				ret.push(list);
			}
			return ret;
		}
	};
	var formatter = function( s ) { return s.lpad(2); };
	var fmtdate = function(md) {
		return "2009-"+(md||"").replace(/(\d+)/g, formatter).replace(/\//,'-'); 
	}
	
	//e.MoveHistSet();		// ���ʒu�����p
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
  
	text = e.GetSelectedString(0);//.replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	var tsv = TSV.parse(text);
	var m = [];
	
	for (var i=0, l=tsv.length; i<l; i++) {
		var item = tsv[i];
		if (item && item.length >= 5) {
			//e.TraceOut( i+":"+tsv[i] + "\r\n");
			m.push( [ "["+ fmtdate(item[4]) + "]! " + item[0]+" " + (item[1]+'').chomp(), item[2], fmtdate(item[3]), fmtdate(item[4])+"\n\n" ].join("\n") );
		}
	}
	e.InsText( modifyReturnCode(
		m.join("\n")
	));

	//e.MoveHistPrev();		// ���ʒu�𕜌�
	return;


// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// �����񐶐�
function convertString(text){
	var ret = "";
	return ret;
}

})();
