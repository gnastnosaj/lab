(self.webpackChunklab=self.webpackChunklab||[]).push([[656],{7656:()=>{window.PR_SHOULD_USE_CONTINUATION=!0,function(){var E=window,M=["break,continue,do,else,for,if,return,while"],W=[[M,"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],Z=[W,"alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],j=[W,"abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],ee=[W,"abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield"],re=[W,"abstract,async,await,constructor,debugger,enum,eval,export,function,get,implements,instanceof,interface,let,null,set,undefined,var,with,yield,Infinity,NaN"],ae="caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",ne=[M,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],te=[M,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],se=[M,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],ie=/^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,I="str",k="com",B="typ",F="lit",K="pun",L="pln",fe="src",H="atv";function G(a,t,l,c,g){if(l){var i={sourceNode:a,pre:1,langExtension:null,numberLines:null,sourceCode:l,spans:null,basePos:t,decorations:null};c(i),g.push.apply(g,i.decorations)}}var Te=/\S/;function Oe(a){for(var t=void 0,l=a.firstChild;l;l=l.nextSibling){var c=l.nodeType;t=1===c?t?a:l:3===c&&Te.test(l.nodeValue)?a:t}return t===a?void 0:t}function $(a,t){var c,l={};!function(){for(var s=a.concat(t),R=[],p={},u=0,v=s.length;u<v;++u){var x=s[u],y=x[3];if(y)for(var o=y.length;--o>=0;)l[y.charAt(o)]=x;var e=x[1],d=""+e;p.hasOwnProperty(d)||(R.push(e),p[d]=null)}R.push(/[\0-\uffff]/),c=function xe(a){for(var t=0,l=!1,c=!1,g=0,i=a.length;g<i;++g)if((s=a[g]).ignoreCase)c=!0;else if(/[a-z]/i.test(s.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){l=!0,c=!1;break}var R={b:8,t:9,n:10,v:11,f:12,r:13};function p(o){var e=o.charCodeAt(0);if(92!==e)return e;var d=o.charAt(1);return(e=R[d])||("0"<=d&&d<="7"?parseInt(o.substring(1),8):"u"===d||"x"===d?parseInt(o.substring(2),16):o.charCodeAt(1))}function u(o){if(o<32)return(o<16?"\\x0":"\\x")+o.toString(16);var e=String.fromCharCode(o);return"\\"===e||"-"===e||"]"===e||"^"===e?"\\"+e:e}function v(o){var e=o.substring(1,o.length-1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g")),d=[],f="^"===e[0],r=["["];f&&r.push("^");for(var n=f?1:0,m=e.length;n<m;++n){var w=e[n];if(/\\[bdsw]/i.test(w))r.push(w);else{var b,h=p(w);n+2<m&&"-"===e[n+1]?(b=p(e[n+2]),n+=2):b=h,d.push([h,b]),b<65||h>122||(b<65||h>90||d.push([32|Math.max(65,h),32|Math.min(b,90)]),b<97||h>122||d.push([-33&Math.max(97,h),-33&Math.min(b,122)]))}}d.sort(function(T,N){return T[0]-N[0]||N[1]-T[1]});var C=[],S=[];for(n=0;n<d.length;++n)(_=d[n])[0]<=S[1]+1?S[1]=Math.max(S[1],_[1]):C.push(S=_);for(n=0;n<C.length;++n){var _;r.push(u((_=C[n])[0])),_[1]>_[0]&&(_[1]+1>_[0]&&r.push("-"),r.push(u(_[1])))}return r.push("]"),r.join("")}function x(o){for(var e=o.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),d=e.length,f=[],r=0,n=0;r<d;++r)"("===(m=e[r])?++n:"\\"===m.charAt(0)&&(w=+m.substring(1))&&(w<=n?f[w]=-1:e[r]=u(w));for(r=1;r<f.length;++r)-1===f[r]&&(f[r]=++t);for(r=0,n=0;r<d;++r)if("("===(m=e[r]))f[++n]||(e[r]="(?:");else if("\\"===m.charAt(0)){var w;(w=+m.substring(1))&&w<=n&&(e[r]="\\"+f[w])}for(r=0;r<d;++r)"^"===e[r]&&"^"!==e[r+1]&&(e[r]="");if(o.ignoreCase&&l)for(r=0;r<d;++r){var m,h=(m=e[r]).charAt(0);m.length>=2&&"["===h?e[r]=v(m):"\\"!==h&&(e[r]=m.replace(/[a-zA-Z]/g,function(S){var _=S.charCodeAt(0);return"["+String.fromCharCode(-33&_,32|_)+"]"}))}return e.join("")}var y=[];for(g=0,i=a.length;g<i;++g){var s;if((s=a[g]).global||s.multiline)throw new Error(""+s);y.push("(?:"+x(s)+")")}return new RegExp(y.join("|"),c?"gi":"g")}(R)}();var g=t.length,i=function(s){for(var p=s.basePos,u=s.sourceNode,v=[p,L],x=0,y=s.sourceCode.match(c)||[],o={},e=0,d=y.length;e<d;++e){var m,f=y[e],r=o[f],n=void 0;if("string"==typeof r)m=!1;else{var w=l[f.charAt(0)];if(w)n=f.match(w[1]),r=w[0];else{for(var h=0;h<g;++h)if(n=f.match((w=t[h])[1])){r=w[0];break}n||(r=L)}(m=r.length>=5&&"lang-"===r.substring(0,5))&&!(n&&"string"==typeof n[1])&&(m=!1,r=fe),m||(o[f]=r)}var b=x;if(x+=f.length,m){var C=n[1],S=f.indexOf(C),_=S+C.length;n[2]&&(S=(_=f.length-n[2].length)-C.length);var T=r.substring(5);G(u,p+b,f.substring(0,S),i,v),G(u,p+b+S,C,pe(T,C),v),G(u,p+b+_,f.substring(_),i,v)}else v.push(p+b,r)}s.decorations=v};return i}function O(a){var t=[],l=[];t.push(a.tripleQuotedStrings?[I,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]:a.multiLineStrings?[I,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]:[I,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),a.verbatimStrings&&l.push([I,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null]);var c=a.hashComments;c&&(a.cStyleComments?(t.push(c>1?[k,/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,"#"]:[k,/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),l.push([I,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null])):t.push([k,/^#[^\r\n]*/,null,"#"])),a.cStyleComments&&(l.push([k,/^\/\/[^\r\n]*/,null]),l.push([k,/^\/\*[\s\S]*?(?:\*\/|$)/,null]));var g=a.regexLiterals;if(g){var i=g>1?"":"\n\r",s=i?".":"[\\S\\s]";l.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(/(?=[^/*"+i+"])(?:[^/\\x5B\\x5C"+i+"]|\\x5C"+s+"|\\x5B(?:[^\\x5C\\x5D"+i+"]|\\x5C"+s+")*(?:\\x5D|$))+/)")])}var p=a.types;p&&l.push([B,p]);var u=(""+a.keywords).replace(/^ | $/g,"");u.length&&l.push(["kwd",new RegExp("^(?:"+u.replace(/[\s,]+/g,"|")+")\\b"),null]),t.push([L,/^\s+/,null," \r\n\t\xa0"]);var v="^.[^\\s\\w.$@'\"`/\\\\]*";return a.regexLiterals&&(v+="(?!s*/)"),l.push([F,/^@[a-z_$][a-z_$@0-9]*/i,null],[B,/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],[L,/^[a-z_$][a-z_$@0-9]*/i,null],[F,new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*","i"),null,"0123456789"],[L,/^\\[\s\S]?/,null],[K,new RegExp(v),null]),$(t,l)}var Ae=O({keywords:[Z,ee,j,re,ae,ne,te,se],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0});function ce(a,t,l){for(var c=/(?:^|\s)nocode(?:\s|$)/,g=/\r\n?|\n/,i=a.ownerDocument,s=i.createElement("li");a.firstChild;)s.appendChild(a.firstChild);var R=[s];function p(e){var d=e.nodeType;if(1!=d||c.test(e.className)){if((3==d||4==d)&&l){var r=e.nodeValue,n=r.match(g);if(n){var m=r.substring(0,n.index);e.nodeValue=m;var w=r.substring(n.index+n[0].length);w&&e.parentNode.insertBefore(i.createTextNode(w),e.nextSibling),u(e),m||e.parentNode.removeChild(e)}}}else if("br"===e.nodeName)u(e),e.parentNode&&e.parentNode.removeChild(e);else for(var f=e.firstChild;f;f=f.nextSibling)p(f)}function u(e){for(;!e.nextSibling;)if(!(e=e.parentNode))return;for(var r,f=function d(n,m){var w=m?n.cloneNode(!1):n,h=n.parentNode;if(h){var b=d(h,1),C=n.nextSibling;b.appendChild(w);for(var S=C;S;S=C)C=S.nextSibling,b.appendChild(S)}return w}(e.nextSibling,0);(r=f.parentNode)&&1===r.nodeType;)f=r;R.push(f)}for(var v=0;v<R.length;++v)p(R[v]);t===(0|t)&&R[0].setAttribute("value",t);var x=i.createElement("ol");x.className="linenums";for(var y=Math.max(0,t-1|0)||0,o=(v=0,R.length);v<o;++v)(s=R[v]).className="L"+(v+y)%10,s.firstChild||s.appendChild(i.createTextNode("\xa0")),x.appendChild(s);a.appendChild(x)}var U={};function P(a,t){for(var l=t.length;--l>=0;){var c=t[l];U.hasOwnProperty(c)?E.console&&console.warn("cannot override language handler %s",c):U[c]=a}}function pe(a,t){return a&&U.hasOwnProperty(a)||(a=/^\s*</.test(t)?"default-markup":"default-code"),U[a]}function ge(a){var t=a.langExtension;try{var l=function Pe(a,t){var l=/(?:^|\s)nocode(?:\s|$)/,c=[],g=0,i=[],s=0;return function R(p){var u=p.nodeType;if(1==u){if(l.test(p.className))return;for(var v=p.firstChild;v;v=v.nextSibling)R(v);var x=p.nodeName.toLowerCase();("br"===x||"li"===x)&&(c[s]="\n",i[s<<1]=g++,i[s++<<1|1]=p)}else if(3==u||4==u){var y=p.nodeValue;y.length&&(y=t?y.replace(/\r\n?/g,"\n"):y.replace(/[ \t\r\n]+/g," "),c[s]=y,i[s<<1]=g,g+=y.length,i[s++<<1|1]=p)}}(a),{sourceCode:c.join("").replace(/\n$/,""),spans:i}}(a.sourceNode,a.pre),c=l.sourceCode;a.sourceCode=c,a.spans=l.spans,a.basePos=0,pe(t,c)(a),function Ee(a){var t=/\bMSIE\s(\d+)/.exec(navigator.userAgent);t=t&&+t[1]<=8;var y,o,l=/\n/g,c=a.sourceCode,g=c.length,i=0,s=a.spans,R=s.length,p=0,u=a.decorations,v=u.length,x=0;for(u[v]=g,o=y=0;o<v;)u[o]!==u[o+2]?(u[y++]=u[o++],u[y++]=u[o++]):o+=2;for(v=y,o=y=0;o<v;){for(var e=u[o],d=u[o+1],f=o+2;f+2<=v&&u[f+1]===d;)f+=2;u[y++]=e,u[y++]=d,o=f}v=u.length=y;var r=a.sourceNode,n="";r&&(n=r.style.display,r.style.display="none");try{for(;p<R;){var S,h=s[p+2]||g,b=u[x+2]||g,C=(f=Math.min(h,b),s[p+1]);if(1!==C.nodeType&&(S=c.substring(i,f))){t&&(S=S.replace(l,"\r")),C.nodeValue=S;var _=C.ownerDocument,T=_.createElement("span");T.className=u[x+1];var N=C.parentNode;N.replaceChild(T,C),T.appendChild(C),i<h&&(s[p+1]=C=_.createTextNode(c.substring(f,h)),N.insertBefore(C,T.nextSibling))}(i=f)>=h&&(p+=2),i>=b&&(x+=2)}}finally{r&&(r.style.display=n)}}(a)}catch(g){E.console&&console.log(g&&g.stack||g)}}P(Ae,["default-code"]),P($([],[[L,/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],[k,/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],[K,/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]),P($([[L,/^[\s]+/,null," \t\r\n"],[H,/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[K,/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),P($([],[[H,/^[\s\S]+/]]),["uq.val"]),P(O({keywords:Z,hashComments:!0,cStyleComments:!0,types:ie}),["c","cc","cpp","cxx","cyc","m"]),P(O({keywords:"null,true,false"}),["json"]),P(O({keywords:ee,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:ie}),["cs"]),P(O({keywords:j,cStyleComments:!0}),["java"]),P(O({keywords:se,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]),P(O({keywords:ne,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]),P(O({keywords:ae,hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]),P(O({keywords:te,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]),P(O({keywords:re,cStyleComments:!0,regexLiterals:!0}),["javascript","js","ts","typescript"]),P(O({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]),P($([],[[I,/^[\s\S]+/]]),["regex"]);var Le=E.PR={createSimpleLexer:$,registerLangHandler:P,sourceDecorator:O,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:H,PR_COMMENT:k,PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:F,PR_NOCODE:"nocode",PR_PLAIN:L,PR_PUNCTUATION:K,PR_SOURCE:fe,PR_STRING:I,PR_TAG:"tag",PR_TYPE:B,prettyPrintOne:function he(a,t,l){var c=l||!1,g=t||null,i=document.createElement("div");return i.innerHTML="<pre>"+a+"</pre>",i=i.firstChild,c&&ce(i,c,!0),ge({langExtension:g,numberLines:c,sourceNode:i,pre:1,sourceCode:null,basePos:null,spans:null,decorations:null}),i.innerHTML},prettyPrint:function de(a,t){var l=t||document.body,c=l.ownerDocument||document;function g(w){return l.getElementsByTagName(w)}for(var i=[g("pre"),g("code"),g("xmp")],s=[],R=0;R<i.length;++R)for(var p=0,u=i[R].length;p<u;++p)s.push(i[R][p]);i=null;var v=Date;v.now||(v={now:function(){return+new Date}});var x=0,y=/\blang(?:uage)?-([\w.]+)(?!\S)/,o=/\bprettyprint\b/,e=/\bprettyprinted\b/,d=/pre|xmp/i,f=/^code$/i,r=/^(?:pre|code|xmp)$/i,n={};!function m(){for(var w=E.PR_SHOULD_USE_CONTINUATION?v.now()+250:1/0;x<s.length&&v.now()<w;x++){for(var h=s[x],b=n,C=h;C=C.previousSibling;){var S=C.nodeType,_=(7===S||8===S)&&C.nodeValue;if(_?!/^\??prettify\b/.test(_):3!==S||/\S/.test(C.nodeValue))break;if(_){b={},_.replace(/\b(\w+)=([\w:.%+-]+)/g,function(Ue,Ie,ke){b[Ie]=ke});break}}var T=h.className;if((b!==n||o.test(T))&&!e.test(T)){for(var N=!1,Y=h.parentNode;Y;Y=Y.parentNode)if(r.test(Y.tagName)&&Y.className&&o.test(Y.className)){N=!0;break}if(!N){h.className+=" prettyprinted";var q,z,D=b.lang;if(D||(!(D=T.match(y))&&(q=Oe(h))&&f.test(q.tagName)&&(D=q.className.match(y)),D&&(D=D[1])),d.test(h.tagName))z=1;else{var ye=h.currentStyle,J=c.defaultView,me=ye?ye.whiteSpace:J&&J.getComputedStyle?J.getComputedStyle(h,null).getPropertyValue("white-space"):0;z=me&&"pre"===me.substring(0,3)}var A=b.linenums;(A="true"===A||+A)||(A=!!(A=T.match(/\blinenums\b(?::(\d+))?/))&&(!A[1]||!A[1].length||+A[1])),A&&ce(h,A,z),ge({langExtension:D,sourceNode:h,numberLines:A,pre:z,sourceCode:null,basePos:null,spans:null,decorations:null})}}}x<s.length?E.setTimeout(m,250):"function"==typeof a&&a()}()}},V=E.define;"function"==typeof V&&V.amd&&V("google-code-prettify",[],function(){return Le})}()}}]);