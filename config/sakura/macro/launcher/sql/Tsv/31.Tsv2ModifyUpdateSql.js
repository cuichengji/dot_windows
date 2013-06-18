// tsv ���� insert�����쐬

(function(){
	// ���s�R�[�h�����݂̕����ɍ��킹��
	var modifyReturnCode = function(text){
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, ["\r\n","\r","\n"][Editor.GetLineCode()]);
	};
	// tsv -> insert into ...
	var tsvToSqlInsert = function(text, tableName){
		var line=text.split("\n");
		var head;
		var ret = [];
		for (var i=0, len=line.length;i<len;i++){
			if (line[i] == null || line[i].replace(/(^\s+|\s+$)/g,"") == '') continue;
			var item=line[i].split("\t");
			if (i<=0) head = item;
			else {
				var sql = [];
				sql.push("UPDATE "+tableName);
				sql.push("SET");
				
				for (var j=0;j<item.length;j++){
					if (head.length <= j) break;
					var s = "\t" + (j>0 ? "," : "") +  head[j] + " = ";
					if (item[j]) s += "'" + item[j] + "'";
					else s +="NULL";
					sql.push(s);
				}//(
				sql.push(";");
				ret.push(sql.join("\n"));
			}
		}
		return ret.join("\n");
	};
	// vbs �֐�
	var vbs = {
		_control : new ActiveXObject("ScriptControl"),	_lang    : "VBScript",
		_escape  : function(v){
			return((""+v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
		},
		prompt   : function (msg, title, def){
			return(this.eval(['InputBox(','"', this._escape(msg),'", ' ,'"' , this._escape(title || '') , '", ' ,'"' , this._escape(def || '') , '")'].join("") ));
		},
		alert    : function (msg){ this.exec(['MsgBox("', this._escape(msg), '")'].join('')); },
		exec     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode(src);
		},
		eval     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode(["Function Hoge() : Hoge = ", src, " : End Function"].join(""));
			return(this._control.Run("Hoge"));
		}
	};
	
	var e = Editor;
	var table_name = vbs.prompt("�e�[�u��������͂��ĉ������B", "�e�[�u�����̓���", e.ExpandParameter("$C"));
	if (!table_name) return;
	
	//e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		tsvToSqlInsert( text, table_name, false, true)
	));
	//e.MoveHistPrev();
})();

