
/*!
	C#�֐��ꗗ�A�E�g���C����� for �T�N���G�f�B�^ �v���O�C��
	Copyright(C) 2010-2013 Moca All Rights Reserved.
	@ver 0.1
	
	0.1 :���� 2013.04.28
*/
var g_opt = {};
var g_bLoadPluginOption = true;
/*
	@param nDepth     ���[�g�̊K�w(0�ōŏ�)
	@param first_line ��͑Ώۂ̐擪�s(1�J�n)
	@param last_line  ��͑Ώۂ̍ŏI�s(1�J�n)
	@param begin_colm �擪�s�̉�͊J�n���ʒu(0�J�n)
	@param end_colm   �ŏI�s�̉�͏I�����ʒu(0�J�n) + 1
	@note
		�R�����g,������,���K�\���Ή�,Tree�\��
	@return boolean ���true��������
*/
function csharp_OutlineExec(nDepth, first_line, last_line, begin_colm, end_colm)
{

	var reClass = /(^|[^~@\w\u007f-\ufffe])class[\u0020\u0009]/;
	var reEnum = /(^|[^~@\w\u007f-\ufffe])enum[\u0020\u0009]/;
	var reStruct = /(^|[^~@\w\u007f-\ufffe])strcut[\u0020\u0009]/;
	var reInterface = /(^|[^~@\w\u007f-\ufffe])interface[\u0020\u0009]/;
	var reSetGet = /(^|[^~@\w\u007f-\ufffe])(get|set|add|remove)[\u0020\u0009\{\u000a\u000d]/; // }
	var reSetGet2 = /(^|[^~@\w\u007f-\ufffe])(get|set|add|remove)[\u0020\u0009]*;/;
	var reGet = /(^|[^~@\w\u007f-\ufffe])get[\u0020\u0009\{\u000a\u000d]/; // }
	var reSet = /(^|[^~@\w\u007f-\ufffe])set[\u0020\u0009\{\u000a\u000d]/; // }
	var reAdd = /(^|[^~@\w\u007f-\ufffe])add[\u0020\u0009\{\u000a\u000d]/; // }
	var reNamespace = /(^|[^~@\w\u007f-\ufffe])namespace[\u0020\u0009\{]/; // }
	var rePerseItems = /[\/'"\{\}\(\):;=]|@"|\b(class|namespace|enum|strcut|interface|get|set)\b/; // ' //"

	var nLineNum;
	var strLine;
	var nLineEnd;

	var nMode = 2; // 0:���� 1:�����s�R�����g 4:' 5:" 6:@"
	var nMode2 = 0; // 0:�ʏ� 1:( 2:) 3::
	var nCallNest = 0;
	var nNest = []; // �֐����Ƃ�{}�̃l�X�g���x��
	var nNestLevel = [];
	var classNameNest = []; // 
	var nFuncNest = 0; // {}�̃l�X�g���x��
	var nFuncNest2 = 0; // ����Class�ɂȂ��Ă���ǉ��̃l�X�g���x��
	var nFuncNestLevel = -1;
	var bAddFunc = false;

	var strLineSub;
	var nCharCode;
	var nLinePos;
	var strAddTitle;
	var nPos = -1;
	var retRe = null;

	for( nLineNum = first_line; nLineNum <= last_line; ++nLineNum ){
		strLine = Editor.GetLineStr( nLineNum );
		if(strLine == null){
			return false;
		}

		nLinePos = 0;
		nLineEnd = strLine.length;
		if(nLineNum == last_line){
			strLine = strLine.substr(0,end_colm);
		}
		if(nMode == 1){
			if(-1 != (nPos = strLine.indexOf("*/"))){
				nMode = 0;
				nLinePos = nPos + 2;
			}else{
				continue; // ���̍s��
			}
		}
		// ���肪�������Ƃ�1�s�ڂ� nMode == 1�łȂ��̂Ō��ɂ�����
		if(nLineNum == first_line && 0 < begin_colm ){
			nLinePos = begin_colm - 1;
		}

		strLineSub = strLine;
		for( ; nLinePos < nLineEnd; ++nLinePos ){
			if(nMode == 4){
				for(; nLinePos < nLineEnd; ++nLinePos){
					// \
					if( 0x5c == strLine.charCodeAt(nLinePos) ){
						if( nLinePos < nLineEnd ){
							++nLinePos;
						}
					}else if( 0x27 == strLine.charCodeAt(nLinePos) ){
						++nLinePos;
						nMode = 0;
						break; // '�I���
					}
				}
			}else
			if(nMode == 5){
				for(; nLinePos < nLineEnd; ++nLinePos){
					// \
					if( 0x5c == strLine.charCodeAt(nLinePos) ){
						if( nLinePos < nLineEnd ){
							++nLinePos;
						}
					}else if( 0x22 == strLine.charCodeAt(nLinePos) ){
						++nLinePos;
						nMode = 0;
						break;  // "�I���
					}
				}
			}else
			if(nMode == 6){
				for(; nLinePos < nLineEnd; ++nLinePos){
					// "
					if( 0x22 == strLine.charCodeAt(nLinePos) ){
						if( 0x22 == strLine.charCodeAt(nLinePos + 1) ){
							if( nLinePos < nLineEnd ){
								++nLinePos;
							}
						}else{
							++nLinePos;
							nMode = 0;
							break;  // "�I���
						}
					}
				}
			}else{
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
						break; // ���̍s��
					}
					// /*
					if( 0x2a == strLine.charCodeAt(nLinePos + 1) ){
						//�s���͂����Ō���
						nPos = strLine.substr(nLinePos + 2).indexOf("*/");
						if( -1 == nPos){
							nMode = 1;// �R�����g���[�h
							break; // ���̍s��
						}
						nLinePos += nPos + 4;
						continue;
					}
				}else
				// '
				if( 0x27 == nCharCode ){
					nMode = 4;
					continue;
				}else
				// "
				if(0x22 == nCharCode){
					nMode = 5;
					continue;
				}else
				// @"
				if(0x40 == nCharCode && 0x22 == strLine.charCodeAt(nLinePos+1)){
					++nLinePos;
					nMode = 6;
					continue;
				}else
				// (
				if(0x28 == nCharCode){
					// 
					if(nFuncNestLevel == nFuncNest && nMode2 == 0){
						strAddTitle = strLine.substr(0, nLinePos + 1);
						var bMatchFunc = false;
						var nAddPos = -1;
						if( /\boperator(\s*)([^\s]+)(\s*)\($/.test(strAddTitle) ){
							var re = strAddTitle.match(/\boperator(\s*)([^\(\)]+)(\s*)\($/);
							nAddPos = nLinePos - re[0].length + 1;
							strAddTitle = "operator" + re[2];
						}else if( /([~@\w\u007f-\ufffe]+)((<\s*[@\w\u007f-\ufffe\s,]+\s*>)?)(\s*)\($/.test(strAddTitle) && !(/(^|[\s]+)delegate[\s]+/.test(strAddTitle)) ){
							var re = strAddTitle.match(/([~@\w\u007f-\ufffe]+)(<[<>~@\w\u007f-\ufffe\s\s,]+>)?(\s*)\($/);
							nAddPos = nLinePos - re[0].length + 1;
							strAddTitle = re[1];
						}
						if( nAddPos != -1 ){
							nMode2 = 1;
							nCallNest = 1;
							bAddFunc = true;
							if( g_opt.vs == 0 ){
								AddFuncInfoBoth( nLineNum, nAddPos, strAddTitle, nNest.length + nDepth );
							}else{
								var s = "";
								if( (g_opt.vs == 1 && g_opt.sc == false) || g_opt.vs == 2 ){
									var sep = (g_opt.vs == 1?".":"::");
									for(var i = 0; i < classNameNest.length && "" != classNameNest[classNameNest.length - 1 - i]; i++ ){
										s = classNameNest[classNameNest.length - 1 - i] + sep + s;
									}
								}
								s += strAddTitle;
								if( g_opt.vs != 2 ){
									AddFuncInfoBoth( nLineNum, nAddPos, s, nNest.length + nDepth );
								}else{
									AddFuncInfoBoth( nLineNum, nAddPos, s, nNest.length + nDepth, 2 );
								}
								s = null;
							}
							strAddTitle = null;
						}
						continue;
					}else{
						if(nMode == 1 || nMode == 3){
							++nCallNest;
						}
					}
				}else
				// )
				if(0x29 == nCharCode){
					if(nMode2 == 1 || nMode2 == 3){
						if(0 < nCallNest){
							--nCallNest;
						}
						if(0 == nCallNest){
							if(nMode2 == 1){
								nMode2 = 2;
							}else{
								nMode2 = 0;
							}
						}
					}
				}else
				// :
				if(0x3a == nCharCode){
					if( nMode2 == 2 ){
						nMode2 = 3;
					}
				}else
				// ;
				if(0x3b == nCharCode){
					if(0 == nCallNest){
						nMode2 = 0;
						bAddFunc = false;
						bEquelFound = false;
					}
				}else
				// class|enum|strcut|interface|get|set|add|remove
				if(0x63 == nCharCode || 0x65 == nCharCode || 0x73 == nCharCode || 0x69 == nCharCode
						|| 0x67 == nCharCode || 0x61 == nCharCode || 0x71 == nCharCode ){
					if(0 < nLinePos){
						nPos = nLinePos -1; // ���O�̕������܂߂�test������
					}else{
						nPos = nLinePos;
					}
					// " class " ���r�B �P��F���őO��1�������K�v
					if(reClass.test(strLine.substr(nPos, 7))
							|| reEnum.test(strLine.substr(nPos, 6))
							|| reStruct.test(strLine.substr(nPos, 8))
							|| reInterface.test(strLine.substr(nPos, 11))){
						strAddTitle = strLine.substr(nLinePos, 200);
						var addName;
						var nAddPos = nLinePos;
						var nItemId = 3;
						if( /^class(\s+)([@\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							var re = strAddTitle.match(/^class(\s+)([@\w\u007f-\ufffe]+)/);
							strAddTitle = re[2];
							nAddPos += 5 + re[1].length;
							addName = " �N���X"
						}else if( /^enum(\s+)([@\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							var re = strAddTitle.match(/^enum(\s+)([@\w\u007f-\ufffe]+)/);
							strAddTitle = re[2];
							nAddPos += 4 + re[1].length;
							addName = " �񋓑�";
							nItemId = 5;
						}else if( /^strcut(\s+)([@\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							var re = strAddTitle.match(/^strcut(\s+)([@\w\u007f-\ufffe]+)/);
							strAddTitle = re[2];
							nAddPos += 6 + re[1].length;
							addName = " �\����";
							nItemId = 4;
						}else if( /^interface(\s+)([@\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							var re = strAddTitle.match(/^interface(\s+)([@\w\u007f-\ufffe]+)/);
							strAddTitle = re[2];
							nAddPos += 9 + re[1].length;
							addName = " �C���^�[�t�F�C�X";
							nItemId = 8;
						}else{
							strAddTitle = "�s��";
							addName = " �N���X";
						}
						var s = "";
						if( (g_opt.vs == 1 && g_opt.sc == false) || g_opt.vs == 2 ){
							var sep = (g_opt.vs == 1?".":"::");
							for(var i = 0; i < classNameNest.length && "" != classNameNest[classNameNest.length - 1 - i]; i++ ){
								s = classNameNest[classNameNest.length - 1 - i] + sep + s;
							}
						}
						s += strAddTitle;
						if( g_opt.vs != 2 ){
							if( g_opt.vs == 1 && g_opt.fn == true ){
								// �ǉ����Ȃ�
							}else{
								AddFuncInfoBoth( nLineNum, nAddPos, s + addName, nNest.length + nDepth );
							}
						}else{
							AddFuncInfoBoth( nLineNum, nAddPos, s, nNest.length + nDepth, nItemId );
						}
						s = null;
						classNameNest.push(strAddTitle);
						nNest.push(nFuncNest2);
						nNestLevel.push(nFuncNestLevel);
						nFuncNestLevel = nFuncNest + 1;
						nFuncNest2 = 0;
						bAddFunc = true;
						strAddTitle = null;
						nLinePos += 4;
						continue;
					}
					// " get|set|add|remove " ���r�B �P��F���őO��1�������K�v set; get;�͏���
					else if(reSetGet.test(strLine.substr(nPos,8)) && !reSetGet2.test(strLine.substr(nPos))){
						var setget;
						var strGetSet = strLine.substr(nPos, 5);
						if( reGet.test(strGetSet) ){
							setget = " get";
						}else if( reSet.test(strGetSet) ){
							setget = " set";
						}else if( reAdd.test(strGetSet) ){
							setget = " add";
						}else{
							setget = " remove";
						}
						if( strAddTitle != null ){
							if( g_opt.vs == 0 ){
								AddFuncInfoBoth( nLineNum, nLinePos, strAddTitle + setget, nNest.length + nDepth );
							}else{
								var s = "";
								var sep = (g_opt.vs == 1?".":"::");
								for(var i = 0; i < classNameNest.length && "" != classNameNest[classNameNest.length - 1 - i]; i++ ){
									s = classNameNest[classNameNest.length - 1 - i] + sep + s;
								}
								s += strAddTitle + setget;
								if( g_opt.vs == 1 ){
									AddFuncInfoBoth( nLineNum, nLinePos, s, nNest.length + nDepth );
								}else{
									AddFuncInfoBoth( nLineNum, nLinePos, s, nNest.length + nDepth, 2 );
								}
							}
							bAddFunc = true;
						}
						continue;
					}
				}else
				// namespace
				if(0x6e == nCharCode){
					if(0 < nLinePos){
						nPos = nLinePos -1; // ���O�̕������܂߂�test������
					}else{
						nPos = nLinePos;
					}
					// " namespace " ���r�B �P��F���őO��1�������K�v
					if(reNamespace.test(strLine.substr(nPos, 11))){
						strAddTitle = strLine.substr(nLinePos, 200);
						var addName;
						if( /^namespace(\s+)([\w\.@\u007f-\ufffe]+)/.test(strAddTitle) ){
							strAddTitle = strAddTitle.match(/^namespace(\s+)([\w\.@\u007f-\ufffe]+)/)[2];
						}else{
							strAddTitle = "����";
						}
						var s = "";
						if( (g_opt.vs == 1 && g_opt.sc == false) || g_opt.vs == 2 ){
							var sep = (g_opt.vs == 1?".":"::");
							for(var i = 0; i < classNameNest.length && "" != classNameNest[classNameNest.length - 1 - i]; i++ ){
								s = classNameNest[classNameNest.length - 1 - i] + sep + s;
							}
						}
						s += strAddTitle;
						if( g_opt.vs != 2 ){
							if( g_opt.vs == 1 && g_opt.fn == true ){
							// �ǉ����Ȃ�
							}else{
								AddFuncInfoBoth( nLineNum, nLinePos, s + " ���O���", nNest.length + nDepth );
							}
						}else{
							AddFuncInfoBoth( nLineNum, nLinePos, s + "::��`�ʒu", nNest.length + nDepth, 7 );
						}
						s = null;
						classNameNest.push(strAddTitle);
						nNest.push(nFuncNest2);
						nNestLevel.push(nFuncNestLevel);
						nFuncNestLevel = -1;
						nFuncNest2 = 0;
						bAddFunc = true;
						strAddTitle = null;
						nLinePos += 4;
						continue;
					}
				}else
				// =
				if(0x3d == nCharCode){
					if( nFuncNestLevel == nFuncNest && nMode2 == 0 ){
						bEquelFound = true;
					}
				}else
				// {
				if(0x7b == nCharCode){
					if(bEquelFound == false && bAddFunc == false && nFuncNestLevel == nFuncNest && nMode2 == 0){
						strAddTitle = strLine.substr(0, nLinePos);
						if( /([~@\w\u007f-\ufffe]+)((<\s*[@\w\u007f-\ufffe\s,]+\s*>)?)(\s*){/.test(strAddTitle) ){ // }
							strAddTitle = strAddTitle.match(/([~@\w\u007f-\ufffe]+)((<\s*[@\w\u007f-\ufffe\s,]+\s*>)?)(\s*)\{/)[1]; // }
						}else if( 1 < nLineNum ){
							var strPrevLine = Editor.GetLineStr( nLineNum - 1 );
							if( /([~@\w\u007f-\ufffe]+)((<\s*[@\w\u007f-\ufffe\s,]+\s*>)?)(\s*)[\r\n]+$/.test(strPrevLine) ){
								strAddTitle = strPrevLine.match(/([~@\w\u007f-\ufffe]+)((<\s*[@\w\u007f-\ufffe\s,]+\s*>)?)(\s*)[\r\n]+$/)[1];
							}
						}
					}
					++nFuncNest;
					++nFuncNest2;
					if(nCallNest == 0){
						nMode2 = 0;
					}
					bAddFunc = false;
					bEquelFound = false;
					continue;
				}else
				// }
				if(0x7d == nCharCode){
					if(0 < nFuncNest){
						--nFuncNest;
					}
					if(0 < nFuncNest2){
						--nFuncNest2;
					}
					if(0 == nFuncNest2){
						if(0 < nNest.length){
							nFuncNest2 = nNest.pop();
							nFuncNestLevel = nNestLevel.pop();
							classNameNest.pop();
						}
						// else error.
					}
					continue;
				}
			}
		}
	}
	return true;
}

function AddFuncInfoBoth(nLine, nColm, szElem, nAppNestLevel, nOpt)
{
	if( g_bAddFuncModeTree ){
		Outline.AddFuncInfo2(nLine, nColm + 1, szElem, nAppNestLevel);
	}else{
		Outline.AddFuncInfo(nLine, nColm + 1, szElem, nOpt ? nOpt : 0);
	}
}

function LoadPluginOptions()
{
	var t_val = true;
	var tmp = {};
	tmp.vs = 0;
	tmp.sc = false;
	tmp.fn = false;
	g_opt = tmp;
	if( !g_bLoadPluginOption ){
		return;
	}
	var LoadKeyBool = function (key, def_val)
	{
		var x = Plugin.GetOption( "Option", "OutLine" +  key );
		if( x == "" ){
			return def_val;
		}
		return "0" != x;
	};
	var LoadKeyInt = function (key, def_val)
	{
		var x = Plugin.GetOption( "Option", "OutLine" +  key );
		if( x == "" ){
			return def_val;
		}
		return parseInt(x);
	};
	tmp.vs = LoadKeyInt("ViewStyle", 0);
	tmp.sc = LoadKeyBool("ListScope", false);
	tmp.fn = LoadKeyBool("ListFuncOnly", false);
	g_opt = tmp;
}

function csharpOutline()
{
	LoadPluginOptions();
	Outline.SetTitle( "C# �A�E�g���C��" );
	g_bAddFuncModeTree = (g_opt.vs == 0);
	var lines = Editor.GetLineCount(0);
	var maxcolm = 0x0fffffff;
	if( g_bAddFuncModeTree ){
		Outline.SetListType( 100 ); // �ėp�c���[
		AddFuncInfoBoth(1, 0, "C# �A�E�g���C��", 0);
		csharp_OutlineExec(1, 1, lines, 0, maxcolm);
	}else if( g_opt.vs == 2 ){
		Outline.SetListType( 200 ); // JavaTree
		csharp_OutlineExec(0, 1, lines, 0, maxcolm);
	}else{
		Outline.SetListType( 300 ); // �ėp���X�g
		csharp_OutlineExec(0, 1, lines, 0, maxcolm);
	}
}
csharpOutline();
