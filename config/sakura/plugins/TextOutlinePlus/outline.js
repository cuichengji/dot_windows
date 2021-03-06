Outline.SetTitle( "テキストアウトライン" );	//アウトライン解析タイトルを設定
Outline.SetListType( 3 );	//汎用ツリー

var filterLength = 50;		//章番号でないと判断する文字数
var depth = -1;				//深さ
var markStack = "";			//記号スタック
var line_max = Editor.GetLineCount( 0 );
Outline.AddFuncInfo2( 1, 1, "/*** BOF ***/", 0 );

//編集中文書を1行ずつ読み込んで解析する
for ( var line_no = 1; line_no <= line_max; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.substr(0, line_str.length-1);	//EOLを取り除く

	var pretty = line_str.replace(/^\s*/, "");

	if (/^\s*[0-9０-９]+\.[0-9０-９]+\.[0-9０-９]+\.[0-9０-９]+\.[^0-9０-９]/.test(line_str) && line_str.length < filterLength+6) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 3 );
		depth = 2;
		markStack = "";
	}
	if (/^\s*[0-9０-９]+\.[0-9０-９]+\.[0-9０-９]+\.[^0-9０-９]/.test(line_str) && line_str.length < filterLength+4) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 2 );
		depth = 2;
		markStack = "";
	}
	else if (/^\s*[0-9０-９]+\.[0-9０-９]+\.[^0-9０-９]/.test(line_str) && line_str.length < filterLength+2) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 1 );
		depth = 1;
		markStack = "";
	}
	else if (/^\s*[0-9０-９]+\.[^0-9０-９]/.test(line_str) && line_str.length < filterLength) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 0 );
		depth = 0;
		markStack = "";
	}
	else if (/^\s*[［『【■□▲△▼▽◆◇○◎●§・※☆★第�@-�S�T-�]]/.test(line_str)) {	//本当は共通設定からとりたい…
		var mark = line_str.replace(/^\s*(.).*$/, "$1");
		//連番は同じ種類と見なす
		if (/[�@-�S]/.test(mark)) { mark = "�@"; }
		else if (/[�T-�]]/.test(mark)) { mark = "�T"; }

		if (markStack.length == 0) {
			depth++;
			Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
			markStack = mark;
		} else if (mark == markStack[0]) {
			Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
		} else {
			var idx = markStack.indexOf(mark);
			if (idx < 0) {
				depth++;
				Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
				markStack = mark + markStack;
			} else {
				depth = depth - idx;
				Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
				markStack = markStack.substr(idx);
			}
		}
	}
	else if (/^\s*(目次|前書き|付録|参考|用語|table of contents|preface|appendix|glossary|reference)/i.test(line_str)) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 0 );
	}
}
Outline.AddFuncInfo2( line_max, line_max, "/*** EOF ***/", 0 );

