// Sakura-Editor�p�v���O�C��
// {}�I�[�g�C���f���g ver 0.1
// copyright 2010 Moca
CppIndent();

function CppIndent()
{
	var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	if(1 != nCurColumn ){
		return;
	}

	var nCurLine   = parseInt(Editor.ExpandParameter("$y"));
	var nTargetLine = (1 == nCurColumn ? nCurLine - 1: nCurLine);
	var strLine = Editor.GetLineStr( nTargetLine );
	var nIndentDiff = GetIndentDiff(strLine);

	var strLineIndent = strLine.match(/^[ \t�@]*/)[0];

	//�^�u��
	var nTabWidth = Editor.ChangeTabWidth( 0 );
	if( nTabWidth <= 0 ){
		nTabWidth = 1;
	}
	var Opt_IndentMode = Plugin.GetOption("Option", "IndentMode");
	var Opt_IndentWidth = Plugin.GetOption("Option", "IndentWidth");
	var nIndentMode  = (Opt_IndentMode == ""? 0 : parseInt(Opt_IndentMode));
	var nIndentWidth = parseInt(Opt_IndentMode);
	if( nIndentWidth <= 0 ){
		Plugin.SetOption("Option", "IndentWidth", nTabWidth);
		nIndentWidth = nTabWidth;
	}
	// ���ݒ��""��0
	var nIndentPrevData = (Plugin.GetOption("Option", "IndentPrevData") == "1" ? 1 : 0);

	// ���݂̃L�[���擾�����i���Ȃ��̂ŁA
	// �J�[�\���ʒu��1 Offset�̂Ƃ��ɃC���f���g����
	var i;
	var strIns = "";

	if( 1 == nCurColumn ){
		// �C���f���g
		if( 0 == nIndentMode ){
		    // �^�u�C���f���g
			if( 1 <= nIndentDiff ){
				strIns = "\t";
			}
			if( 1 == nIndentPrevData ){
				strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
				strLineIndent = (strLineIndent + strIns).replace(new RegExp(Tab2Sp("\t", nTabWidth), "g"), "\t");
				Editor.InsText( strLineIndent );
			}else{
				Editor.InsText( strLineIndent + strIns );
			}
		}else if( 1 == nIndentMode ){
			// �X�y�[�X�C���f���g
			if( 1 <= nIndentDiff ){
				for( i = 0; i < nIndentWidth; i++ ){
					strIns += " ";
				}
			}
			if( 1 == nIndentPrevData ){
				strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
				Editor.InsText( strLineIndent + strIns );
			}else{
				Editor.InsText( strLineIndent + strIns );
			}
		}else{
			// Tab+�X�y�[�X�C���f���g
			if( 1 <= nIndentDiff ){
				for( i = 0; i < nIndentWidth; i++ ){
					strIns += " ";
				}
			}
			strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
			strLineIndent = (strLineIndent + strIns).replace(new RegExp(Tab2Sp("\t", nTabWidth), "g"), "\t");
			Editor.InsText( strLineIndent );
		}
	}else{
		/*
		// �t�C���f���g
		var nNewWidth = Tab2Sp(strLineIndent, nTabWidth).length - nIndentWidth;
		var newIndent = strLineIndent;
		for( i = strLineIndent.length; 0 <= i; --i ){
			newIndent = strLineIndent.substring(0,i);
			if( Tab2Sp(newIndent, nTabWidth).length == nNewWidth){
				break;
			}
		}
		// ReplaceLine( strLine.replace(strLineIndent,newIndent) );
		Editor.SelectLine(0);
		Editor.InsText( strLine.replace( strLineIndent, newIndent ) );
		*/
	}
}

function Tab2Sp(str, width)
{
	var ret = "";
	var last = 0;
	var tabadd = 0;
	for( var i = 0; i < str.length; i++ ){
		if( 0x09 == str.charCodeAt(i) ){
			ret += str.substring(last, i);
			last = i;
			var add = width - ((i + tabadd) % width);
			tabadd += add - 1;
			for( var t = 0; t < add; t++ ){
				ret += " ";
			}
		}else if( 0x3000 == str.charCodeAt(i) ){
			ret += str.substring(last, i);
			last = i;
			tabadd++;
			ret += " ";
		}
	}
	ret += str.substring(last, i);
	return ret;
}

function ReplaceLine(str)
{
	var lineCode = Editor.GetLineCode();
	if(0 == lineCode){
		// CRLF
		str = str.replace(/\n/g, "\r\n");
	}else if(1 == lineCode){
		// CR
		str = str.replace(/\n/g, "\r");
	}
	Editor.SelectLine(0);
	Editor.InsText( str );
}

// ���@���{}���E�����߂̍s����͊�
// return �C���f���g������
function GetIndentDiff(strLine)
{
	var rePerseItems = /[\/\'\"\{\}]|(@")/; // ' //"
	var nLinePos = 0;
	var strLineSub = strLine;
	var nLineEnd = strLine.length;
	var nCharCode;
	var nlastBracket = 0;

	var nIndent = 0;

	for( ; nLinePos < nLineEnd; ++nLinePos ){
		if(0 < nLinePos){
			strLineSub = strLine.substr(nLinePos);
		}
		retRe = strLineSub.search(rePerseItems);
		if(-1 == retRe){
			break; // ���̍s��
		}
		nLinePos += retRe;
		
		nCharCode = strLine.charCodeAt(nLinePos);
		// '//'
		if( 0x2f == nCharCode ){
			if( 0x2f == strLine.charCodeAt(nLinePos + 1) ){
				break;
			}
			// /*
			if( 0x2a == strLine.charCodeAt(nLinePos + 1) ){
				nPos = strLine.substr(nLinePos + 2).indexOf("*/");
				if( -1 == nPos){
					break;
				}
				nLinePos += nPos + 4;
				continue;
			}
			//�R�R�ɂ����� ���Z(/,/=)�����K�\��(/xxxx/ig)
			// ���Z�q��(�P��-+�ȊO)�A�����Ȃ��̂ŁA���Z�q�����/�͐��K�\��
			var strRegexLeft = strLineSub.substr(0,nLinePos + 1 - (nLineEnd - strLineSub.length));
			// ���O�͉��Z�q�� �܂��͉����Ȃ� �ua + /test/.match(str)[0]�v�Ƃ�������̂�...
			// {}[(,:;=<>!+-*/%&^|?    �����Ⴄ���Z�q .)]'"
			if( (-1 != strRegexLeft.search(/[\{\}\[\(\,\:;=<>!\+\-\*\/%\&\^\|\?][ \t�@\xa0]*\/$/) // \]\)
					|| -1 != strRegexLeft.search(/^[ \t�@\xa0]*\/$/))){
				if(null != (retRe = strLine.substr(nLinePos).match(/^\/(?:\\.|[^\/\r\n])+\/[gimy]{0,4}/)) ){
					var strRegexRight = strLine.substr(nLinePos + retRe[0].length);
					// �E���̉��Z�q���m�F  �Ί��ʋ������܂��킹�� \( \[
					if( -1 != strRegexRight.search(/^[ \t�@\xa0]*([\)\.\]\r\n\{\}\,\:;=<>!\+\-\*\/%\&\^\|\?]|\/\/|\/\*)/) ){
						nLinePos += retRe[0].length - 1;
					} // else ���@ error
				}
			}
		}else
		// '
		if( 0x27 == nCharCode ){
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// \
				if( 0x5c == strLine.charCodeAt(nLinePos) ){
					++nLinePos;
					if( nLinePos < nLineEnd && 
							0x27 == strLine.charCodeAt(nLinePos) ){
						break; // '�I���
					}
				}else if( 0x27 == strLine.charCodeAt(nLinePos) ){
					break; // '�I���
				}
			}
			continue;
		}else
		// "
		if( 0x22 == nCharCode ){
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// \
				if( 0x5c == strLine.charCodeAt(nLinePos) ){
					++nLinePos;
					if( nLinePos < nLineEnd && 
							0x22 == strLine.charCodeAt(nLinePos) ){
						break; // "�I���
					}
				}else if( 0x22 == strLine.charCodeAt(nLinePos) ){
					break;  // "�I���
				}
			}
			continue;
		}else
		// @"
		if(0x40 == nCharCode){
			nLinePos++; // "�̂Ԃ�
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// "
				if( 0x22 == strLine.charCodeAt(nLinePos) ){
					break;  // "�I���
				}
			}
		}else
		// {
		if(0x7b == nCharCode){
			nIndent++;
			nlastBracket = 1;
		}else
		// }
		if(0x7d == nCharCode){
			nIndent--;
			nlastBracket = 2;
		}
	}
	// {
	// "} else {"�n��   // }
	if( nlastBracket == 1 && 0 == nIndent ){
		nIndent++;
	}
	return nIndent;
}
