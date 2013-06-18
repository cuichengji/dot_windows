// tsv ���� insert�����쐬
(function(){
	// vbs �֐�
	var vbs = {
		_control : new ActiveXObject("ScriptControl"),
		_lang    : "VBScript",
		_escape  : function(v){
			return(("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
		},
		prompt   : function (msg, title, def){
			return(this.eval('InputBox(' +
				'"' + this._escape(msg)         + '", ' +
				'"' + this._escape(title || '') + '", ' +
				'"' + this._escape(def   || '') + '")'));
		},
		alert    : function (msg){
			this.exec('MsgBox("' + this._escape(msg) + '")');
		},
		exec     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode(src);
		},
		eval     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
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
	
	// ���s�R�[�h�����݂̕����ɍ��킹��
	var modifyReturnCode = function(text){
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, ["\r\n","\r","\n"][Editor.GetLineCode()]);
	};
	
	e.InsText( modifyReturnCode(
		tsvToSqlInsert( text, table_name, false, false)
		));
	//e.MoveHistPrev();
	return;

	// tsv -> insert into ...
	function tsvToSqlInsert(text, tableName, ignore_header_flag, add_colname_flag){
		var line=text.split("\n");
		var head;
		var ret = "";
		if (!line) return ret;
		
		for (var i=0;i<line.length;i++){
			if (line[i] == null || line[i].replace(/(^\s+|\s+$)/g,"") == '') continue;
			var item=line[i].split("\t");
			if ((!ignore_header_flag || !add_colname_flag) && i<=0) head = item;
			else {
				ret += "INSERT INTO "+tableName;
				if (!ignore_header_flag || !add_colname_flag) ret += ' (' + head.toString() + ')';
				ret += " VALUES(";
				//ret += item.toString() +");\n";
				for (var j=0;j<item.length;j++){
					if(j>0) ret+=", "
					//if (item[j]!=null) ret+="'" + item[j] + "'";
					if (item[j]) ret+="'" + item[j] + "'";
					else ret+="NULL";
				}
				ret += ");\n";
			}
		}
		return ret;
	}

})();
