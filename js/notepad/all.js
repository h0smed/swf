/**
 * Full HTML5 compatibility rule set
 * These rules define which tags and css classes are supported and which tags should be specially treated.
 *
 * Examples based on this rule set:
 *
 *    <a href="http://foobar.com">foo</a>
 *    ... becomes ...
 *    <a href="http://foobar.com" target="_blank" rel="nofollow">foo</a>
 *
 *    <img align="left" src="http://foobar.com/image.png">
 *    ... becomes ...
 *    <img class="wysiwyg-float-left" src="http://foobar.com/image.png" alt="">
 *
 *    <div>foo<script>alert(document.cookie)</script></div>
 *    ... becomes ...
 *    <div>foo</div>
 *
 *    <marquee>foo</marquee>
 *    ... becomes ...
 *    <span>foo</marquee>
 *
 *    foo <br clear="both"> bar
 *    ... becomes ...
 *    foo <br class="wysiwyg-clear-both"> bar
 *
 *    <div>hello <iframe src="http://google.com"></iframe></div>
 *    ... becomes ...
 *    <div>hello </div>
 *
 *    <center>hello</center>
 *    ... becomes ...
 *    <div class="wysiwyg-text-align-center">hello</div>
 */
var wysihtml5ParserRules = {
    /**
     * CSS Class white-list
     * Following css classes won't be removed when parsed by the wysihtml5 html parser
     */
    "classes": {
        "wysiwyg-clear-both": 1,
        "wysiwyg-clear-left": 1,
        "wysiwyg-clear-right": 1,
        "wysiwyg-color-aqua": 1,
        "wysiwyg-color-black": 1,
        "wysiwyg-color-blue": 1,
        "wysiwyg-color-fuchsia": 1,
        "wysiwyg-color-gray": 1,
        "wysiwyg-color-green": 1,
        "wysiwyg-color-lime": 1,
        "wysiwyg-color-maroon": 1,
        "wysiwyg-color-navy": 1,
        "wysiwyg-color-olive": 1,
        "wysiwyg-color-purple": 1,
        "wysiwyg-color-red": 1,
        "wysiwyg-color-silver": 1,
        "wysiwyg-color-teal": 1,
        "wysiwyg-color-white": 1,
        "wysiwyg-color-yellow": 1,
        "wysiwyg-float-left": 1,
        "wysiwyg-float-right": 1,
        "wysiwyg-font-size-large": 1,
        "wysiwyg-font-size-larger": 1,
        "wysiwyg-font-size-medium": 1,
        "wysiwyg-font-size-small": 1,
        "wysiwyg-font-size-smaller": 1,
        "wysiwyg-font-size-x-large": 1,
        "wysiwyg-font-size-x-small": 1,
        "wysiwyg-font-size-xx-large": 1,
        "wysiwyg-font-size-xx-small": 1,
        "wysiwyg-text-align-center": 1,
        "wysiwyg-text-align-justify": 1,
        "wysiwyg-text-align-left": 1,
        "wysiwyg-text-align-right": 1
    },
    /**
     * Tag list
     *
     * Following options are available:
     *
     *    - add_class:        converts and deletes the given HTML4 attribute (align, clear, ...) via the given method to a css class
     *                        The following methods are implemented in wysihtml5.dom.parse:
     *                          - align_text:  converts align attribute values (right/left/center/justify) to their corresponding css class "wysiwyg-text-align-*")
                                  <p align="center">foo</p> ... becomes ... <p> class="wysiwyg-text-align-center">foo</p>
     *                          - clear_br:    converts clear attribute values left/right/all/both to their corresponding css class "wysiwyg-clear-*"
     *                            <br clear="all"> ... becomes ... <br class="wysiwyg-clear-both">
     *                          - align_img:    converts align attribute values (right/left) on <img> to their corresponding css class "wysiwyg-float-*"
     *                          
     *    - remove:             removes the element and it's content
     *
     *    - rename_tag:         renames the element to the given tag
     *
     *    - set_class:          adds the given class to the element (note: make sure that the class is in the "classes" white list above)
     *
     *    - set_attributes:     sets/overrides the given attributes
     *
     *    - check_attributes:   checks the given HTML attribute via the given method
     *                            - url:      checks whether the given string is an url, deletes the attribute if not
     *                            - alt:      strips unwanted characters. if the attribute is not set, then it gets set (to ensure valid and compatible HTML)
     *                            - numbers:  ensures that the attribute only contains numeric characters
     */
    "tags": {
        "tr": {
            "add_class": {
                "align": "align_text"
            }
        },
        "strike": {
            "remove": 1
        },
        "form": {
            "rename_tag": "div"
        },
        "rt": {
            "rename_tag": "span"
        },
        "code": {},
        "acronym": {
            "rename_tag": "span"
        },
        "br": {
            "add_class": {
                "clear": "clear_br"
            }
        },
        "details": {
            "rename_tag": "div"
        },
        "h4": {
            "add_class": {
                "align": "align_text"
            }
        },
        "em": {},
        "title": {
            "remove": 1
        },
        "multicol": {
            "rename_tag": "div"
        },
        "figure": {
            "rename_tag": "div"
        },
        "xmp": {
            "rename_tag": "span"
        },
        "small": {
            "rename_tag": "span",
            "set_class": "wysiwyg-font-size-smaller"
        },
        "area": {
            "remove": 1
        },
        "time": {
            "rename_tag": "span"
        },
        "dir": {
            "rename_tag": "ul"
        },
        "bdi": {
            "rename_tag": "span"
        },
        "command": {
            "remove": 1
        },
        "ul": {},
        "progress": {
            "rename_tag": "span"
        },
        "dfn": {
            "rename_tag": "span"
        },
        "iframe": {
            "remove": 1
        },
        "figcaption": {
            "rename_tag": "div"
        },
        "a": {
            "check_attributes": {
                "href": "url"
            },
            "set_attributes": {
                "rel": "nofollow",
                "target": "_blank"
            }
        },
        "img": {
            "check_attributes": {
                "width": "numbers",
                "alt": "alt",
                "src": "url",
                "height": "numbers"
            },
            "add_class": {
                "align": "align_img"
            }
        },
        "rb": {
            "rename_tag": "span"
        },
        "footer": {
            "rename_tag": "div"
        },
        "noframes": {
            "remove": 1
        },
        "abbr": {
            "rename_tag": "span"
        },
        "u": {},
        "bgsound": {
            "remove": 1
        },
        "sup": {
            "rename_tag": "span"
        },
        "address": {
            "rename_tag": "div"
        },
        "basefont": {
            "remove": 1
        },
        "nav": {
            "rename_tag": "div"
        },
        "h1": {
            "add_class": {
                "align": "align_text"
            }
        },
        "head": {
            "remove": 1
        },
        "tbody": {
            "add_class": {
                "align": "align_text"
            }
        },
        "dd": {
            "rename_tag": "div"
        },
        "s": {
            "rename_tag": "span"
        },
        "li": {},
        "td": {
            "check_attributes": {
                "rowspan": "numbers",
                "colspan": "numbers"
            },
            "add_class": {
                "align": "align_text"
            }
        },
        "object": {
            "remove": 1
        },
        "div": {
            "add_class": {
                "align": "align_text"
            }
        },
        "option": {
            "rename_tag": "span"
        },
        "select": {
            "rename_tag": "span"
        },
        "i": {},
        "track": {
            "remove": 1
        },
        "wbr": {
            "remove": 1
        },
        "fieldset": {
            "rename_tag": "div"
        },
        "big": {
            "rename_tag": "span",
            "set_class": "wysiwyg-font-size-larger"
        },
        "button": {
            "rename_tag": "span"
        },
        "noscript": {
            "remove": 1
        },
        "svg": {
            "remove": 1
        },
        "input": {
            "remove": 1
        },
        "table": {},
        "keygen": {
            "remove": 1
        },
        "h5": {
            "add_class": {
                "align": "align_text"
            }
        },
        "meta": {
            "remove": 1
        },
        "map": {
            "rename_tag": "div"
        },
        "isindex": {
            "remove": 1
        },
        "mark": {
            "rename_tag": "span"
        },
        "caption": {
            "add_class": {
                "align": "align_text"
            }
        },
        "tfoot": {
            "add_class": {
                "align": "align_text"
            }
        },
        "base": {
            "remove": 1
        },
        "video": {
            "remove": 1
        },
        "strong": {},
        "canvas": {
            "remove": 1
        },
        "output": {
            "rename_tag": "span"
        },
        "marquee": {
            "rename_tag": "span"
        },
        "b": {},
        "q": {
            "check_attributes": {
                "cite": "url"
            }
        },
        "applet": {
            "remove": 1
        },
        "span": {},
        "rp": {
            "rename_tag": "span"
        },
        "spacer": {
            "remove": 1
        },
        "source": {
            "remove": 1
        },
        "aside": {
            "rename_tag": "div"
        },
        "frame": {
            "remove": 1
        },
        "section": {
            "rename_tag": "div"
        },
        "body": {
            "rename_tag": "div"
        },
        "ol": {},
        "nobr": {
            "rename_tag": "span"
        },
        "html": {
            "rename_tag": "div"
        },
        "summary": {
            "rename_tag": "span"
        },
        "var": {
            "rename_tag": "span"
        },
        "del": {
            "remove": 1
        },
        "blockquote": {
            "check_attributes": {
                "cite": "url"
            }
        },
        "style": {
            "remove": 1
        },
        "device": {
            "remove": 1
        },
        "meter": {
            "rename_tag": "span"
        },
        "h3": {
            "add_class": {
                "align": "align_text"
            }
        },
        "textarea": {
            "rename_tag": "span"
        },
        "embed": {
            "remove": 1
        },
        "hgroup": {
            "rename_tag": "div"
        },
        "font": {
            "rename_tag": "span",
            "add_class": {
                "size": "size_font"
            }
        },
        "tt": {
            "rename_tag": "span"
        },
        "noembed": {
            "remove": 1
        },
        "thead": {
            "add_class": {
                "align": "align_text"
            }
        },
        "blink": {
            "rename_tag": "span"
        },
        "plaintext": {
            "rename_tag": "span"
        },
        "xml": {
            "remove": 1
        },
        "h6": {
            "add_class": {
                "align": "align_text"
            }
        },
        "param": {
            "remove": 1
        },
        "th": {
            "check_attributes": {
                "rowspan": "numbers",
                "colspan": "numbers"
            },
            "add_class": {
                "align": "align_text"
            }
        },
        "legend": {
            "rename_tag": "span"
        },
        "hr": {},
        "label": {
            "rename_tag": "span"
        },
        "dl": {
            "rename_tag": "div"
        },
        "kbd": {
            "rename_tag": "span"
        },
        "listing": {
            "rename_tag": "div"
        },
        "dt": {
            "rename_tag": "span"
        },
        "nextid": {
            "remove": 1
        },
        "pre": {},
        "center": {
            "rename_tag": "div",
            "set_class": "wysiwyg-text-align-center"
        },
        "audio": {
            "remove": 1
        },
        "datalist": {
            "rename_tag": "span"
        },
        "samp": {
            "rename_tag": "span"
        },
        "col": {
            "remove": 1
        },
        "article": {
            "rename_tag": "div"
        },
        "cite": {},
        "link": {
            "remove": 1
        },
        "script": {
            "remove": 1
        },
        "bdo": {
            "rename_tag": "span"
        },
        "menu": {
            "rename_tag": "ul"
        },
        "colgroup": {
            "remove": 1
        },
        "ruby": {
            "rename_tag": "span"
        },
        "h2": {
            "add_class": {
                "align": "align_text"
            }
        },
        "ins": {
            "rename_tag": "span"
        },
        "p": {
            "add_class": {
                "align": "align_text"
            }
        },
        "sub": {
            "rename_tag": "span"
        },
        "comment": {
            "remove": 1
        },
        "frameset": {
            "remove": 1
        },
        "optgroup": {
            "rename_tag": "span"
        },
        "header": {
            "rename_tag": "div"
        }
    }
};

var g_isIE=navigator.userAgent.indexOf("MSIE")!==-1&&navigator.userAgent.indexOf("Opera")===-1;var g_isOpera=navigator.userAgent.indexOf("Opera/")!==-1;var wysihtml5={version:"0.3.0",commands:{},dom:{},quirks:{},toolbar:{},lang:{},selection:{},views:{},INVISIBLE_SPACE:"\uFEFF",EMPTY_FUNCTION:function(){},ELEMENT_NODE:1,TEXT_NODE:3,BACKSPACE_KEY:8,ENTER_KEY:13,ESCAPE_KEY:27,SPACE_KEY:32,DELETE_KEY:46};window["rangy"]=(function(){var j="object",g="function",z="undefined";var k=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer","START_TO_START","START_TO_END","END_TO_START","END_TO_END"];var c=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"];var r=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"];var o=["collapse","compareEndPoints","duplicate","getBookmark","moveToBookmark","moveToElementText","parentElement","pasteHTML","select","setEndPoint","getBoundingClientRect"];function i(C,B){var A=typeof C[B];return A==g||(!!(A==j&&C[B]))||A=="unknown"}function d(B,A){return !!(typeof B[A]==j&&B[A])}function p(B,A){return typeof B[A]!=z}function l(A){return function(D,C){var B=C.length;while(B--){if(!A(D,C[B])){return false}}return true}}var n=l(i);var q=l(d);var y=l(p);function u(A){return A&&n(A,o)&&y(A,r)}var m={version:"1.2.2",initialized:false,supported:true,util:{isHostMethod:i,isHostObject:d,isHostProperty:p,areHostMethods:n,areHostObjects:q,areHostProperties:y,isTextRange:u},features:{},modules:{},config:{alertOnWarn:false,preferTextRange:false}};function f(A){window.alert("Rangy not supported in your browser. Reason: "+A);m.initialized=true;m.supported=false}m.fail=f;function t(B){var A="Rangy warning: "+B;if(m.config.alertOnWarn){window.alert(A)}else{if(typeof window.console!=z&&typeof window.console.log!=z){window.console.log(A)}}}m.warn=t;if({}.hasOwnProperty){m.util.extend=function(C,B){for(var A in B){if(B.hasOwnProperty(A)){C[A]=B[A]}}}}else{f("hasOwnProperty not supported")}var v=[];var a=[];function s(){if(m.initialized){return}var C;var G=false,H=false;if(i(document,"createRange")){C=document.createRange();if(n(C,c)&&y(C,k)){G=true}C.detach()}var B=d(document,"body")?document.body:document.getElementsByTagName("body")[0];if(B&&i(B,"createTextRange")){C=B.createTextRange();if(u(C)){H=true}}if(!G&&!H){f("Neither Range nor TextRange are implemented")}m.initialized=true;m.features={implementsDomRange:G,implementsTextRange:H};var F=a.concat(v);for(var E=0,A=F.length;E<A;++E){try{F[E](m)}catch(D){if(d(window,"console")&&i(window.console,"log")){window.console.log("Init listener threw an exception. Continuing.",D)}}}}m.init=s;m.addInitListener=function(A){if(m.initialized){A(m)}else{v.push(A)}};var w=[];m.addCreateMissingNativeApiListener=function(A){w.push(A)};function e(C){C=C||window;s();for(var B=0,A=w.length;B<A;++B){w[B](C)}}m.createMissingNativeApi=e;function x(A){this.name=A;this.initialized=false;this.supported=false}x.prototype.fail=function(A){this.initialized=true;this.supported=false;throw new Error("Module '"+this.name+"' failed to load: "+A)};x.prototype.warn=function(A){m.warn("Module "+this.name+": "+A)};x.prototype.createError=function(A){return new Error("Error in Rangy "+this.name+" module: "+A)};m.createModule=function(A,C){var B=new x(A);m.modules[A]=B;a.push(function(D){C(D,B);B.initialized=true;B.supported=true})};m.requireModules=function(C){for(var E=0,A=C.length,D,B;E<A;++E){B=C[E];D=m.modules[B];if(!D||!(D instanceof x)){throw new Error("Module '"+B+"' not found")}if(!D.supported){throw new Error("Module '"+B+"' not supported")}}};var b=false;var h=function(A){if(!b){b=true;if(!m.initialized){s()}}};if(typeof window==z){f("No window found");return}if(typeof document==z){f("No document found");return}if(i(document,"addEventListener")){document.addEventListener("DOMContentLoaded",h,false)}if(i(window,"addEventListener")){window.addEventListener("load",h,false)}else{if(i(window,"attachEvent")){window.attachEvent("onload",h)}else{f("Window does not have required addEventListener or attachEvent method")}}return m})();rangy.createModule("DomUtil",function(p,d){var t="undefined";var b=p.util;if(!b.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])){d.fail("document missing a Node creation method")}if(!b.isHostMethod(document,"getElementsByTagName")){d.fail("document missing getElementsByTagName method")}var e=document.createElement("div");if(!b.areHostMethods(e,["insertBefore","appendChild","cloneNode"]||!b.areHostObjects(e,["previousSibling","nextSibling","childNodes","parentNode"]))){d.fail("Incomplete Element implementation")}if(!b.isHostProperty(e,"innerHTML")){d.fail("Element is missing innerHTML property")}var s=document.createTextNode("test");if(!b.areHostMethods(s,["splitText","deleteData","insertData","appendData","cloneNode"]||!b.areHostObjects(e,["previousSibling","nextSibling","childNodes","parentNode"])||!b.areHostProperties(s,["data"]))){d.fail("Incomplete Text Node implementation")}var y=function(E,G){var F=E.length;while(F--){if(E[F]===G){return true}}return false};function i(F){var E;return typeof F.namespaceURI==t||((E=F.namespaceURI)===null||E=="http://www.w3.org/1999/xhtml")}function j(F){var E=F.parentNode;return(E.nodeType==1)?E:null}function a(F){var E=0;while((F=F.previousSibling)){E++}return E}function g(E){var F;return m(E)?E.length:((F=E.childNodes)?F.length:0)}function x(F,E){var G=[],H;for(H=F;H;H=H.parentNode){G.push(H)}for(H=E;H;H=H.parentNode){if(y(G,H)){return H}}return null}function C(E,F,H){var G=H?F:F.parentNode;while(G){if(G===E){return true}else{G=G.parentNode}}return false}function z(F,E,I){var G,H=I?F:F.parentNode;while(H){G=H.parentNode;if(G===E){return H}H=G}return null}function m(F){var E=F.nodeType;return E==3||E==4||E==8}function v(H,F){var E=F.nextSibling,G=F.parentNode;if(E){G.insertBefore(H,E)}else{G.appendChild(H)}return H}function w(G,E){var F=G.cloneNode(false);F.deleteData(0,E);G.deleteData(E,G.length-E);v(F,G);return F}function q(E){if(E.nodeType==9){return E}else{if(typeof E.ownerDocument!=t){return E.ownerDocument}else{if(typeof E.document!=t){return E.document}else{if(E.parentNode){return q(E.parentNode)}else{throw new Error("getDocument: no document found for node")}}}}}function l(E){var F=q(E);if(typeof F.defaultView!=t){return F.defaultView}else{if(typeof F.parentWindow!=t){return F.parentWindow}else{throw new Error("Cannot get a window object for node")}}}function B(E){if(typeof E.contentDocument!=t){return E.contentDocument}else{if(typeof E.contentWindow!=t){return E.contentWindow.document}else{throw new Error("getIframeWindow: No Document object found for iframe element")}}}function f(E){if(typeof E.contentWindow!=t){return E.contentWindow}else{if(typeof E.contentDocument!=t){return E.contentDocument.defaultView}else{throw new Error("getIframeWindow: No Window object found for iframe element")}}}function D(E){return b.isHostObject(E,"body")?E.body:E.getElementsByTagName("body")[0]}function c(F){var E;while((E=F.parentNode)){F=E}return F}function r(H,J,G,I){var E,K,M,L,F;if(H==G){return J===I?0:(J<I)?-1:1}else{if((E=z(G,H,true))){return J<=a(E)?-1:1}else{if((E=z(H,G,true))){return a(E)<I?-1:1}else{K=x(H,G);M=(H===K)?K:z(H,K,true);L=(G===K)?K:z(G,K,true);if(M===L){throw new Error("comparePoints got to case 4 and childA and childB are the same!")}else{F=K.firstChild;while(F){if(F===M){return -1}else{if(F===L){return 1}}F=F.nextSibling}throw new Error("Should not be here!")}}}}}function A(F){var E=q(F).createDocumentFragment(),G;while((G=F.firstChild)){E.appendChild(G)}return E}function o(E){if(!E){return"[No node]"}if(m(E)){return'"'+E.data+'"'}else{if(E.nodeType==1){var F=E.id?' id="'+E.id+'"':"";return"<"+E.nodeName+F+">["+E.childNodes.length+"]"}else{return E.nodeName}}}function n(E){this.root=E;this._next=E}n.prototype={_current:null,hasNext:function(){return !!this._next},next:function(){var G=this._current=this._next;var F,E;if(this._current){F=G.firstChild;if(F){this._next=F}else{E=null;while((G!==this.root)&&!(E=G.nextSibling)){G=G.parentNode}this._next=E}}return this._current},detach:function(){this._current=this._next=this.root=null}};function h(E){return new n(E)}function k(E,F){this.node=E;this.offset=F}k.prototype={equals:function(E){return this.node===E.node&this.offset==E.offset},inspect:function(){return"[DomPosition("+o(this.node)+":"+this.offset+")]"}};function u(E){this.code=this[E];this.codeName=E;this.message="DOMException: "+this.codeName}u.prototype={INDEX_SIZE_ERR:1,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INVALID_STATE_ERR:11};u.prototype.toString=function(){return this.message};p.dom={arrayContains:y,isHtmlNamespace:i,parentElement:j,getNodeIndex:a,getNodeLength:g,getCommonAncestor:x,isAncestorOf:C,getClosestAncestorIn:z,isCharacterDataNode:m,insertAfter:v,splitDataNode:w,getDocument:q,getWindow:l,getIframeWindow:f,getIframeDocument:B,getBody:D,getRootContainer:c,comparePoints:r,inspectNode:o,fragmentFromNodeChildren:A,createIterator:h,DomPosition:k};p.DOMException=u});rangy.createModule("DomRange",function(i,f){i.requireModules(["DomUtil"]);var b=i.dom;var E=b.DomPosition;var T=i.DOMException;function x(al,e){return(al.nodeType!=3)&&(b.isAncestorOf(al,e.startContainer,true)||b.isAncestorOf(al,e.endContainer,true))}function m(e){return b.getDocument(e.startContainer)}function u(al,ap,am){var ao=al._listeners[ap];if(ao){for(var an=0,e=ao.length;an<e;++an){ao[an].call(al,{target:al,args:am})}}}function A(e){return new E(e.parentNode,b.getNodeIndex(e))}function W(e){return new E(e.parentNode,b.getNodeIndex(e)+1)}function j(al,an,am){var e=al.nodeType==11?al.firstChild:al;if(b.isCharacterDataNode(an)){if(am==an.length){b.insertAfter(al,an)}else{an.parentNode.insertBefore(al,am==0?an:b.splitDataNode(an,am))}}else{if(am>=an.childNodes.length){an.appendChild(al)}else{an.insertBefore(al,an.childNodes[am])}}return e}function H(am){var al;for(var an,ao=m(am.range).createDocumentFragment(),e;an=am.next();){al=am.isPartiallySelectedSubtree();an=an.cloneNode(!al);if(al){e=am.getSubtreeIterator();an.appendChild(H(e));e.detach(true)}if(an.nodeType==10){throw new T("HIERARCHY_REQUEST_ERR")}ao.appendChild(an)}return ao}function V(al,ao,e){var am,aq;e=e||{stop:false};for(var an,ap;an=al.next();){if(al.isPartiallySelectedSubtree()){if(ao(an)===false){e.stop=true;return}else{ap=al.getSubtreeIterator();V(ap,ao,e);ap.detach(true);if(e.stop){return}}}else{am=b.createIterator(an);while((aq=am.next())){if(ao(aq)===false){e.stop=true;return}}}}}function n(al){var e;while(al.next()){if(al.isPartiallySelectedSubtree()){e=al.getSubtreeIterator();n(e);e.detach(true)}else{al.remove()}}}function Q(al){for(var am,an=m(al.range).createDocumentFragment(),e;am=al.next();){if(al.isPartiallySelectedSubtree()){am=am.cloneNode(false);e=al.getSubtreeIterator();am.appendChild(Q(e));e.detach(true)}else{al.remove()}if(am.nodeType==10){throw new T("HIERARCHY_REQUEST_ERR")}an.appendChild(am)}return an}function p(am,e,an){var ap=!!(e&&e.length),ao;var aq=!!an;if(ap){ao=new RegExp("^("+e.join("|")+")$")}var al=[];V(new g(am,false),function(ar){if((!ap||ao.test(ar.nodeType))&&(!aq||an(ar))){al.push(ar)}});return al}function z(e){var al=(typeof e.getName=="undefined")?"Range":e.getName();return"["+al+"("+b.inspectNode(e.startContainer)+":"+e.startOffset+", "+b.inspectNode(e.endContainer)+":"+e.endOffset+")]"}function g(am,al){this.range=am;this.clonePartiallySelectedTextNodes=al;if(!am.collapsed){this.sc=am.startContainer;this.so=am.startOffset;this.ec=am.endContainer;this.eo=am.endOffset;var e=am.commonAncestorContainer;if(this.sc===this.ec&&b.isCharacterDataNode(this.sc)){this.isSingleCharacterDataNode=true;this._first=this._last=this._next=this.sc}else{this._first=this._next=(this.sc===e&&!b.isCharacterDataNode(this.sc))?this.sc.childNodes[this.so]:b.getClosestAncestorIn(this.sc,e,true);this._last=(this.ec===e&&!b.isCharacterDataNode(this.ec))?this.ec.childNodes[this.eo-1]:b.getClosestAncestorIn(this.ec,e,true)}}}g.prototype={_current:null,_next:null,_first:null,_last:null,isSingleCharacterDataNode:false,reset:function(){this._current=null;this._next=this._first},hasNext:function(){return !!this._next},next:function(){var e=this._current=this._next;if(e){this._next=(e!==this._last)?e.nextSibling:null;if(b.isCharacterDataNode(e)&&this.clonePartiallySelectedTextNodes){if(e===this.ec){(e=e.cloneNode(true)).deleteData(this.eo,e.length-this.eo)}if(this._current===this.sc){(e=e.cloneNode(true)).deleteData(0,this.so)}}}return e},remove:function(){var al=this._current,am,e;if(b.isCharacterDataNode(al)&&(al===this.sc||al===this.ec)){am=(al===this.sc)?this.so:0;e=(al===this.ec)?this.eo:al.length;if(am!=e){al.deleteData(am,e-am)}}else{if(al.parentNode){al.parentNode.removeChild(al)}else{}}},isPartiallySelectedSubtree:function(){var e=this._current;return x(e,this.range)},getSubtreeIterator:function(){var al;if(this.isSingleCharacterDataNode){al=this.range.cloneRange();al.collapse()}else{al=new aj(m(this.range));var ap=this._current;var an=ap,e=0,ao=ap,am=b.getNodeLength(ap);if(b.isAncestorOf(ap,this.sc,true)){an=this.sc;e=this.so}if(b.isAncestorOf(ap,this.ec,true)){ao=this.ec;am=this.eo}D(al,an,e,ao,am)}return new g(al,this.clonePartiallySelectedTextNodes)},detach:function(e){if(e){this.range.detach()}this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null}};function O(e){this.code=this[e];this.codeName=e;this.message="RangeException: "+this.codeName}O.prototype={BAD_BOUNDARYPOINTS_ERR:1,INVALID_NODE_TYPE_ERR:2};O.prototype.toString=function(){return this.message};function w(al,e,am){this.nodes=p(al,e,am);this._next=this.nodes[0];this._position=0}w.prototype={_current:null,hasNext:function(){return !!this._next},next:function(){this._current=this._next;this._next=this.nodes[++this._position];return this._current},detach:function(){this._current=this._next=this.nodes=null}};var ae=[1,3,4,5,7,8,10];var ac=[2,9,11];var B=[5,6,10,12];var M=[1,3,4,5,7,8,10,11];var F=[1,3,4,5,7,8];function Y(e){return function(am,ao){var al,an=ao?am:am.parentNode;while(an){al=an.nodeType;if(b.arrayContains(e,al)){return an}an=an.parentNode}return null}}var t=b.getRootContainer;var I=Y([9,11]);var K=Y(B);var c=Y([6,10,12]);function r(al,e){if(c(al,e)){throw new O("INVALID_NODE_TYPE_ERR")}}function C(e){if(!e.startContainer){throw new T("INVALID_STATE_ERR")}}function U(e,al){if(!b.arrayContains(al,e.nodeType)){throw new O("INVALID_NODE_TYPE_ERR")}}function ad(e,al){if(al<0||al>(b.isCharacterDataNode(e)?e.length:e.childNodes.length)){throw new T("INDEX_SIZE_ERR")}}function d(al,e){if(I(al,true)!==I(e,true)){throw new T("WRONG_DOCUMENT_ERR")}}function aa(e){if(K(e,true)){throw new T("NO_MODIFICATION_ALLOWED_ERR")}}function ah(al,e){if(!al){throw new T(e)}}function o(e){return !b.arrayContains(ac,e.nodeType)&&!I(e,true)}function ak(e,al){return al<=(b.isCharacterDataNode(e)?e.length:e.childNodes.length)}function h(e){C(e);if(o(e.startContainer)||o(e.endContainer)||!ak(e.startContainer,e.startOffset)||!ak(e.endContainer,e.endOffset)){throw new Error("Range error: Range is no longer valid after DOM mutation ("+e.inspect()+")")}}var a=document.createElement("style");var P=false;try{a.innerHTML="<b>x</b>";P=(a.firstChild.nodeType==3)}catch(ag){}i.features.htmlParsingConforms=P;var R=P?function(am){var al=this.startContainer;var an=b.getDocument(al);if(!al){throw new T("INVALID_STATE_ERR")}var e=null;if(al.nodeType==1){e=al}else{if(b.isCharacterDataNode(al)){e=b.parentElement(al)}}if(e===null||(e.nodeName=="HTML"&&b.isHtmlNamespace(b.getDocument(e).documentElement)&&b.isHtmlNamespace(e))){e=an.createElement("body")}else{e=e.cloneNode(false)}e.innerHTML=am;return b.fragmentFromNodeChildren(e)}:function(al){C(this);var am=m(this);var e=am.createElement("body");e.innerHTML=al;return b.fragmentFromNodeChildren(e)};var L=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"];var l=0,y=1,af=2,Z=3;var s=0,v=1,J=2,k=3;function ab(){}ab.prototype={attachListener:function(e,al){this._listeners[e].push(al)},compareBoundaryPoints:function(ap,am){h(this);d(this.startContainer,am.startContainer);var ar,al,aq,e;var ao=(ap==Z||ap==l)?"start":"end";var an=(ap==y||ap==l)?"start":"end";ar=this[ao+"Container"];al=this[ao+"Offset"];aq=am[an+"Container"];e=am[an+"Offset"];return b.comparePoints(ar,al,aq,e)},insertNode:function(al){h(this);U(al,M);aa(this.startContainer);if(b.isAncestorOf(al,this.startContainer,true)){throw new T("HIERARCHY_REQUEST_ERR")}var e=j(al,this.startContainer,this.startOffset);this.setStartBefore(e)},cloneContents:function(){h(this);var am,al;if(this.collapsed){return m(this).createDocumentFragment()}else{if(this.startContainer===this.endContainer&&b.isCharacterDataNode(this.startContainer)){am=this.startContainer.cloneNode(true);am.data=am.data.slice(this.startOffset,this.endOffset);al=m(this).createDocumentFragment();al.appendChild(am);return al}else{var e=new g(this,true);am=H(e);e.detach()}return am}},canSurroundContents:function(){h(this);aa(this.startContainer);aa(this.endContainer);var e=new g(this,true);var al=(e._first&&(x(e._first,this))||(e._last&&x(e._last,this)));e.detach();return !al},surroundContents:function(al){U(al,F);if(!this.canSurroundContents()){throw new O("BAD_BOUNDARYPOINTS_ERR")}var e=this.extractContents();if(al.hasChildNodes()){while(al.lastChild){al.removeChild(al.lastChild)}}j(al,this.startContainer,this.startOffset);al.appendChild(e);this.selectNode(al)},cloneRange:function(){h(this);var e=new aj(m(this));var al=L.length,am;while(al--){am=L[al];e[am]=this[am]}return e},toString:function(){h(this);var al=this.startContainer;if(al===this.endContainer&&b.isCharacterDataNode(al)){return(al.nodeType==3||al.nodeType==4)?al.data.slice(this.startOffset,this.endOffset):""}else{var am=[],e=new g(this,true);V(e,function(an){if(an.nodeType==3||an.nodeType==4){am.push(an.data)}});e.detach();return am.join("")}},compareNode:function(am){h(this);var al=am.parentNode;var ao=b.getNodeIndex(am);if(!al){throw new T("NOT_FOUND_ERR")}var an=this.comparePoint(al,ao),e=this.comparePoint(al,ao+1);if(an<0){return(e>0)?J:s}else{return(e>0)?v:k}},comparePoint:function(e,al){h(this);ah(e,"HIERARCHY_REQUEST_ERR");d(e,this.startContainer);if(b.comparePoints(e,al,this.startContainer,this.startOffset)<0){return -1}else{if(b.comparePoints(e,al,this.endContainer,this.endOffset)>0){return 1}}return 0},createContextualFragment:R,toHtml:function(){h(this);var e=m(this).createElement("div");e.appendChild(this.cloneContents());return e.innerHTML},intersectsNode:function(an,e){h(this);ah(an,"NOT_FOUND_ERR");if(b.getDocument(an)!==m(this)){return false}var am=an.parentNode,ap=b.getNodeIndex(an);ah(am,"NOT_FOUND_ERR");var ao=b.comparePoints(am,ap,this.endContainer,this.endOffset),al=b.comparePoints(am,ap+1,this.startContainer,this.startOffset);return e?ao<=0&&al>=0:ao<0&&al>0},isPointInRange:function(e,al){h(this);ah(e,"HIERARCHY_REQUEST_ERR");d(e,this.startContainer);return(b.comparePoints(e,al,this.startContainer,this.startOffset)>=0)&&(b.comparePoints(e,al,this.endContainer,this.endOffset)<=0)},intersectsRange:function(al,e){h(this);if(m(al)!=m(this)){throw new T("WRONG_DOCUMENT_ERR")}var an=b.comparePoints(this.startContainer,this.startOffset,al.endContainer,al.endOffset),am=b.comparePoints(this.endContainer,this.endOffset,al.startContainer,al.startOffset);return e?an<=0&&am>=0:an<0&&am>0},intersection:function(e){if(this.intersectsRange(e)){var an=b.comparePoints(this.startContainer,this.startOffset,e.startContainer,e.startOffset),al=b.comparePoints(this.endContainer,this.endOffset,e.endContainer,e.endOffset);var am=this.cloneRange();if(an==-1){am.setStart(e.startContainer,e.startOffset)}if(al==1){am.setEnd(e.endContainer,e.endOffset)}return am}return null},union:function(e){if(this.intersectsRange(e,true)){var al=this.cloneRange();if(b.comparePoints(e.startContainer,e.startOffset,this.startContainer,this.startOffset)==-1){al.setStart(e.startContainer,e.startOffset)}if(b.comparePoints(e.endContainer,e.endOffset,this.endContainer,this.endOffset)==1){al.setEnd(e.endContainer,e.endOffset)}return al}else{throw new O("Ranges do not intersect")}},containsNode:function(al,e){if(e){return this.intersectsNode(al,false)}else{return this.compareNode(al)==k}},containsNodeContents:function(e){return this.comparePoint(e,0)>=0&&this.comparePoint(e,b.getNodeLength(e))<=0},containsRange:function(e){return this.intersection(e).equals(e)},containsNodeText:function(an){var ao=this.cloneRange();ao.selectNode(an);var am=ao.getNodes([3]);if(am.length>0){ao.setStart(am[0],0);var e=am.pop();ao.setEnd(e,e.length);var al=this.containsRange(ao);ao.detach();return al}else{return this.containsNodeContents(an)}},createNodeIterator:function(e,al){h(this);return new w(this,e,al)},getNodes:function(e,al){h(this);return p(this,e,al)},getDocument:function(){return m(this)},collapseBefore:function(e){C(this);this.setEndBefore(e);this.collapse(false)},collapseAfter:function(e){C(this);this.setStartAfter(e);this.collapse(true)},getName:function(){return"DomRange"},equals:function(e){return aj.rangesEqual(this,e)},inspect:function(){return z(this)}};function S(e){e.START_TO_START=l;e.START_TO_END=y;e.END_TO_END=af;e.END_TO_START=Z;e.NODE_BEFORE=s;e.NODE_AFTER=v;e.NODE_BEFORE_AND_AFTER=J;e.NODE_INSIDE=k}function G(e){S(e);S(e.prototype)}function q(e,al){return function(){h(this);var ar=this.startContainer,aq=this.startOffset,am=this.commonAncestorContainer;var ao=new g(this,true);var ap,at;if(ar!==am){ap=b.getClosestAncestorIn(ar,am,true);at=W(ap);ar=at.node;aq=at.offset}V(ao,aa);ao.reset();var an=e(ao);ao.detach();al(this,ar,aq,ar,aq);return an}}function X(an,aq,e){function ap(at,ar){return function(au){C(this);U(au,ae);U(t(au),ac);var av=(at?A:W)(au);(ar?am:ao)(this,av.node,av.offset)}}function am(at,av,aw){var au=at.endContainer,ar=at.endOffset;if(av!==at.startContainer||aw!==at.startOffset){if(t(av)!=t(au)||b.comparePoints(av,aw,au,ar)==1){au=av;ar=aw}aq(at,av,aw,au,ar)}}function ao(ar,at,aw){var av=ar.startContainer,au=ar.startOffset;if(at!==ar.endContainer||aw!==ar.endOffset){if(t(at)!=t(av)||b.comparePoints(at,aw,av,au)==-1){av=at;au=aw}aq(ar,av,au,at,aw)}}function al(ar,at,au){if(at!==ar.startContainer||au!==ar.startOffset||at!==ar.endContainer||au!==ar.endOffset){aq(ar,at,au,at,au)}}an.prototype=new ab();i.util.extend(an.prototype,{setStart:function(ar,at){C(this);r(ar,true);ad(ar,at);am(this,ar,at)},setEnd:function(ar,at){C(this);r(ar,true);ad(ar,at);ao(this,ar,at)},setStartBefore:ap(true,true),setStartAfter:ap(false,true),setEndBefore:ap(true,false),setEndAfter:ap(false,false),collapse:function(ar){h(this);if(ar){aq(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset)}else{aq(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)}},selectNodeContents:function(ar){C(this);r(ar,true);aq(this,ar,0,ar,b.getNodeLength(ar))},selectNode:function(at){C(this);r(at,false);U(at,ae);var au=A(at),ar=W(at);aq(this,au.node,au.offset,ar.node,ar.offset)},extractContents:q(Q,aq),deleteContents:q(n,aq),canSurroundContents:function(){h(this);aa(this.startContainer);aa(this.endContainer);var ar=new g(this,true);var at=(ar._first&&(x(ar._first,this))||(ar._last&&x(ar._last,this)));ar.detach();return !at},detach:function(){e(this)},splitBoundaries:function(){h(this);var aw=this.startContainer,av=this.startOffset,at=this.endContainer,ar=this.endOffset;var au=(aw===at);if(b.isCharacterDataNode(at)&&ar>0&&ar<at.length){b.splitDataNode(at,ar)}if(b.isCharacterDataNode(aw)&&av>0&&av<aw.length){aw=b.splitDataNode(aw,av);if(au){ar-=av;at=aw}else{if(at==aw.parentNode&&ar>=b.getNodeIndex(aw)){ar++}}av=0}aq(this,aw,av,at,ar)},normalizeBoundaries:function(){h(this);var az=this.startContainer,au=this.startOffset,ay=this.endContainer,ar=this.endOffset;var av=function(aC){var aB=aC.nextSibling;if(aB&&aB.nodeType==aC.nodeType){ay=aC;ar=aC.length;aC.appendData(aB.data);aB.parentNode.removeChild(aB)}};var aA=function(aD){var aC=aD.previousSibling;if(aC&&aC.nodeType==aD.nodeType){az=aD;var aB=aD.length;au=aC.length;aD.insertData(0,aC.data);aC.parentNode.removeChild(aC);if(az==ay){ar+=au;ay=az}else{if(ay==aD.parentNode){var aE=b.getNodeIndex(aD);if(ar==aE){ay=aD;ar=aB}else{if(ar>aE){ar--}}}}}};var ax=true;if(b.isCharacterDataNode(ay)){if(ay.length==ar){av(ay)}}else{if(ar>0){var aw=ay.childNodes[ar-1];if(aw&&b.isCharacterDataNode(aw)){av(aw)}}ax=!this.collapsed}if(ax){if(b.isCharacterDataNode(az)){if(au==0){aA(az)}}else{if(au<az.childNodes.length){var at=az.childNodes[au];if(at&&b.isCharacterDataNode(at)){aA(at)}}}}else{az=ay;au=ar}aq(this,az,au,ay,ar)},collapseToPoint:function(ar,at){C(this);r(ar,true);ad(ar,at);al(this,ar,at)}});G(an)}function N(e){e.collapsed=(e.startContainer===e.endContainer&&e.startOffset===e.endOffset);e.commonAncestorContainer=e.collapsed?e.startContainer:b.getCommonAncestor(e.startContainer,e.endContainer)}function D(am,ao,al,ap,an){var e=(am.startContainer!==ao||am.startOffset!==al);var aq=(am.endContainer!==ap||am.endOffset!==an);am.startContainer=ao;am.startOffset=al;am.endContainer=ap;am.endOffset=an;N(am);u(am,"boundarychange",{startMoved:e,endMoved:aq})}function ai(e){C(e);e.startContainer=e.startOffset=e.endContainer=e.endOffset=null;e.collapsed=e.commonAncestorContainer=null;u(e,"detach",null);e._listeners=null}function aj(e){this.startContainer=e;this.startOffset=0;this.endContainer=e;this.endOffset=0;this._listeners={boundarychange:[],detach:[]};N(this)}X(aj,D,ai);i.rangePrototype=ab.prototype;aj.rangeProperties=L;aj.RangeIterator=g;aj.copyComparisonConstants=G;aj.createPrototypeRange=X;aj.inspect=z;aj.getRangeDocument=m;aj.rangesEqual=function(al,e){return al.startContainer===e.startContainer&&al.startOffset===e.startOffset&&al.endContainer===e.endContainer&&al.endOffset===e.endOffset};i.DomRange=aj;i.RangeException=O});rangy.createModule("WrappedRange",function(i,d){i.requireModules(["DomUtil","DomRange"]);var a;var h=i.dom;var b=h.DomPosition;var j=i.DomRange;function e(q){var o=q.parentElement();var m=q.duplicate();m.collapse(true);var p=m.parentElement();m=q.duplicate();m.collapse(false);var n=m.parentElement();var l=(p==n)?p:h.getCommonAncestor(p,n);return l==o?l:h.getCommonAncestor(o,l)}function c(l){return l.compareEndPoints("StartToEnd",l)==0}function f(z,w,n,s){var A=z.duplicate();A.collapse(n);var y=A.parentElement();if(!h.isAncestorOf(w,y,true)){y=w}if(!y.canHaveHTML){return new b(y.parentNode,h.getNodeIndex(y))}var m=h.getDocument(y).createElement("span");var x,u=n?"StartToStart":"StartToEnd";var v,q,l,o;do{y.insertBefore(m,m.previousSibling);A.moveToElementText(m)}while((x=A.compareEndPoints(u,z))>0&&m.previousSibling);o=m.nextSibling;if(x==-1&&o&&h.isCharacterDataNode(o)){A.setEndPoint(n?"EndToStart":"EndToEnd",z);var r;if(/[\r\n]/.test(o.data)){var t=A.duplicate();var p=t.text.replace(/\r\n/g,"\r").length;r=t.moveStart("character",p);while((x=t.compareEndPoints("StartToEnd",t))==-1){r++;t.moveStart("character",1)}}else{r=A.text.length}l=new b(o,r)}else{v=(s||!n)&&m.previousSibling;q=(s||n)&&m.nextSibling;if(q&&h.isCharacterDataNode(q)){l=new b(q,0)}else{if(v&&h.isCharacterDataNode(v)){l=new b(v,v.length)}else{l=new b(y,h.getNodeIndex(m))}}}m.parentNode.removeChild(m);return l}function k(l,n){var o,r,p=l.offset;var s=h.getDocument(l.node);var m,t,u=s.body.createTextRange();var q=h.isCharacterDataNode(l.node);if(q){o=l.node;r=o.parentNode}else{t=l.node.childNodes;o=(p<t.length)?t[p]:null;r=l.node}m=s.createElement("span");m.innerHTML="&#feff;";if(o){r.insertBefore(m,o)}else{r.appendChild(m)}u.moveToElementText(m);u.collapse(!n);r.removeChild(m);if(q){u[n?"moveStart":"moveEnd"]("character",p)}return u}if(i.features.implementsDomRange&&(!i.features.implementsTextRange||!i.config.preferTextRange)){(function(){var n;var s=j.rangeProperties;var v;function l(w){var x=s.length,y;while(x--){y=s[x];w[y]=w.nativeRange[y]}}function o(y,A,x,B,z){var w=(y.startContainer!==A||y.startOffset!=x);var C=(y.endContainer!==B||y.endOffset!=z);if(w||C){y.setEnd(B,z);y.setStart(A,x)}}function t(w){w.nativeRange.detach();w.detached=true;var x=s.length,y;while(x--){y=s[x];w[y]=null}}var m;a=function(w){if(!w){throw new Error("Range must be specified")}this.nativeRange=w;l(this)};j.createPrototypeRange(a,o,t);n=a.prototype;n.selectNode=function(w){this.nativeRange.selectNode(w);l(this)};n.deleteContents=function(){this.nativeRange.deleteContents();l(this)};n.extractContents=function(){var w=this.nativeRange.extractContents();l(this);return w};n.cloneContents=function(){return this.nativeRange.cloneContents()};n.surroundContents=function(w){this.nativeRange.surroundContents(w);l(this)};n.collapse=function(w){this.nativeRange.collapse(w);l(this)};n.cloneRange=function(){return new a(this.nativeRange.cloneRange())};n.refresh=function(){l(this)};n.toString=function(){return this.nativeRange.toString()};var r=document.createTextNode("test");h.getBody(document).appendChild(r);var p=document.createRange();p.setStart(r,0);p.setEnd(r,0);try{p.setStart(r,1);v=true;n.setStart=function(w,x){this.nativeRange.setStart(w,x);l(this)};n.setEnd=function(w,x){this.nativeRange.setEnd(w,x);l(this)};m=function(w){return function(x){this.nativeRange[w](x);l(this)}}}catch(q){v=false;n.setStart=function(x,y){try{this.nativeRange.setStart(x,y)}catch(w){this.nativeRange.setEnd(x,y);this.nativeRange.setStart(x,y)}l(this)};n.setEnd=function(x,y){try{this.nativeRange.setEnd(x,y)}catch(w){this.nativeRange.setStart(x,y);this.nativeRange.setEnd(x,y)}l(this)};m=function(w,x){return function(z){try{this.nativeRange[w](z)}catch(y){this.nativeRange[x](z);this.nativeRange[w](z)}l(this)}}}n.setStartBefore=m("setStartBefore","setEndBefore");n.setStartAfter=m("setStartAfter","setEndAfter");n.setEndBefore=m("setEndBefore","setStartBefore");n.setEndAfter=m("setEndAfter","setStartAfter");p.selectNodeContents(r);if(p.startContainer==r&&p.endContainer==r&&p.startOffset==0&&p.endOffset==r.length){n.selectNodeContents=function(w){this.nativeRange.selectNodeContents(w);l(this)}}else{n.selectNodeContents=function(w){this.setStart(w,0);this.setEnd(w,j.getEndOffset(w))}}p.selectNodeContents(r);p.setEnd(r,3);var u=document.createRange();u.selectNodeContents(r);u.setEnd(r,4);u.setStart(r,2);if(p.compareBoundaryPoints(p.START_TO_END,u)==-1&p.compareBoundaryPoints(p.END_TO_START,u)==1){n.compareBoundaryPoints=function(x,w){w=w.nativeRange||w;if(x==w.START_TO_END){x=w.END_TO_START}else{if(x==w.END_TO_START){x=w.START_TO_END}}return this.nativeRange.compareBoundaryPoints(x,w)}}else{n.compareBoundaryPoints=function(x,w){return this.nativeRange.compareBoundaryPoints(x,w.nativeRange||w)}}if(i.util.isHostMethod(p,"createContextualFragment")){n.createContextualFragment=function(w){return this.nativeRange.createContextualFragment(w)}}h.getBody(document).removeChild(r);p.detach();u.detach()})();i.createNativeRange=function(l){l=l||document;return l.createRange()}}else{if(i.features.implementsTextRange){a=function(l){this.textRange=l;this.refresh()};a.prototype=new j(document);a.prototype.refresh=function(){var n,l;var m=e(this.textRange);if(c(this.textRange)){l=n=f(this.textRange,m,true,true)}else{n=f(this.textRange,m,true,false);l=f(this.textRange,m,false,false)}this.setStart(n.node,n.offset);this.setEnd(l.node,l.offset)};j.copyComparisonConstants(a);var g=(function(){return this})();if(typeof g.Range=="undefined"){g.Range=a}i.createNativeRange=function(l){l=l||document;return l.body.createTextRange()}}}if(i.features.implementsTextRange){a.rangeToTextRange=function(l){if(l.collapsed){var o=k(new b(l.startContainer,l.startOffset),true);return o}else{var p=k(new b(l.startContainer,l.startOffset),true);var n=k(new b(l.endContainer,l.endOffset),false);var m=h.getDocument(l.startContainer).body.createTextRange();m.setEndPoint("StartToStart",p);m.setEndPoint("EndToEnd",n);return m}}}a.prototype.getName=function(){return"WrappedRange"};i.WrappedRange=a;i.createRange=function(l){l=l||document;return new a(i.createNativeRange(l))};i.createRangyRange=function(l){l=l||document;return new j(l)};i.createIframeRange=function(l){return i.createRange(h.getIframeDocument(l))};i.createIframeRangyRange=function(l){return i.createRangyRange(h.getIframeDocument(l))};i.addCreateMissingNativeApiListener(function(m){var l=m.document;if(typeof l.createRange=="undefined"){l.createRange=function(){return i.createRange(this)}}l=m=null})});rangy.createModule("WrappedSelection",function(g,d){g.requireModules(["DomUtil","DomRange","WrappedRange"]);g.config.checkSelectionRanges=true;var D="boolean",T="_rangySelection",c=g.dom,l=g.util,Q=g.DomRange,e=g.WrappedRange,N=g.DOMException,y=c.DomPosition,w,n,U="Control";function m(W){return(W||window).getSelection()}function q(W){return(W||window).document.selection}var S=g.util.isHostMethod(window,"getSelection"),M=g.util.isHostObject(document,"selection");var u=M&&(!S||g.config.preferTextRange);if(u){w=q;g.isSelectionValid=function(X){var Y=(X||window).document,W=Y.selection;return(W.type!="None"||c.getDocument(W.createRange().parentElement())==Y)}}else{if(S){w=m;g.isSelectionValid=function(){return true}}else{d.fail("Neither document.selection or window.getSelection() detected.")}}g.getNativeSelection=w;var L=w();var B=g.createNativeRange(document);var C=c.getBody(document);var J=l.areHostObjects(L,["anchorNode","focusNode"]&&l.areHostProperties(L,["anchorOffset","focusOffset"]));g.features.selectionHasAnchorAndFocus=J;var p=l.isHostMethod(L,"extend");g.features.selectionHasExtend=p;var V=(typeof L.rangeCount=="number");g.features.selectionHasRangeCount=V;var P=false;var O=true;if(l.areHostMethods(L,["addRange","getRangeAt","removeAllRanges"])&&typeof L.rangeCount=="number"&&g.features.implementsDomRange){(function(){var Y=document.createElement("iframe");C.appendChild(Y);var ac=c.getIframeDocument(Y);ac.open();ac.write("<html><head></head><body>12</body></html>");ac.close();var aa=c.getIframeWindow(Y).getSelection();var ad=ac.documentElement;var Z=ad.lastChild,ab=Z.firstChild;var X=ac.createRange();X.setStart(ab,1);X.collapse(true);aa.addRange(X);O=(aa.rangeCount==1);aa.removeAllRanges();var W=X.cloneRange();X.setStart(ab,0);W.setEnd(ab,2);aa.addRange(X);aa.addRange(W);P=(aa.rangeCount==2);X.detach();W.detach();C.removeChild(Y)})()}g.features.selectionSupportsMultipleRanges=P;g.features.collapsedNonEditableSelectionsSupported=O;var f=false,j;if(C&&l.isHostMethod(C,"createControlRange")){j=C.createControlRange();if(l.areHostProperties(j,["item","add"])){f=true}}g.features.implementsControlRange=f;if(J){n=function(W){return W.anchorNode===W.focusNode&&W.anchorOffset===W.focusOffset}}else{n=function(W){return W.rangeCount?W.getRangeAt(W.rangeCount-1).collapsed:false}}function b(Z,X,W){var Y=W?"end":"start",aa=W?"start":"end";Z.anchorNode=X[Y+"Container"];Z.anchorOffset=X[Y+"Offset"];Z.focusNode=X[aa+"Container"];Z.focusOffset=X[aa+"Offset"]}function v(X){var W=X.nativeSelection;X.anchorNode=W.anchorNode;X.anchorOffset=W.anchorOffset;X.focusNode=W.focusNode;X.focusOffset=W.focusOffset}function G(W){W.anchorNode=W.focusNode=null;W.anchorOffset=W.focusOffset=0;W.rangeCount=0;W.isCollapsed=true;W._ranges.length=0}function I(W){var X;if(W instanceof Q){X=W._selectionNativeRange;if(!X){X=g.createNativeRange(c.getDocument(W.startContainer));X.setEnd(W.endContainer,W.endOffset);X.setStart(W.startContainer,W.startOffset);W._selectionNativeRange=X;W.attachListener("detach",function(){this._selectionNativeRange=null})}}else{if(W instanceof e){X=W.nativeRange}else{if(g.features.implementsDomRange&&(W instanceof c.getWindow(W.startContainer).Range)){X=W}}}return X}function k(Y){if(!Y.length||Y[0].nodeType!=1){return false}for(var X=1,W=Y.length;X<W;++X){if(!c.isAncestorOf(Y[0],Y[X])){return false}}return true}function K(X){var W=X.getNodes();if(!k(W)){throw new Error("getSingleElementFromRange: range "+X.inspect()+" did not consist of a single element")}return W[0]}function F(W){return !!W&&typeof W.text!="undefined"}function H(Y,X){var W=new e(X);Y._ranges=[W];b(Y,W,false);Y.rangeCount=1;Y.isCollapsed=W.collapsed}function t(Z){Z._ranges.length=0;if(Z.docSelection.type=="None"){G(Z)}else{var Y=Z.docSelection.createRange();if(F(Y)){H(Z,Y)}else{Z.rangeCount=Y.length;var W,aa=c.getDocument(Y.item(0));for(var X=0;X<Z.rangeCount;++X){W=g.createRange(aa);W.selectNode(Y.item(X));Z._ranges.push(W)}Z.isCollapsed=Z.rangeCount==1&&Z._ranges[0].collapsed;b(Z,Z._ranges[Z.rangeCount-1],false)}}}function x(X,aa){var Y=X.docSelection.createRange();var W=K(aa);var ae=c.getDocument(Y.item(0));var ab=c.getBody(ae).createControlRange();for(var Z=0,ac=Y.length;Z<ac;++Z){ab.add(Y.item(Z))}try{ab.add(W)}catch(ad){throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")}ab.select();t(X)}var o;if(l.isHostMethod(L,"getRangeAt")){o=function(Y,W){try{return Y.getRangeAt(W)}catch(X){return null}}}else{if(J){o=function(X){var Y=c.getDocument(X.anchorNode);var W=g.createRange(Y);W.setStart(X.anchorNode,X.anchorOffset);W.setEnd(X.focusNode,X.focusOffset);if(W.collapsed!==this.isCollapsed){W.setStart(X.focusNode,X.focusOffset);W.setEnd(X.anchorNode,X.anchorOffset)}return W}}}function A(W,Y,X){this.nativeSelection=W;this.docSelection=Y;this._ranges=[];this.win=X;this.refresh()}g.getSelection=function(Y){Y=Y||window;var X=Y[T];var W=w(Y),Z=M?q(Y):null;if(X){X.nativeSelection=W;X.docSelection=Z;X.refresh(Y)}else{X=new A(W,Z,Y);Y[T]=X}return X};g.getIframeSelection=function(W){return g.getSelection(c.getIframeWindow(W))};var a=A.prototype;function i(ab,W){var ac=c.getDocument(W[0].startContainer);var Z=c.getBody(ac).createControlRange();for(var Y=0,aa;Y<rangeCount;++Y){aa=K(W[Y]);try{Z.add(aa)}catch(X){throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)")}}Z.select();t(ab)}if(!u&&J&&l.areHostMethods(L,["removeAllRanges","addRange"])){a.removeAllRanges=function(){this.nativeSelection.removeAllRanges();G(this)};var h=function(Y,W){var Z=Q.getRangeDocument(W);var X=g.createRange(Z);X.collapseToPoint(W.endContainer,W.endOffset);Y.nativeSelection.addRange(I(X));Y.nativeSelection.extend(W.startContainer,W.startOffset);Y.refresh()};if(V){a.addRange=function(X,W){if(f&&M&&this.docSelection.type==U){x(this,X)}else{if(W&&p){h(this,X)}else{var Y;if(P){Y=this.rangeCount}else{this.removeAllRanges();Y=0}this.nativeSelection.addRange(I(X));this.rangeCount=this.nativeSelection.rangeCount;if(this.rangeCount==Y+1){if(g.config.checkSelectionRanges){var Z=o(this.nativeSelection,this.rangeCount-1);if(Z&&!Q.rangesEqual(Z,X)){X=new e(Z)}}this._ranges[this.rangeCount-1]=X;b(this,X,r(this.nativeSelection));this.isCollapsed=n(this)}else{this.refresh()}}}}}else{a.addRange=function(X,W){if(W&&p){h(this,X)}else{this.nativeSelection.addRange(I(X));this.refresh()}}}a.setRanges=function(X){if(f&&X.length>1){i(this,X)}else{this.removeAllRanges();for(var Y=0,W=X.length;Y<W;++Y){this.addRange(X[Y])}}}}else{if(l.isHostMethod(L,"empty")&&l.isHostMethod(B,"select")&&f&&u){a.removeAllRanges=function(){try{this.docSelection.empty();if(this.docSelection.type!="None"){var Z;if(this.anchorNode){Z=c.getDocument(this.anchorNode)}else{if(this.docSelection.type==U){var X=this.docSelection.createRange();if(X.length){Z=c.getDocument(X.item(0)).body.createTextRange()}}}if(Z){var Y=Z.body.createTextRange();Y.select();this.docSelection.empty()}}}catch(W){}G(this)};a.addRange=function(W){if(this.docSelection.type==U){x(this,W)}else{e.rangeToTextRange(W).select();this._ranges[0]=W;this.rangeCount=1;this.isCollapsed=this._ranges[0].collapsed;b(this,W,false)}};a.setRanges=function(W){this.removeAllRanges();var X=W.length;if(X>1){i(this,W)}else{if(X){this.addRange(W[0])}}}}else{d.fail("No means of selecting a Range or TextRange was found");return false}}a.getRangeAt=function(W){if(W<0||W>=this.rangeCount){throw new N("INDEX_SIZE_ERR")}else{return this._ranges[W]}};var E;if(u){E=function(X){var W;if(g.isSelectionValid(X.win)){W=X.docSelection.createRange()}else{W=c.getBody(X.win.document).createTextRange();W.collapse(true)}if(X.docSelection.type==U){t(X)}else{if(F(W)){H(X,W)}else{G(X)}}}}else{if(l.isHostMethod(L,"getRangeAt")&&typeof L.rangeCount=="number"){E=function(Y){if(f&&M&&Y.docSelection.type==U){t(Y)}else{Y._ranges.length=Y.rangeCount=Y.nativeSelection.rangeCount;if(Y.rangeCount){for(var X=0,W=Y.rangeCount;X<W;++X){Y._ranges[X]=new g.WrappedRange(Y.nativeSelection.getRangeAt(X))}b(Y,Y._ranges[Y.rangeCount-1],r(Y.nativeSelection));Y.isCollapsed=n(Y)}else{G(Y)}}}}else{if(J&&typeof L.isCollapsed==D&&typeof B.collapsed==D&&g.features.implementsDomRange){E=function(Y){var W,X=Y.nativeSelection;if(X.anchorNode){W=o(X,0);Y._ranges=[W];Y.rangeCount=1;v(Y);Y.isCollapsed=n(Y)}else{G(Y)}}}else{d.fail("No means of obtaining a Range or TextRange from the user's selection was found");return false}}}a.refresh=function(X){var W=X?this._ranges.slice(0):null;E(this);if(X){var Y=W.length;if(Y!=this._ranges.length){return false}while(Y--){if(!Q.rangesEqual(W[Y],this._ranges[Y])){return false}}return true}};var z=function(aa,Y){var X=aa.getAllRanges(),ab=false;aa.removeAllRanges();for(var Z=0,W=X.length;Z<W;++Z){if(ab||Y!==X[Z]){aa.addRange(X[Z])}else{ab=true}}if(!aa.rangeCount){G(aa)}};if(f){a.removeRange=function(aa){if(this.docSelection.type==U){var Y=this.docSelection.createRange();var W=K(aa);var ae=c.getDocument(Y.item(0));var ac=c.getBody(ae).createControlRange();var X,ad=false;for(var Z=0,ab=Y.length;Z<ab;++Z){X=Y.item(Z);if(X!==W||ad){ac.add(Y.item(Z))}else{ad=true}}ac.select();t(this)}else{z(this,aa)}}}else{a.removeRange=function(W){z(this,W)}}var r;if(!u&&J&&g.features.implementsDomRange){r=function(X){var W=false;if(X.anchorNode){W=(c.comparePoints(X.anchorNode,X.anchorOffset,X.focusNode,X.focusOffset)==1)}return W};a.isBackwards=function(){return r(this)}}else{r=a.isBackwards=function(){return false}}a.toString=function(){var Y=[];for(var X=0,W=this.rangeCount;X<W;++X){Y[X]=""+this._ranges[X]}return Y.join("")};function R(X,W){if(X.anchorNode&&(c.getDocument(X.anchorNode)!==c.getDocument(W))){throw new N("WRONG_DOCUMENT_ERR")}}a.collapse=function(X,Y){R(this,X);var W=g.createRange(c.getDocument(X));W.collapseToPoint(X,Y);this.removeAllRanges();this.addRange(W);this.isCollapsed=true};a.collapseToStart=function(){if(this.rangeCount){var W=this._ranges[0];this.collapse(W.startContainer,W.startOffset)}else{throw new N("INVALID_STATE_ERR")}};a.collapseToEnd=function(){if(this.rangeCount){var W=this._ranges[this.rangeCount-1];this.collapse(W.endContainer,W.endOffset)}else{throw new N("INVALID_STATE_ERR")}};a.selectAllChildren=function(X){R(this,X);var W=g.createRange(c.getDocument(X));W.selectNodeContents(X);this.removeAllRanges();this.addRange(W)};a.deleteFromDocument=function(){if(f&&M&&this.docSelection.type==U){var aa=this.docSelection.createRange();var Z;while(aa.length){Z=aa.item(0);aa.remove(Z);Z.parentNode.removeChild(Z)}this.refresh()}else{if(this.rangeCount){var X=this.getAllRanges();this.removeAllRanges();for(var Y=0,W=X.length;Y<W;++Y){X[Y].deleteContents()}this.addRange(X[W-1])}}};a.getAllRanges=function(){return this._ranges.slice(0)};a.setSingleRange=function(W){this.setRanges([W])};a.containsNode=function(Z,X){for(var Y=0,W=this._ranges.length;Y<W;++Y){if(this._ranges[Y].containsNode(Z,X)){return true}}return false};a.toHtml=function(){var Z="";if(this.rangeCount){var X=Q.getRangeDocument(this._ranges[0]).createElement("div");for(var Y=0,W=this._ranges.length;Y<W;++Y){X.appendChild(this._ranges[Y].cloneContents())}Z=X.innerHTML}return Z};function s(ac){var ab=[];var Z=new y(ac.anchorNode,ac.anchorOffset);var X=new y(ac.focusNode,ac.focusOffset);var Y=(typeof ac.getName=="function")?ac.getName():"Selection";if(typeof ac.rangeCount!="undefined"){for(var aa=0,W=ac.rangeCount;aa<W;++aa){ab[aa]=Q.inspect(ac.getRangeAt(aa))}}return"["+Y+"(Ranges: "+ab.join(", ")+")(anchor: "+Z.inspect()+", focus: "+X.inspect()+"]"}a.getName=function(){return"WrappedSelection"};a.inspect=function(){return s(this)};a.detach=function(){this.win[T]=null;this.win=this.anchorNode=this.focusNode=null};A.inspect=s;g.Selection=A;g.selectionPrototype=a;g.addCreateMissingNativeApiListener(function(W){if(typeof W.getSelection=="undefined"){W.getSelection=function(){return g.getSelection(this)}}W=null})});var Base=function(){};Base.extend=function(b,e){var f=Base.prototype.extend;Base._prototyping=true;var d=new this;f.call(d,b);d.base=function(){};delete Base._prototyping;var c=d.constructor;var a=d.constructor=function(){if(!Base._prototyping){if(this._constructing||this.constructor==a){this._constructing=true;c.apply(this,arguments);delete this._constructing}else{if(arguments[0]!=null){return(arguments[0].extend||f).call(arguments[0],d)}}}};a.ancestor=this;a.extend=this.extend;a.forEach=this.forEach;a.implement=this.implement;a.prototype=d;a.toString=this.toString;a.valueOf=function(g){return(g=="object")?a:c.valueOf()};f.call(a,e);if(typeof a.init=="function"){a.init()}return a};Base.prototype={extend:function(b,h){if(arguments.length>1){var e=this[b];if(e&&(typeof h=="function")&&(!e.valueOf||e.valueOf()!=h.valueOf())&&/\bbase\b/.test(h)){var a=h.valueOf();h=function(){var k=this.base||Base.prototype.base;this.base=e;var i=a.apply(this,arguments);this.base=k;return i};h.valueOf=function(i){return(i=="object")?h:a};h.toString=Base.toString}this[b]=h}else{if(b){var g=Base.prototype.extend;if(!Base._prototyping&&typeof this!="function"){g=this.extend||g}var d={toSource:null};var f=["constructor","toString","valueOf"];var c=Base._prototyping?0:1;while(j=f[c++]){if(b[j]!=d[j]){g.call(this,j,b[j])}}for(var j in b){if(!d[j]){g.call(this,j,b[j])}}}}return this}};Base=Base.extend({constructor:function(){this.extend(arguments[0])}},{ancestor:Object,version:"1.1",forEach:function(a,d,c){for(var b in a){if(this.prototype[b]===undefined){d.call(c,a[b],b,a)}}},implement:function(){for(var a=0;a<arguments.length;a++){if(typeof arguments[a]=="function"){arguments[a](this.prototype)}else{this.prototype.extend(arguments[a])}}return this},toString:function(){return String(this.valueOf())}});wysihtml5.browser=(function(){var f=navigator.userAgent,e=document.createElement("div"),c=f.indexOf("MSIE")!==-1&&f.indexOf("Opera")===-1,a=f.indexOf("Gecko")!==-1&&f.indexOf("KHTML")===-1,d=f.indexOf("AppleWebKit/")!==-1,g=f.indexOf("Chrome/")!==-1,b=f.indexOf("Opera/")!==-1;function h(i){return((/ipad|iphone|ipod/.test(i)&&i.match(/ os (\d+).+? like mac os x/))||[,0])[1]}return{USER_AGENT:f,supported:function(){var k=this.USER_AGENT.toLowerCase(),m="contentEditable" in e,i=document.execCommand&&document.queryCommandSupported&&document.queryCommandState,j=document.querySelector&&document.querySelectorAll,l=(this.isIos()&&h(k)<5)||k.indexOf("opera mobi")!==-1||k.indexOf("hpwos/")!==-1;return m&&i&&j&&!l},isTouchDevice:function(){return this.supportsEvent("touchmove")},isIos:function(){var i=this.USER_AGENT.toLowerCase();return i.indexOf("webkit")!==-1&&i.indexOf("mobile")!==-1},supportsSandboxedIframes:function(){return c},throwsMixedContentWarningWhenIframeSrcIsEmpty:function(){return !("querySelector" in document)},displaysCaretInEmptyContentEditableCorrectly:function(){return !a},hasCurrentStyleProperty:function(){return"currentStyle" in e},insertsLineBreaksOnReturn:function(){return a},supportsPlaceholderAttributeOn:function(i){return"placeholder" in i},supportsEvent:function(i){return"on"+i in e||(function(){e.setAttribute("on"+i,"return;");return typeof(e["on"+i])==="function"})()},supportsEventsInIframeCorrectly:function(){return !b},firesOnDropOnlyWhenOnDragOverIsCancelled:function(){return d||a},supportsDataTransfer:function(){try{return d&&(window.Clipboard||window.DataTransfer).prototype.getData}catch(i){return false}},supportsHTML5Tags:function(k){var j=k.createElement("div"),i="<article>foo</article>";j.innerHTML=i;return j.innerHTML.toLowerCase()===i},supportsCommand:(function(){var j={"formatBlock":c,"insertUnorderedList":c||b||d,"insertOrderedList":c||b||d};var i={"insertHTML":a};return function(l,n){var o=j[n];if(!o){try{return l.queryCommandSupported(n)}catch(m){}try{return l.queryCommandEnabled(n)}catch(k){return !!i[n]}}return false}})(),doesAutoLinkingInContentEditable:function(){return c},canDisableAutoLinking:function(){return this.supportsCommand(document,"AutoUrlDetect")},clearsContentEditableCorrectly:function(){return a||b||d},supportsGetAttributeCorrectly:function(){var i=document.createElement("td");return i.getAttribute("rowspan")!="1"},canSelectImagesInContentEditable:function(){return a||c||b},clearsListsInContentEditableCorrectly:function(){return a||c||d},autoScrollsToCaret:function(){return !d},autoClosesUnclosedTags:function(){var k=e.cloneNode(false),i,j;k.innerHTML="<p><div></div>";j=k.innerHTML.toLowerCase();i=j==="<p></p><div></div>"||j==="<p><div></div></p>";this.autoClosesUnclosedTags=function(){return i};return i},supportsNativeGetElementsByClassName:function(){return String(document.getElementsByClassName).indexOf("[native code]")!==-1},supportsSelectionModify:function(){return"getSelection" in window&&"modify" in window.getSelection()},supportsClassList:function(){return"classList" in e},needsSpaceAfterLineBreak:function(){return b},supportsSpeechApiOn:function(i){var j=f.match(/Chrome\/(\d+)/)||[,0];return j[1]>=11&&("onwebkitspeechchange" in i||"speech" in i)},crashesWhenDefineProperty:function(i){return c&&(i==="XMLHttpRequest"||i==="XDomainRequest")},doesAsyncFocus:function(){return c},hasProblemsSettingCaretAfterImg:function(){return c},hasUndoInContextMenu:function(){return a||g||b}}})();wysihtml5.lang.array=function(a){return{contains:function(d){if(a.indexOf){return a.indexOf(d)!==-1}else{for(var b=0,c=a.length;b<c;b++){if(a[b]===d){return true}}return false}},without:function(b){b=wysihtml5.lang.array(b);var d=[],c=0,e=a.length;for(;c<e;c++){if(!b.contains(a[c])){d.push(a[c])}}return d},get:function(){var c=0,d=a.length,b=[];for(;c<d;c++){b.push(a[c])}return b}}};wysihtml5.lang.Dispatcher=Base.extend({observe:function(a,b){this.events=this.events||{};this.events[a]=this.events[a]||[];this.events[a].push(b);return this},on:function(){return this.observe.apply(this,wysihtml5.lang.array(arguments).get())},fire:function(b,d){this.events=this.events||{};var a=this.events[b]||[],c=0;for(;c<a.length;c++){a[c].call(this,d)}return this},stopObserving:function(b,d){this.events=this.events||{};var c=0,a,e;if(b){a=this.events[b]||[],e=[];for(;c<a.length;c++){if(a[c]!==d&&d){e.push(a[c])}}this.events[b]=e}else{this.events={}}return this}});wysihtml5.lang.object=function(a){return{merge:function(b){for(var c in b){a[c]=b[c]}return this},get:function(){return a},clone:function(){var b={},c;for(c in a){b[c]=a[c]}return b},isArray:function(){return Object.prototype.toString.call(a)==="[object Array]"}}};(function(){var b=/^\s+/,a=/\s+$/;wysihtml5.lang.string=function(c){c=String(c);return{trim:function(){return c.replace(b,"").replace(a,"")},interpolate:function(e){for(var d in e){c=this.replace("#{"+d+"}").by(e[d])}return c},replace:function(d){return{by:function(e){return c.split(d).join(e)}}}}}})();(function(l){var j=l.lang.array(["CODE","PRE","A","SCRIPT","HEAD","TITLE","STYLE"]),k=/((https?:\/\/|www\.)[^\s<]{3,})/gi,e=/([^\w\/\-](,?))$/i,c=100,f={")":"(","]":"[","}":"{"};function b(m){if(i(m)){return m}if(m===m.ownerDocument.documentElement){m=m.ownerDocument.body}return a(m)}function g(m){return m.replace(k,function(p,o){var r=(o.match(e)||[])[1]||"",n=f[r];o=o.replace(e,"");if(o.split(n).length>o.split(r).length){o=o+r;r=""}var q=o,s=o;if(o.length>c){s=s.substr(0,c)+"..."}if(q.substr(0,4)==="www."){q="http://"+q}return'<a href="'+q+'">'+s+"</a>"+r})}function d(n){var m=n._wysihtml5_tempElement;if(!m){m=n._wysihtml5_tempElement=n.createElement("div")}return m}function h(o){var n=o.parentNode,m=d(n.ownerDocument);m.innerHTML="<span></span>"+g(o.data);m.removeChild(m.firstChild);while(m.firstChild){n.insertBefore(m.firstChild,o)}n.removeChild(o)}function i(m){var n;while(m.parentNode){m=m.parentNode;n=m.nodeName;if(j.contains(n)){return true}else{if(n==="body"){return false}}}return false}function a(n){if(j.contains(n.nodeName)){return}if(n.nodeType===l.TEXT_NODE&&n.data.match(k)){h(n);return}var p=l.lang.array(n.childNodes).get(),o=p.length,m=0;for(;m<o;m++){a(p[m])}return n}l.dom.autoLink=b;l.dom.autoLink.URL_REG_EXP=k})(wysihtml5);(function(c){var b=c.browser.supportsClassList(),a=c.dom;a.addClass=function(d,e){if(b){return d.classList.add(e)}if(a.hasClass(d,e)){return}d.className+=" "+e};a.removeClass=function(d,e){if(b){return d.classList.remove(e)}d.className=d.className.replace(new RegExp("(^|\\s+)"+e+"(\\s+|$)")," ")};a.hasClass=function(d,e){if(b){return d.classList.contains(e)}var f=d.className;return(f.length>0&&(f==e||new RegExp("(^|\\s)"+e+"(\\s|$)").test(f)))}})(wysihtml5);wysihtml5.dom.contains=(function(){var a=document.documentElement;if(a.contains){return function(b,c){if(c.nodeType!==wysihtml5.ELEMENT_NODE){c=c.parentNode}return b!==c&&b.contains(c)}}else{if(a.compareDocumentPosition){return function(b,c){return !!(b.compareDocumentPosition(c)&16)}}}})();wysihtml5.dom.convertToList=(function(){function b(f,e){var d=f.createElement("li");e.appendChild(d);return d}function c(e,d){return e.createElement(d)}function a(f,n){if(f.nodeName==="UL"||f.nodeName==="OL"||f.nodeName==="MENU"){return f}var p=f.ownerDocument,k=c(p,n),l=f.querySelectorAll("br"),j=l.length,r,q,d,m,h,s,g,o,e;for(e=0;e<j;e++){m=l[e];while((h=m.parentNode)&&h!==f&&h.lastChild===m){if(wysihtml5.dom.getStyle("display").from(h)==="block"){h.removeChild(m);break}wysihtml5.dom.insert(m).after(m.parentNode)}}r=wysihtml5.lang.array(f.childNodes).get();q=r.length;for(e=0;e<q;e++){o=o||b(p,k);d=r[e];s=wysihtml5.dom.getStyle("display").from(d)==="block";g=d.nodeName==="BR";if(s){o=o.firstChild?b(p,k):o;o.appendChild(d);o=null;continue}if(g){o=o.firstChild?null:o;continue}o.appendChild(d)}f.parentNode.replaceChild(k,f);return k}return a})();wysihtml5.dom.copyAttributes=function(a){return{from:function(b){return{to:function(c){var f,d=0,e=a.length;for(;d<e;d++){f=a[d];if(typeof(b[f])!=="undefined"&&b[f]!==""){c[f]=b[f]}}return{andTo:arguments.callee}}}}}};(function(b){var d=["-webkit-box-sizing","-moz-box-sizing","-ms-box-sizing","box-sizing"];var c=function(e){if(a(e)){return parseInt(b.getStyle("width").from(e),10)<e.offsetWidth}return false};var a=function(f){var e=0,g=d.length;for(;e<g;e++){if(b.getStyle(d[e]).from(f)==="border-box"){return d[e]}}};b.copyStyles=function(e){return{from:function(g){if(c(g)){e=wysihtml5.lang.array(e).without(d)}var h="",j=e.length,f=0,k;for(;f<j;f++){k=e[f];h+=k+":"+b.getStyle(k).from(g)+";"}return{to:function(i){b.setStyles(h).on(i);return{andTo:arguments.callee}}}}}}})(wysihtml5.dom);(function(a){a.dom.delegate=function(c,b,d,e){return a.dom.observe(c,d,function(g){var h=g.target,f=a.lang.array(c.querySelectorAll(b));while(h&&h!==c){if(f.contains(h)){e.call(h,g);break}h=h.parentNode}})}})(wysihtml5);wysihtml5.dom.getAsDom=(function(){var a=function(g,f){var d=f.createElement("div");d.style.display="none";f.body.appendChild(d);try{d.innerHTML=g}catch(h){}f.body.removeChild(d);return d};var c=function(e){if(e._wysihtml5_supportsHTML5Tags){return}for(var d=0,f=b.length;d<f;d++){e.createElement(b[d])}e._wysihtml5_supportsHTML5Tags=true};var b=["abbr","article","aside","audio","bdi","canvas","command","datalist","details","figcaption","figure","footer","header","hgroup","keygen","mark","meter","nav","output","progress","rp","rt","ruby","svg","section","source","summary","time","track","video","wbr"];return function(f,e){e=e||document;var d;if(typeof(f)==="object"&&f.nodeType){d=e.createElement("div");d.appendChild(f)}else{if(wysihtml5.browser.supportsHTML5Tags(e)){d=e.createElement("div");d.innerHTML=f}else{c(e);d=a(f,e)}}return d}})();wysihtml5.dom.getParentElement=(function(){function a(g,f){if(!f||!f.length){return true}if(typeof(f)==="string"){return g===f}else{return wysihtml5.lang.array(f).contains(g)}}function c(f){return f.nodeType===wysihtml5.ELEMENT_NODE}function b(f,g,h){var i=(f.className||"").match(h)||[];if(!g){return !!i.length}return i[i.length-1]===g}function e(f,h,g){while(g--&&f&&f.nodeName!=="BODY"){if(a(f.nodeName,h)){return f}f=f.parentNode}return null}function d(g,j,f,i,h){while(h--&&g&&g.nodeName!=="BODY"){if(c(g)&&a(g.nodeName,j)&&b(g,f,i)){return g}g=g.parentNode}return null}return function(g,f,h){h=h||50;if(f.className||f.classRegExp){return d(g,f.nodeName,f.className,f.classRegExp,h)}else{return e(g,f.nodeName,h)}}})();wysihtml5.dom.getStyle=(function(){var b={"float":("styleFloat" in document.createElement("div").style)?"styleFloat":"cssFloat"},c=/\-[a-z]/g;function a(d){return d.replace(c,function(e){return e.charAt(1).toUpperCase()})}return function(d){return{from:function(j){if(j.nodeType!==wysihtml5.ELEMENT_NODE){return}var o=j.ownerDocument,k=b[d]||a(d),g=j.style,h=j.currentStyle,p=g[k];if(p){return p}if(h){try{return h[k]}catch(m){}}var l=o.defaultView||o.parentWindow,n=(d==="height"||d==="width")&&j.nodeName==="TEXTAREA",i,f;if(l.getComputedStyle){if(n){i=g.overflow;g.overflow="hidden"}f=l.getComputedStyle(j,null).getPropertyValue(d);if(n){g.overflow=i||""}return f}}}}})();wysihtml5.dom.hasElementWithTagName=(function(){var c={},b=1;function a(d){return d._wysihtml5_identifier||(d._wysihtml5_identifier=b++)}return function(f,e){var d=a(f)+":"+e,g=c[d];if(!g){g=c[d]=f.getElementsByTagName(e)}return g.length>0}})();(function(d){var c={},b=1;function a(e){return e._wysihtml5_identifier||(e._wysihtml5_identifier=b++)}d.dom.hasElementWithClassName=function(g,f){if(!d.browser.supportsNativeGetElementsByClassName()){return !!g.querySelector("."+f)}var e=a(g)+":"+f,h=c[e];if(!h){h=c[e]=g.getElementsByClassName(f)}return h.length>0}})(wysihtml5);wysihtml5.dom.insert=function(a){return{after:function(b){b.parentNode.insertBefore(a,b.nextSibling)},before:function(b){b.parentNode.insertBefore(a,b)},into:function(b){b.appendChild(a)}}};wysihtml5.dom.insertCSS=function(a){a=a.join("\n");return{into:function(d){var c=d.head||d.getElementsByTagName("head")[0],b=d.createElement("style");b.type="text/css";if(b.styleSheet){b.styleSheet.cssText=a}else{b.appendChild(d.createTextNode(a))}if(c){c.appendChild(b)}}}};wysihtml5.dom.observe=function(c,g,d){g=typeof(g)==="string"?[g]:g;var f,a,b=0,e=g.length;for(;b<e;b++){a=g[b];if(c.addEventListener){c.addEventListener(a,d,false)}else{f=function(h){if(!("target" in h)){h.target=h.srcElement}h.preventDefault=h.preventDefault||function(){this.returnValue=false};h.stopPropagation=h.stopPropagation||function(){this.cancelBubble=true};d.call(c,h)};c.attachEvent("on"+a,f)}}return{stop:function(){var h,j=0,k=g.length;for(;j<k;j++){h=g[j];if(c.removeEventListener){c.removeEventListener(h,d,false)}else{c.detachEvent("on"+h,f)}}}}};wysihtml5.dom.parse=(function(){var a={"1":e,"3":l},o="span",g=/\s+/,j={tags:{},classes:{}},n={};function d(u,x,p,r){wysihtml5.lang.object(n).merge(j).merge(x).get();p=p||u.ownerDocument||document;var t=p.createDocumentFragment(),q=typeof(u)==="string",s,w,v;if(q){s=wysihtml5.dom.getAsDom(u,p)}else{s=u}while(s.firstChild){v=s.firstChild;s.removeChild(v);w=f(v,r);if(w){t.appendChild(w)}}s.innerHTML="";s.appendChild(t);return q?wysihtml5.quirks.getCorrectInnerHTML(s):s}function f(v,u){var t=v.nodeType,s=v.childNodes,r=s.length,q,w=a[t],p=0;q=w&&w(v);if(!q){return null}for(p=0;p<r;p++){newChild=f(s[p],u);if(newChild){q.appendChild(newChild)}}if(u&&q.childNodes.length<=1&&q.nodeName.toLowerCase()===o&&!q.attributes.length){return q.firstChild}return q}function e(u){var t,s,r,q=n.tags,v=u.nodeName.toLowerCase(),p=u.scopeName;if(u._wysihtml5){return null}u._wysihtml5=1;if(u.className==="wysihtml5-temp"){return null}if(p&&p!="HTML"){v=p+":"+v}if("outerHTML" in u){if(!wysihtml5.browser.autoClosesUnclosedTags()&&u.nodeName==="P"&&u.outerHTML.slice(-4).toLowerCase()!=="</p>"){v="div"}}if(v in q){t=q[v];if(!t||t.remove){return null}t=typeof(t)==="string"?{rename_tag:t}:t}else{if(u.firstChild){t={rename_tag:o}}else{return null}}s=u.ownerDocument.createElement(t.rename_tag||v);b(u,s,t);u=null;return s}function b(C,p,v){var y={},J=v.set_class,A=v.add_class,F=v.set_attributes,u=v.check_attributes,t=n.classes,E=0,H=[],K=[],s=[],D=[],w,z,r,x,B,I,q;if(F){y=wysihtml5.lang.object(F).clone()}if(u){for(B in u){q=h[u[B]];if(!q){continue}I=q(i(C,B));if(typeof(I)==="string"){y[B]=I}}}if(J){H.push(J)}if(A){for(B in A){q=k[A[B]];if(!q){continue}x=q(i(C,B));if(typeof(x)==="string"){H.push(x)}}}t["_wysihtml5-temp-placeholder"]=1;D=C.getAttribute("class");if(D){H=H.concat(D.split(g))}w=H.length;for(;E<w;E++){r=H[E];if(t[r]){K.push(r)}}z=K.length;while(z--){r=K[z];if(!wysihtml5.lang.array(s).contains(r)){s.unshift(r)}}if(s.length){y["class"]=s.join(" ")}for(B in y){try{p.setAttribute(B,y[B])}catch(G){}}if(y.src){if(typeof(y.width)!=="undefined"){p.setAttribute("width",y.width)}if(typeof(y.height)!=="undefined"){p.setAttribute("height",y.height)}}}var m=!wysihtml5.browser.supportsGetAttributeCorrectly();function i(r,q){q=q.toLowerCase();var t=r.nodeName;if(t=="IMG"&&q=="src"&&c(r)===true){return r.src}else{if(m&&"outerHTML" in r){var s=r.outerHTML.toLowerCase(),p=s.indexOf(" "+q+"=")!=-1;return p?r.getAttribute(q):null}else{return r.getAttribute(q)}}}function c(p){try{return p.complete&&!p.mozMatchesSelector(":-moz-broken")}catch(q){if(p.complete&&p.readyState==="complete"){return true}}}function l(p){return p.ownerDocument.createTextNode(p.data)}var h={url:(function(){var p=/^https?:\/\//i;return function(q){if(!q||!q.match(p)){return null}return q.replace(p,function(r){return r.toLowerCase()})}})(),alt:(function(){var p=/[^ a-z0-9_\-]/gi;return function(q){if(!q){return""}return q.replace(p,"")}})(),numbers:(function(){var p=/\D/g;return function(q){q=(q||"").replace(p,"");return q||null}})()};var k={align_img:(function(){var p={left:"wysiwyg-float-left",right:"wysiwyg-float-right"};return function(q){return p[String(q).toLowerCase()]}})(),align_text:(function(){var p={left:"wysiwyg-text-align-left",right:"wysiwyg-text-align-right",center:"wysiwyg-text-align-center",justify:"wysiwyg-text-align-justify"};return function(q){return p[String(q).toLowerCase()]}})(),clear_br:(function(){var p={left:"wysiwyg-clear-left",right:"wysiwyg-clear-right",both:"wysiwyg-clear-both",all:"wysiwyg-clear-both"};return function(q){return p[String(q).toLowerCase()]}})(),size_font:(function(){var p={"1":"wysiwyg-font-size-xx-small","2":"wysiwyg-font-size-small","3":"wysiwyg-font-size-medium","4":"wysiwyg-font-size-large","5":"wysiwyg-font-size-x-large","6":"wysiwyg-font-size-xx-large","7":"wysiwyg-font-size-xx-large","-":"wysiwyg-font-size-smaller","+":"wysiwyg-font-size-larger"};return function(q){return p[String(q).charAt(0)]}})()};return d})();wysihtml5.dom.removeEmptyTextNodes=function(c){var b,e=wysihtml5.lang.array(c.childNodes).get(),d=e.length,a=0;for(;a<d;a++){b=e[a];if(b.nodeType===wysihtml5.TEXT_NODE&&b.data===""){b.parentNode.removeChild(b)}}};wysihtml5.dom.renameElement=function(a,b){var d=a.ownerDocument.createElement(b),c;while(c=a.firstChild){d.appendChild(c)}wysihtml5.dom.copyAttributes(["align","className"]).from(a).to(d);a.parentNode.replaceChild(d,a);return d};wysihtml5.dom.replaceWithChildNodes=function(b){if(!b.parentNode){return}if(!b.firstChild){b.parentNode.removeChild(b);return}var a=b.ownerDocument.createDocumentFragment();while(b.firstChild){a.appendChild(b.firstChild)}b.parentNode.replaceChild(a,b);b=a=null};(function(e){function c(f){return e.getStyle("display").from(f)==="block"}function d(f){return f.nodeName==="BR"}function b(g){var f=g.ownerDocument.createElement("br");g.appendChild(f)}function a(k){if(k.nodeName!=="MENU"&&k.nodeName!=="UL"&&k.nodeName!=="OL"){return}var n=k.ownerDocument,l=n.createDocumentFragment(),g=k.previousElementSibling||k.previousSibling,m,h,i,j,f;if(g&&!c(g)){b(l)}while(f=k.firstChild){h=f.lastChild;while(m=f.firstChild){i=m===h;j=i&&!c(m)&&!d(m);l.appendChild(m);if(j){b(l)}}f.parentNode.removeChild(f)}k.parentNode.replaceChild(l,k)}e.resolveList=a})(wysihtml5.dom);(function(e){var d=document,c=["parent","top","opener","frameElement","frames","localStorage","globalStorage","sessionStorage","indexedDB"],b=["open","close","openDialog","showModalDialog","alert","confirm","prompt","openDatabase","postMessage","XMLHttpRequest","XDomainRequest"],a=["referrer","write","open","close"];e.dom.Sandbox=Base.extend({constructor:function(g,f){this.callback=g||e.EMPTY_FUNCTION;this.config=e.lang.object({}).merge(f).get();this.iframe=this._createIframe()},insertInto:function(f){if(typeof(f)==="string"){f=d.getElementById(f)}f.appendChild(this.iframe)},getIframe:function(){return this.iframe},getWindow:function(){this._readyError()},getDocument:function(){this._readyError()},destroy:function(){var f=this.getIframe();f.parentNode.removeChild(f)},_readyError:function(){throw new Error("wysihtml5.Sandbox: Sandbox iframe isn't loaded yet")},_createIframe:function(){var g=this,f=d.createElement("iframe");f.className="wysihtml5-sandbox";e.dom.setAttributes({"security":"restricted","allowtransparency":"true","frameborder":0,"width":0,"height":0,"marginwidth":0,"marginheight":0}).on(f);if(e.browser.throwsMixedContentWarningWhenIframeSrcIsEmpty()){f.src="javascript:'<html></html>'"}f.onload=function(){f.onreadystatechange=f.onload=null;g._onLoadIframe(f)};f.onreadystatechange=function(){if(/loaded|complete/.test(f.readyState)){f.onreadystatechange=f.onload=null;g._onLoadIframe(f)}};return f},_onLoadIframe:function(h){if(!e.dom.contains(d.documentElement,h)){return}var l=this,f=h.contentWindow,m=h.contentWindow.document,n=d.characterSet||d.charset||"utf-8",k=this._getHtml({charset:n,stylesheets:this.config.stylesheets});m.open("text/html","replace");m.write(k);m.close();this.getWindow=function(){return h.contentWindow};this.getDocument=function(){return h.contentWindow.document};f.onerror=function(o,p,i){throw new Error("wysihtml5.Sandbox: "+o,p,i)};if(!e.browser.supportsSandboxedIframes()){var g,j;for(g=0,j=c.length;g<j;g++){this._unset(f,c[g])}for(g=0,j=b.length;g<j;g++){this._unset(f,b[g],e.EMPTY_FUNCTION)}for(g=0,j=a.length;g<j;g++){this._unset(m,a[g])}this._unset(m,"cookie","",true)}this.loaded=true;setTimeout(function(){l.callback(l)},0)},_getHtml:function(j){var k=j.stylesheets,g="",f=0,h;k=typeof(k)==="string"?[k]:k;if(k){h=k.length;for(;f<h;f++){g+='<link rel="stylesheet" href="'+k[f]+'">'}}j.stylesheets=g;return e.lang.string("<!DOCTYPE html><html><head>"+'<meta charset="#{charset}">#{stylesheets}</head>'+"<body></body></html>").interpolate(j)},_unset:function(g,i,h,k){try{g[i]=h}catch(j){}try{g.__defineGetter__(i,function(){return h})}catch(j){}if(k){try{g.__defineSetter__(i,function(){})}catch(j){}}if(!e.browser.crashesWhenDefineProperty(i)){try{var f={get:function(){return h}};if(k){f.set=function(){}}Object.defineProperty(g,i,f)}catch(j){}}}})})(wysihtml5);(function(){var a={"className":"class"};wysihtml5.dom.setAttributes=function(b){return{on:function(d){for(var c in b){d.setAttribute(a[c]||c,b[c])}}}}})();wysihtml5.dom.setStyles=function(a){return{on:function(c){var d=c.style;if(typeof(a)==="string"){d.cssText+=";"+a;return}for(var b in a){if(b==="float"){d.cssFloat=a[b];d.styleFloat=a[b]}else{d[b]=a[b]}}}}};(function(a){a.simulatePlaceholder=function(d,b,c){var e="placeholder",f=function(){if(b.hasPlaceholderSet()){b.clear()}a.removeClass(b.element,e)},g=function(){if(b.isEmpty()){b.setValue(c);a.addClass(b.element,e)}};d.observe("set_placeholder",g).observe("unset_placeholder",f).observe("focus:composer",f).observe("paste:composer",f).observe("blur:composer",g);g()}})(wysihtml5.dom);(function(b){var a=document.documentElement;if("textContent" in a){b.setTextContent=function(c,d){c.textContent=d};b.getTextContent=function(c){return c.textContent}}else{if("innerText" in a){b.setTextContent=function(c,d){c.innerText=d};b.getTextContent=function(c){return c.innerText}}else{b.setTextContent=function(c,d){c.nodeValue=d};b.getTextContent=function(c){return c.nodeValue}}}})(wysihtml5.dom);wysihtml5.quirks.cleanPastedHTML=(function(){var a={"a u":wysihtml5.dom.replaceWithChildNodes};function b(l,m,d){m=m||a;d=d||l.ownerDocument||document;var h,e=typeof(l)==="string",c,k,n,g,f=0;if(e){h=wysihtml5.dom.getAsDom(l,d)}else{h=l}for(g in m){k=h.querySelectorAll(g);c=m[g];n=k.length;for(;f<n;f++){c(k[f])}}k=l=m=null;return e?h.innerHTML:h}return b})();(function(b){var a=b.dom;b.quirks.ensureProperClearing=(function(){var c=function(e){var d=this;setTimeout(function(){var f=d.innerHTML.toLowerCase();if(f=="<p>&nbsp;</p>"||f=="<p>&nbsp;</p><p>&nbsp;</p>"){d.innerHTML=""}},0)};return function(d){a.observe(d.element,["cut","keydown"],c)}})();b.quirks.ensureProperClearingOfLists=(function(){var d=["OL","UL","MENU"];var c=function(g,e){if(!e.firstChild||!b.lang.array(d).contains(e.firstChild.nodeName)){return}var i=a.getParentElement(g,{nodeName:d});if(!i){return}var h=i==e.firstChild;if(!h){return}var j=i.childNodes.length<=1;if(!j){return}var f=i.firstChild?i.firstChild.innerHTML==="":true;if(!f){return}i.parentNode.removeChild(i)};return function(e){a.observe(e.element,"keydown",function(g){if(g.keyCode!==b.BACKSPACE_KEY){return}var f=e.selection.getSelectedNode();c(f,e.element)})}})()})(wysihtml5);(function(b){var a="%7E";b.quirks.getCorrectInnerHTML=function(e){var j=e.innerHTML;if(j.indexOf(a)===-1){return j}var g=e.querySelectorAll("[href*='~'], [src*='~']"),c,h,f,d;for(d=0,f=g.length;d<f;d++){c=g[d].href||g[d].src;h=b.lang.string(c).replace("~").by(a);j=b.lang.string(j).replace(h).by(c)}return j}})(wysihtml5);(function(d){var c=d.dom,b=["LI","P","H1","H2","H3","H4","H5","H6"],a=["UL","OL","MENU"];d.quirks.insertLineBreakOnReturn=function(g){function e(j){var h=c.getParentElement(j,{nodeName:["P","DIV"]},2);if(!h){return}var i=document.createTextNode(d.INVISIBLE_SPACE);c.insert(i).before(h);c.replaceWithChildNodes(h);g.selection.selectNode(i)}function f(i){var k=i.keyCode;if(g_isIE||g_isOpera){if(i.shiftKey||(k!==d.ENTER_KEY&&k!==d.BACKSPACE_KEY)){return}}else{if(i.shiftKey||(k!==d.BACKSPACE_KEY)){return}}var h=i.target,j=g.selection.getSelectedNode(),l=c.getParentElement(j,{nodeName:b},4);if(l){if(l.nodeName==="LI"&&(k===d.ENTER_KEY||k===d.BACKSPACE_KEY)){setTimeout(function(){var n=g.selection.getSelectedNode(),m,o;if(!n){return}m=c.getParentElement(n,{nodeName:a},2);if(m){return}e(n)},0)}else{if(l.nodeName.match(/H[1-6]/)&&k===d.ENTER_KEY){setTimeout(function(){e(g.selection.getSelectedNode())},0)}}return}if(k===d.ENTER_KEY&&!d.browser.insertsLineBreaksOnReturn()){g.commands.exec("insertLineBreak");i.preventDefault()}}c.observe(g.element.ownerDocument,"keydown",f)}})(wysihtml5);(function(b){var a="wysihtml5-quirks-redraw";b.quirks.redraw=function(c){b.dom.addClass(c,a);b.dom.removeClass(c,a);try{var f=c.ownerDocument;f.execCommand("italic",false,null);f.execCommand("italic",false,null)}catch(d){}}})(wysihtml5);(function(c){var b=c.dom;function a(d){var e=0;if(d.parentNode){do{e+=d.offsetTop||0;d=d.offsetParent}while(d)}return e}c.Selection=Base.extend({constructor:function(d){window.rangy.init();this.editor=d;this.composer=d.composer;this.doc=this.composer.doc},getBookmark:function(){var d=this.getRange();return d&&d.cloneRange()},setBookmark:function(d){if(!d){return}this.setSelection(d)},setBefore:function(e){var d=rangy.createRange(this.doc);d.setStartBefore(e);d.setEndBefore(e);return this.setSelection(d)},setAfter:function(e){var d=rangy.createRange(this.doc);d.setStartAfter(e);d.setEndAfter(e);return this.setSelection(d)},selectNode:function(d){var g=rangy.createRange(this.doc),j=d.nodeType===c.ELEMENT_NODE,l="canHaveHTML" in d?d.canHaveHTML:(d.nodeName!=="IMG"),i=j?d.innerHTML:d.data,f=(i===""||i===c.INVISIBLE_SPACE),k=b.getStyle("display").from(d),m=(k==="block"||k==="list-item");if(f&&j&&l){try{d.innerHTML=c.INVISIBLE_SPACE}catch(h){}}if(l){g.selectNodeContents(d)}else{g.selectNode(d)}if(l&&f&&j){g.collapse(m)}else{if(l&&f){g.setStartAfter(d);g.setEndAfter(d)}}this.setSelection(g)},getSelectedNode:function(e){var f,d;if(e&&this.doc.selection&&this.doc.selection.type==="Control"){d=this.doc.selection.createRange();if(d&&d.length){return d.item(0)}}f=this.getSelection(this.doc);if(f.focusNode===f.anchorNode){return f.focusNode}else{d=this.getRange(this.doc);return d?d.commonAncestorContainer:this.doc.body}},executeAndRestore:function(d,n){var h=this.doc.body,f=n&&h.scrollTop,i=n&&h.scrollLeft,l="_wysihtml5-temp-placeholder",o='<span class="'+l+'">'+c.INVISIBLE_SPACE+"</span>",g=this.getRange(this.doc),m;if(!g){d(h,h);return}var e=g.createContextualFragment(o);g.insertNode(e);try{d(g.startContainer,g.endContainer)}catch(k){setTimeout(function(){throw k},0)}caretPlaceholder=this.doc.querySelector("."+l);if(caretPlaceholder){m=rangy.createRange(this.doc);m.selectNode(caretPlaceholder);m.deleteContents();this.setSelection(m)}else{h.focus()}if(n){h.scrollTop=f;h.scrollLeft=i}try{caretPlaceholder.parentNode.removeChild(caretPlaceholder)}catch(j){}},executeAndRestoreSimple:function(d){var h=this.getRange(),i=this.doc.body,p,f,g,l,j;if(!h){d(i,i);return}l=h.getNodes([3]);f=l[0]||h.startContainer;g=l[l.length-1]||h.endContainer;j={collapsed:h.collapsed,startContainer:f,startOffset:f===h.startContainer?h.startOffset:0,endContainer:g,endOffset:g===h.endContainer?h.endOffset:g.length};try{d(h.startContainer,h.endContainer)}catch(k){setTimeout(function(){throw k},0)}p=rangy.createRange(this.doc);try{p.setStart(j.startContainer,j.startOffset)}catch(o){}try{p.setEnd(j.endContainer,j.endOffset)}catch(n){}try{this.setSelection(p)}catch(m){}},insertHTML:function(e){var d=rangy.createRange(this.doc),g=d.createContextualFragment(e),f=g.lastChild;this.insertNode(g);if(f){this.setAfter(f)}},insertNode:function(e){var d=this.getRange();if(d){d.insertNode(e)}},surround:function(f){var d=this.getRange();if(!d){return}try{d.surroundContents(f);this.selectNode(f)}catch(g){f.appendChild(d.extractContents());d.insertNode(f)}},scrollIntoView:function(){var g=this.doc,f=g.documentElement.scrollHeight>g.documentElement.offsetHeight,d=g._wysihtml5ScrollIntoViewElement=g._wysihtml5ScrollIntoViewElement||(function(){var h=g.createElement("span");h.innerHTML=c.INVISIBLE_SPACE;return h})(),e;if(f){this.insertNode(d);e=a(d);d.parentNode.removeChild(d);if(e>g.body.scrollTop){g.body.scrollTop=e}}},selectLine:function(){if(c.browser.supportsSelectionModify()){this._selectLine_W3C()}else{if(this.doc.selection){this._selectLine_MSIE()}}},_selectLine_W3C:function(){var e=this.doc.defaultView,d=e.getSelection();d.modify("extend","left","lineboundary");d.modify("extend","right","lineboundary")},_selectLine_MSIE:function(){var l=this.doc.selection.createRange(),h=l.boundingTop,p=l.boundingHeight,k=this.doc.body.scrollWidth,e,d,m,g,f;if(!l.moveToPoint){return}if(h===0){m=this.doc.createElement("span");this.insertNode(m);h=m.offsetTop;m.parentNode.removeChild(m)}h+=1;for(g=-10;g<k;g+=2){try{l.moveToPoint(g,h);break}catch(o){}}e=h;d=this.doc.selection.createRange();for(f=k;f>=0;f--){try{d.moveToPoint(f,e);break}catch(n){}}l.setEndPoint("EndToEnd",d);l.select()},getText:function(){var d=this.getSelection();return d?d.toString():""},getNodes:function(d,f){var e=this.getRange();if(e){return e.getNodes([d],f)}else{return[]}},getRange:function(){var d=this.getSelection();return d&&d.rangeCount&&d.getRangeAt(0)},getSelection:function(){return rangy.getSelection(this.doc.defaultView||this.doc.parentWindow)},setSelection:function(d){var f=this.doc.defaultView||this.doc.parentWindow,e=rangy.getSelection(f);return e.setSingleRange(d)}})})(wysihtml5);(function(n,j){var h="span";var f=/\s+/g;function d(q,o,p){if(!q.className){return false}var r=q.className.match(p)||[];return r[r.length-1]===o}function i(q,o,p){if(q.className){l(q,p);q.className+=" "+o}else{q.className=o}}function l(p,o){if(p.className){p.className=p.className.replace(o,"")}}function m(p,o){return p.className.replace(f," ")==o.className.replace(f," ")}function a(p){var o=p.parentNode;while(p.firstChild){o.insertBefore(p.firstChild,p)}o.removeChild(p)}function e(u,s){if(u.attributes.length!=s.attributes.length){return false}for(var t=0,o=u.attributes.length,r,p,q;t<o;++t){r=u.attributes[t];q=r.name;if(q!="class"){p=s.attributes.getNamedItem(q);if(r.specified!=p.specified){return false}if(r.specified&&r.nodeValue!==p.nodeValue){return false}}}return true}function c(o,p){if(j.dom.isCharacterDataNode(o)){if(p==0){return !!o.previousSibling}else{if(p==o.length){return !!o.nextSibling}else{return true}}}return p>0&&p<o.childNodes.length}function b(r,p,q){var o;if(j.dom.isCharacterDataNode(p)){if(q==0){q=j.dom.getNodeIndex(p);p=p.parentNode}else{if(q==p.length){q=j.dom.getNodeIndex(p)+1;p=p.parentNode}else{o=j.dom.splitDataNode(p,q)}}}if(!o){o=p.cloneNode(false);if(o.id){o.removeAttribute("id")}var s;while((s=p.childNodes[q])){o.appendChild(s)}j.dom.insertAfter(o,p)}return(p==r)?o:b(r,o.parentNode,j.dom.getNodeIndex(o))}function g(o){this.isElementMerge=(o.nodeType==n.ELEMENT_NODE);this.firstTextNode=this.isElementMerge?o.lastChild:o;this.textNodes=[this.firstTextNode]}g.prototype={doMerge:function(){var t=[],s,q,r;for(var p=0,o=this.textNodes.length;p<o;++p){s=this.textNodes[p];q=s.parentNode;t[p]=s.data;if(p){q.removeChild(s);if(!q.hasChildNodes()){q.parentNode.removeChild(q)}}}this.firstTextNode.data=r=t.join("");return r},getLength:function(){var p=this.textNodes.length,o=0;while(p--){o+=this.textNodes[p].length}return o},toString:function(){var q=[];for(var p=0,o=this.textNodes.length;p<o;++p){q[p]="'"+this.textNodes[p].data+"'"}return"[Merge("+q.join(",")+")]"}};function k(o,q,p,r){this.tagNames=o||[h];this.cssClass=q||"";this.similarClassRegExp=p;this.normalize=r;this.applyToAnyTagName=false}k.prototype={getAncestorWithClass:function(p){var o;while(p){o=this.cssClass?d(p,this.cssClass,this.similarClassRegExp):true;if(p.nodeType==n.ELEMENT_NODE&&j.dom.arrayContains(this.tagNames,p.tagName.toLowerCase())&&o){return p}p=p.parentNode}return false},postApply:function(A,w){var o=A[0],p=A[A.length-1];var r=[],B;var t=o,q=p;var y=0,C=p.length;var s,v;for(var u=0,x=A.length;u<x;++u){s=A[u];v=this.getAdjacentMergeableTextNode(s.parentNode,false);if(v){if(!B){B=new g(v);r.push(B)}B.textNodes.push(s);if(s===o){t=B.firstTextNode;y=t.length}if(s===p){q=B.firstTextNode;C=B.getLength()}}else{B=null}}var z=this.getAdjacentMergeableTextNode(p.parentNode,true);if(z){if(!B){B=new g(p);r.push(B)}B.textNodes.push(z)}if(r.length){for(u=0,x=r.length;u<x;++u){r[u].doMerge()}w.setStart(t,y);w.setEnd(q,C)}},getAdjacentMergeableTextNode:function(q,o){var s=(q.nodeType==n.TEXT_NODE);var p=s?q.parentNode:q;var t;var r=o?"nextSibling":"previousSibling";if(s){t=q[r];if(t&&t.nodeType==n.TEXT_NODE){return t}}else{t=p[r];if(t&&this.areElementsMergeable(q,t)){return t[o?"firstChild":"lastChild"]}}return null},areElementsMergeable:function(p,o){return j.dom.arrayContains(this.tagNames,(p.tagName||"").toLowerCase())&&j.dom.arrayContains(this.tagNames,(o.tagName||"").toLowerCase())&&m(p,o)&&e(p,o)},createContainer:function(p){var o=p.createElement(this.tagNames[0]);if(this.cssClass){o.className=this.cssClass}return o},applyToTextNode:function(q){var p=q.parentNode;if(p.childNodes.length==1&&j.dom.arrayContains(this.tagNames,p.tagName.toLowerCase())){if(this.cssClass){i(p,this.cssClass,this.similarClassRegExp)}}else{var o=this.createContainer(j.dom.getDocument(q));q.parentNode.insertBefore(o,q);o.appendChild(q)}},isRemovable:function(o){return j.dom.arrayContains(this.tagNames,o.tagName.toLowerCase())&&n.lang.string(o.className).trim()==this.cssClass},undoToTextNode:function(r,p,q){if(!p.containsNode(q)){var o=p.cloneRange();o.selectNode(q);if(o.isPointInRange(p.endContainer,p.endOffset)&&c(p.endContainer,p.endOffset)){b(q,p.endContainer,p.endOffset);p.setEndAfter(q)}if(o.isPointInRange(p.startContainer,p.startOffset)&&c(p.startContainer,p.startOffset)){q=b(q,p.startContainer,p.startOffset)}}if(this.similarClassRegExp){l(q,this.similarClassRegExp)}if(this.isRemovable(q)){a(q)}},applyToRange:function(p){var s=p.getNodes([n.TEXT_NODE]);if(!s.length){try{var r=this.createContainer(p.endContainer.ownerDocument);p.surroundContents(r);this.selectNode(p,r);return}catch(t){}}p.splitBoundaries();s=p.getNodes([n.TEXT_NODE]);if(s.length){var u;for(var q=0,o=s.length;q<o;++q){u=s[q];if(!this.getAncestorWithClass(u)){this.applyToTextNode(u)}}p.setStart(s[0],0);u=s[s.length-1];p.setEnd(u,u.length);if(this.normalize){this.postApply(s,p)}}},undoToRange:function(p){var s=p.getNodes([n.TEXT_NODE]),v,t;if(s.length){p.splitBoundaries();s=p.getNodes([n.TEXT_NODE])}else{var u=p.endContainer.ownerDocument,r=u.createTextNode(n.INVISIBLE_SPACE);p.insertNode(r);p.selectNode(r);s=[r]}for(var q=0,o=s.length;q<o;++q){v=s[q];t=this.getAncestorWithClass(v);if(t){this.undoToTextNode(v,p,t)}}if(o==1){this.selectNode(p,s[0])}else{p.setStart(s[0],0);v=s[s.length-1];p.setEnd(v,v.length);if(this.normalize){this.postApply(s,p)}}},selectNode:function(p,s){var r=s.nodeType===n.ELEMENT_NODE,o="canHaveHTML" in s?s.canHaveHTML:true,q=r?s.innerHTML:s.data,u=(q===""||q===n.INVISIBLE_SPACE);if(u&&r&&o){try{s.innerHTML=n.INVISIBLE_SPACE}catch(t){}}p.selectNodeContents(s);if(u&&r){p.collapse(false)}else{if(u){p.setStartAfter(s);p.setEndAfter(s)}}},getTextSelectedByRange:function(s,o){var p=o.cloneRange();p.selectNodeContents(s);var q=p.intersection(o);var r=q?q.toString():"";p.detach();return r},isAppliedToRange:function(p){var s=[],r,t=p.getNodes([n.TEXT_NODE]);if(!t.length){r=this.getAncestorWithClass(p.startContainer);return r?[r]:false}for(var q=0,o=t.length,u;q<o;++q){u=this.getTextSelectedByRange(t[q],p);r=this.getAncestorWithClass(t[q]);if(u!=""&&!r){return false}else{s.push(r)}}return s},toggleRange:function(o){if(this.isAppliedToRange(o)){this.undoToRange(o)}else{this.applyToRange(o)}}};n.selection.HTMLApplier=k})(wysihtml5,rangy);wysihtml5.Commands=Base.extend({constructor:function(a){this.editor=a;this.composer=a.composer;this.doc=this.composer.doc},support:function(a){return wysihtml5.browser.supportsCommand(this.doc,a)},exec:function(g,c){var f=wysihtml5.commands[g],b=wysihtml5.lang.array(arguments).get(),h=f&&f.exec,a=null;this.editor.fire("beforecommand:composer");if(h){b.unshift(this.composer);a=h.apply(f,b)}else{try{a=this.doc.execCommand(g,false,c)}catch(d){}}this.editor.fire("aftercommand:composer");return a},state:function(f,a){var d=wysihtml5.commands[f],b=wysihtml5.lang.array(arguments).get(),g=d&&d.state;if(g){b.unshift(this.composer);return g.apply(d,b)}else{try{return this.doc.queryCommandState(f)}catch(c){return false}}},value:function(c){var b=wysihtml5.commands[c],d=b&&b.value;if(d){return d.call(b,this.composer,c)}else{try{return this.doc.queryCommandValue(c)}catch(a){return null}}}});(function(b){var a;b.commands.bold={exec:function(c,d){return b.commands.formatInline.exec(c,d,"b")},state:function(d,e,c){return b.commands.formatInline.state(d,e,"b")},value:function(){return a}}})(wysihtml5);(function(f){var d,c="A",e=f.dom;function a(h,n){var m=n.length,j=0,g,l,k;for(;j<m;j++){g=n[j];l=e.getParentElement(g,{nodeName:"code"});k=e.getTextContent(g);if(k.match(e.autoLink.URL_REG_EXP)&&!l){l=e.renameElement(g,"code")}else{e.replaceWithChildNodes(g)}}}function b(g,m){var u=g.doc,r="_wysihtml5-temp-"+(+new Date()),w=/non-matching-class/g,q=0,k,h,p,t,o,n,s,v,l;f.commands.formatInline.exec(g,d,c,r,w);h=u.querySelectorAll(c+"."+r);k=h.length;for(;q<k;q++){p=h[q];p.removeAttribute("class");for(l in m){p.setAttribute(l,m[l])}}n=p;if(k===1){s=e.getTextContent(p);t=!!p.querySelector("*");o=s===""||s===f.INVISIBLE_SPACE;if(!t&&o){e.setTextContent(p,m.text||p.href);v=u.createTextNode(" ");g.selection.setAfter(p);g.selection.insertNode(v);n=v}}g.selection.setAfter(n)}f.commands.createLink={exec:function(g,j,i){var h=this.state(g,j);if(h){g.selection.executeAndRestore(function(){a(g,h)})}else{i=typeof(i)==="object"?i:{href:i};b(g,i)}},state:function(g,h){return f.commands.formatInline.state(g,h,"A")},value:function(){return d}}})(wysihtml5);(function(c){var b,a=/wysiwyg-font-size-[a-z\-]+/g;c.commands.fontSize={exec:function(d,f,e){return c.commands.formatInline.exec(d,f,"span","wysiwyg-font-size-"+e,a)},state:function(d,f,e){return c.commands.formatInline.state(d,f,"span","wysiwyg-font-size-"+e,a)},value:function(){return b}}})(wysihtml5);(function(c){var b,a=/wysiwyg-color-[a-z]+/g;c.commands.foreColor={exec:function(e,f,d){return c.commands.formatInline.exec(e,f,"span","wysiwyg-color-"+d,a)},state:function(e,f,d){return c.commands.formatInline.state(e,f,"span","wysiwyg-color-"+d,a)},value:function(){return b}}})(wysihtml5);(function(h){var b,o=h.dom,a="DIV",p=["H1","H2","H3","H4","H5","H6","P","BLOCKQUOTE",a];function m(s,t,u){if(s.className){g(s,u);s.className+=" "+t}else{s.className=t}}function g(s,t){s.className=s.className.replace(t,"")}function i(s){return s.nodeType===h.TEXT_NODE&&!h.lang.string(s.data).trim()}function j(t){var s=t.previousSibling;while(s&&i(s)){s=s.previousSibling}return s}function k(s){var t=s.nextSibling;while(t&&i(t)){t=t.nextSibling}return t}function f(t){var v=t.ownerDocument,u=k(t),s=j(t);if(u&&!e(u)){t.parentNode.insertBefore(v.createElement("br"),u)}if(s&&!e(s)){t.parentNode.insertBefore(v.createElement("br"),t)}}function c(t){var u=k(t),s=j(t);if(u&&l(u)){u.parentNode.removeChild(u)}if(s&&l(s)){s.parentNode.removeChild(s)}}function n(t){var s=t.lastChild;if(s&&l(s)){s.parentNode.removeChild(s)}}function l(s){return s.nodeName==="BR"}function e(s){if(l(s)){return true}if(o.getStyle("display").from(s)==="block"){return true}return false}function d(u,v,w,t){if(t){var s=o.observe(u,"DOMNodeInserted",function(y){var z=y.target,x;if(z.nodeType!==h.ELEMENT_NODE){return}x=o.getStyle("display").from(z);if(x.substr(0,6)!=="inline"){z.className+=" "+t}})}u.execCommand(v,false,w);if(s){s.stop()}}function q(s,t){s.selection.selectLine();s.selection.surround(t);c(t);n(t);s.selection.selectNode(t)}function r(s){return !!h.lang.string(s.className).trim()}h.commands.formatBlock={exec:function(s,y,z,t,v){var w=s.doc,x=this.state(s,y,z,t,v),u;z=typeof(z)==="string"?z.toUpperCase():z;if(x){s.selection.executeAndRestoreSimple(function(){if(v){g(x,v)}var A=r(x);if(!A&&x.nodeName===(z||a)){f(x);o.replaceWithChildNodes(x)}else{if(A){o.renameElement(x,a)}}});return}if(z===null||h.lang.array(p).contains(z)){u=s.selection.getSelectedNode();x=o.getParentElement(u,{nodeName:p});if(x){s.selection.executeAndRestoreSimple(function(){if(z){x=o.renameElement(x,z)}if(t){m(x,t,v)}});return}}if(s.commands.support(y)){d(w,y,z||a,t);return}x=w.createElement(z||a);if(t){x.className=t}q(s,x)},state:function(s,w,x,t,v){x=typeof(x)==="string"?x.toUpperCase():x;var u=s.selection.getSelectedNode();return o.getParentElement(u,{nodeName:x,className:t,classRegExp:v})},value:function(){return b}}})(wysihtml5);(function(f){var c,d={"strong":"b","em":"i","b":"strong","i":"em"},e={};function b(h){var g=d[h];return g?[h.toLowerCase(),g.toLowerCase()]:[h.toLowerCase()]}function a(h,i,j){var g=h+":"+i;if(!e[g]){e[g]=new f.selection.HTMLApplier(b(h),i,j,true)}return e[g]}f.commands.formatInline={exec:function(h,l,i,j,k){var g=h.selection.getRange();if(!g){return false}a(i,j,k).toggleRange(g);h.selection.setSelection(g)},state:function(h,m,i,j,k){var l=h.doc,n=d[i]||i,g;if(!f.dom.hasElementWithTagName(l,i)&&!f.dom.hasElementWithTagName(l,n)){return false}if(j&&!f.dom.hasElementWithClassName(l,j)){return false}g=h.selection.getRange();if(!g){return false}return a(i,j,k).isAppliedToRange(g)},value:function(){return c}}})(wysihtml5);(function(b){var a;b.commands.insertHTML={exec:function(c,e,d){if(c.commands.support(e)){c.doc.execCommand(e,false,d)}else{c.selection.insertHTML(d)}},state:function(){return false},value:function(){return a}}})(wysihtml5);(function(b){var a="IMG";b.commands.insertImage={exec:function(c,k,f){f=typeof(f)==="object"?f:{src:f};var h=c.doc,g=this.state(c),j,d,e;if(g){c.selection.setBefore(g);e=g.parentNode;e.removeChild(g);b.dom.removeEmptyTextNodes(e);if(e.nodeName==="A"&&!e.firstChild){c.selection.setAfter(e);e.parentNode.removeChild(e)}b.quirks.redraw(c.element);return}g=h.createElement(a);for(d in f){g[d]=f[d]}c.selection.insertNode(g);if(b.browser.hasProblemsSettingCaretAfterImg()){j=h.createTextNode(b.INVISIBLE_SPACE);c.selection.insertNode(j);c.selection.setAfter(j)}else{c.selection.setAfter(g)}},state:function(d){var f=d.doc,e,g,c;if(!b.dom.hasElementWithTagName(f,a)){return false}e=d.selection.getSelectedNode();if(!e){return false}if(e.nodeName===a){return e}if(e.nodeType!==b.ELEMENT_NODE){return false}g=d.selection.getText();g=b.lang.string(g).trim();if(g){return false}c=d.selection.getNodes(b.ELEMENT_NODE,function(h){return h.nodeName==="IMG"});if(c.length!==1){return false}return c[0]},value:function(c){var d=this.state(c);return d&&d.src}}})(wysihtml5);(function(c){var b,a="<br>"+(c.browser.needsSpaceAfterLineBreak()?" ":"");c.commands.insertLineBreak={exec:function(d,e){if(d.commands.support(e)){d.doc.execCommand(e,false,null);if(!c.browser.autoScrollsToCaret()){d.selection.scrollIntoView()}}else{d.commands.exec("insertHTML",a)}},state:function(){return false},value:function(){return b}}})(wysihtml5);(function(b){var a;b.commands.insertOrderedList={exec:function(c,f){var k=c.doc,h=c.selection.getSelectedNode(),i=b.dom.getParentElement(h,{nodeName:"OL"}),j=b.dom.getParentElement(h,{nodeName:"UL"}),e="_wysihtml5-temp-"+new Date().getTime(),g,d;if(c.commands.support(f)){k.execCommand(f,false,null);return}if(i){c.selection.executeAndRestoreSimple(function(){b.dom.resolveList(i)})}else{if(j){c.selection.executeAndRestoreSimple(function(){b.dom.renameElement(j,"ol")})}else{c.commands.exec("formatBlock","div",e);d=k.querySelector("."+e);g=d.innerHTML===""||d.innerHTML===b.INVISIBLE_SPACE;c.selection.executeAndRestoreSimple(function(){i=b.dom.convertToList(d,"ol")});if(g){c.selection.selectNode(i.querySelector("li"))}}}},state:function(c){var d=c.selection.getSelectedNode();return b.dom.getParentElement(d,{nodeName:"OL"})},value:function(){return a}}})(wysihtml5);(function(b){var a;b.commands.insertUnorderedList={exec:function(c,f){var k=c.doc,h=c.selection.getSelectedNode(),i=b.dom.getParentElement(h,{nodeName:"UL"}),j=b.dom.getParentElement(h,{nodeName:"OL"}),e="_wysihtml5-temp-"+new Date().getTime(),g,d;if(c.commands.support(f)){k.execCommand(f,false,null);return}if(i){c.selection.executeAndRestoreSimple(function(){b.dom.resolveList(i)})}else{if(j){c.selection.executeAndRestoreSimple(function(){b.dom.renameElement(j,"ul")})}else{c.commands.exec("formatBlock","div",e);d=k.querySelector("."+e);g=d.innerHTML===""||d.innerHTML===b.INVISIBLE_SPACE;c.selection.executeAndRestoreSimple(function(){i=b.dom.convertToList(d,"ul")});if(g){c.selection.selectNode(i.querySelector("li"))}}}},state:function(c){var d=c.selection.getSelectedNode();return b.dom.getParentElement(d,{nodeName:"UL"})},value:function(){return a}}})(wysihtml5);(function(b){var a;b.commands.italic={exec:function(c,d){return b.commands.formatInline.exec(c,d,"i")},state:function(d,e,c){return b.commands.formatInline.state(d,e,"i")},value:function(){return a}}})(wysihtml5);(function(d){var b,c="wysiwyg-text-align-center",a=/wysiwyg-text-align-[a-z]+/g;d.commands.justifyCenter={exec:function(e,f){return d.commands.formatBlock.exec(e,"formatBlock",null,c,a)},state:function(e,f){return d.commands.formatBlock.state(e,"formatBlock",null,c,a)},value:function(){return b}}})(wysihtml5);(function(d){var b,c="wysiwyg-text-align-left",a=/wysiwyg-text-align-[a-z]+/g;d.commands.justifyLeft={exec:function(e,f){return d.commands.formatBlock.exec(e,"formatBlock",null,c,a)},state:function(e,f){return d.commands.formatBlock.state(e,"formatBlock",null,c,a)},value:function(){return b}}})(wysihtml5);(function(d){var b,c="wysiwyg-text-align-right",a=/wysiwyg-text-align-[a-z]+/g;d.commands.justifyRight={exec:function(e,f){return d.commands.formatBlock.exec(e,"formatBlock",null,c,a)},state:function(e,f){return d.commands.formatBlock.state(e,"formatBlock",null,c,a)},value:function(){return b}}})(wysihtml5);(function(b){var a;b.commands.underline={exec:function(c,d){return b.commands.formatInline.exec(c,d,"u")},state:function(c,d){return b.commands.formatInline.state(c,d,"u")},value:function(){return a}}})(wysihtml5);(function(j){var f=90,h=89,i=8,b=46,a=40,g='<span id="_wysihtml5-undo" class="_wysihtml5-temp">'+j.INVISIBLE_SPACE+"</span>",e='<span id="_wysihtml5-redo" class="_wysihtml5-temp">'+j.INVISIBLE_SPACE+"</span>",d=j.dom;function c(l){var k;while(k=l.querySelector("._wysihtml5-temp")){k.parentNode.removeChild(k)}}j.UndoManager=j.lang.Dispatcher.extend({constructor:function(k){this.editor=k;this.composer=k.composer;this.element=this.composer.element;this.history=[this.composer.getValue()];this.position=1;if(this.composer.commands.support("insertHTML")){this._observe()}},_observe:function(){var n=this,p=this.composer.sandbox.getDocument(),k;d.observe(this.element,"keydown",function(s){if(s.altKey||(!s.ctrlKey&&!s.metaKey)){return}var t=s.keyCode,q=t===f&&!s.shiftKey,r=(t===f&&s.shiftKey)||(t===h);if(q){n.undo();s.preventDefault()}else{if(r){n.redo();s.preventDefault()}}});d.observe(this.element,"keydown",function(q){var r=q.keyCode;if(r===k){return}k=r;if(r===i||r===b){n.transact()}});if(j.browser.hasUndoInContextMenu()){var l,m,o=function(){c(p);clearInterval(l)};d.observe(this.element,"contextmenu",function(){o();n.composer.selection.executeAndRestoreSimple(function(){if(n.element.lastChild){n.composer.selection.setAfter(n.element.lastChild)}p.execCommand("insertHTML",false,g);p.execCommand("insertHTML",false,e);p.execCommand("undo",false,null)});l=setInterval(function(){if(p.getElementById("_wysihtml5-redo")){o();n.redo()}else{if(!p.getElementById("_wysihtml5-undo")){o();n.undo()}}},400);if(!m){m=true;d.observe(document,"mousedown",o);d.observe(p,["mousedown","paste","cut","copy"],o)}})}this.editor.observe("newword:composer",function(){n.transact()}).observe("beforecommand:composer",function(){n.transact()})},transact:function(){var m=this.history[this.position-1],k=this.composer.getValue();if(k==m){return}var l=this.history.length=this.position;if(l>a){this.history.shift();this.position--}this.position++;this.history.push(k)},undo:function(){this.transact();if(this.position<=1){return}this.set(this.history[--this.position-1]);this.editor.fire("undo:composer")},redo:function(){if(this.position>=this.history.length){return}this.set(this.history[++this.position-1]);this.editor.fire("redo:composer")},set:function(k){this.composer.setValue(k);this.editor.focus(true)}})})(wysihtml5);wysihtml5.views.View=Base.extend({constructor:function(b,c,a){this.parent=b;this.element=c;this.config=a;this._observeViewChange()},_observeViewChange:function(){var a=this;this.parent.observe("beforeload",function(){a.parent.observe("change_view",function(b){if(b===a.name){a.parent.currentView=a;a.show();setTimeout(function(){a.focus()},0)}else{a.hide()}})})},focus:function(){if(this.element.ownerDocument.querySelector(":focus")===this.element){return}try{this.element.focus()}catch(a){}},hide:function(){this.element.style.display="none"},show:function(){this.element.style.display=""},disable:function(){this.element.setAttribute("disabled","disabled")},enable:function(){this.element.removeAttribute("disabled")}});(function(c){var b=c.dom,a=c.browser;c.views.Composer=c.views.View.extend({name:"composer",CARET_HACK:"<br>",constructor:function(e,f,d){this.base(e,f,d);this.textarea=this.parent.textarea;this._initSandbox()},clear:function(){this.element.innerHTML=a.displaysCaretInEmptyContentEditableCorrectly()?"":this.CARET_HACK},resize:function(){var h=["width","height","top","left","right","bottom"];var f=this;var g=this.textarea.element;var e=b.getStyle("display").from(g),d=b.getStyle("display").from(f.iframe);g.style.display="";f.iframe.style.display="none";b.copyStyles(h).from(g).to(f.iframe).andTo(f.focusStylesHost).andTo(f.blurStylesHost);f.iframe.style.display=d;g.style.display=e},getValue:function(e){var d=this.isEmpty()?"":c.quirks.getCorrectInnerHTML(this.element);if(e){d=this.parent.parse(d)}d=c.lang.string(d).replace(c.INVISIBLE_SPACE).by("");return d},setValue:function(d,e){if(e){d=this.parent.parse(d)}this.element.innerHTML=d},show:function(){this.iframe.style.display=this._displayStyle||"";this.disable();this.enable()},hide:function(){this._displayStyle=b.getStyle("display").from(this.iframe);if(this._displayStyle==="none"){this._displayStyle=null}this.iframe.style.display="none"},disable:function(){this.element.removeAttribute("contentEditable");this.base()},enable:function(){this.element.setAttribute("contentEditable","true");this.base()},focus:function(e){if(c.browser.doesAsyncFocus()&&this.hasPlaceholderSet()){this.clear()}this.base();var d=this.element.lastChild;if(e&&d){if(d.nodeName==="BR"){this.selection.setBefore(this.element.lastChild)}else{this.selection.setAfter(this.element.lastChild)}}},getTextContent:function(){return b.getTextContent(this.element)},hasPlaceholderSet:function(){return this.getTextContent()==this.textarea.element.getAttribute("placeholder")},isEmpty:function(){var e=this.element.innerHTML,d="blockquote, ul, ol, img, embed, object, table, iframe, svg, video, audio, button, input, select, textarea";return e===""||e===this.CARET_HACK||this.hasPlaceholderSet()||(this.getTextContent()===""&&!this.element.querySelector(d))},_initSandbox:function(){var e=this;this.sandbox=new b.Sandbox(function(){e._create()},{stylesheets:this.config.stylesheets});this.iframe=this.sandbox.getIframe();var d=document.createElement("input");d.type="hidden";d.name="_wysihtml5_mode";d.value=1;var f=this.textarea.element;b.insert(this.iframe).after(f);b.insert(d).after(f)},_create:function(){var f=this;this.doc=this.sandbox.getDocument();this.element=this.doc.body;this.textarea=this.parent.textarea;this.element.innerHTML=this.textarea.getValue(true);this.enable();this.selection=new c.Selection(this.parent);this.commands=new c.Commands(this.parent);b.copyAttributes(["className","spellcheck","title","lang","dir","accessKey"]).from(this.textarea.element).to(this.element);b.addClass(this.element,this.config.composerClassName);if(this.config.style){this.style()}this.observe();var e=this.config.name;if(e){b.addClass(this.element,e);b.addClass(this.iframe,e)}var d=typeof(this.config.placeholder)==="string"?this.config.placeholder:this.textarea.element.getAttribute("placeholder");if(d){b.simulatePlaceholder(this.parent,this,d)}this.commands.exec("styleWithCSS",false);this._initAutoLinking();this._initObjectResizing();this._initUndoManager();if(this.textarea.element.hasAttribute("autofocus")||document.querySelector(":focus")==this.textarea.element){setTimeout(function(){f.focus()},100)}c.quirks.insertLineBreakOnReturn(this);if(!a.clearsContentEditableCorrectly()){c.quirks.ensureProperClearing(this)}if(!a.clearsListsInContentEditableCorrectly()){c.quirks.ensureProperClearingOfLists(this)}if(this.initSync&&this.config.sync){this.initSync()}this.textarea.hide();this.parent.fire("beforeload").fire("load")},_initAutoLinking:function(){var h=this,e=a.canDisableAutoLinking(),f=a.doesAutoLinkingInContentEditable();if(e){this.commands.exec("autoUrlDetect",false)}if(!this.config.autoLink){return}if(!f||(f&&e)){this.parent.observe("newword:composer",function(){h.selection.executeAndRestore(function(j,k){b.autoLink(k.parentNode)})})}var d=this.sandbox.getDocument().getElementsByTagName("a"),i=b.autoLink.URL_REG_EXP,g=function(j){var k=c.lang.string(b.getTextContent(j)).trim();if(k.substr(0,4)==="www."){k="http://"+k}return k};b.observe(this.element,"keydown",function(l){if(!d.length){return}var m=h.selection.getSelectedNode(l.target.ownerDocument),k=b.getParentElement(m,{nodeName:"A"},4),j;if(!k){return}j=g(k);setTimeout(function(){var n=g(k);if(n===j){return}if(n.match(i)){k.setAttribute("href",n)}},0)})},_initObjectResizing:function(){var f=["width","height"],e=f.length,d=this.element;this.commands.exec("enableObjectResizing",this.config.allowObjectResizing);if(this.config.allowObjectResizing){if(a.supportsEvent("resizeend")){b.observe(d,"resizeend",function(j){var l=j.target||j.srcElement,h=l.style,g=0,k;for(;g<e;g++){k=f[g];if(h[k]){l.setAttribute(k,parseInt(h[k],10));h[k]=""}}c.quirks.redraw(d)})}}else{if(a.supportsEvent("resizestart")){b.observe(d,"resizestart",function(g){g.preventDefault()})}}},_initUndoManager:function(){new c.UndoManager(this.parent)}})})(wysihtml5);(function(j){var a=j.dom,g=document,d=window,e=g.createElement("div"),b=["background-color","color","cursor","font-family","font-size","font-style","font-variant","font-weight","line-height","letter-spacing","text-align","text-decoration","text-indent","text-rendering","word-break","word-wrap","word-spacing"],h=["background-color","border-collapse","border-bottom-color","border-bottom-style","border-bottom-width","border-left-color","border-left-style","border-left-width","border-right-color","border-right-style","border-right-width","border-top-color","border-top-style","border-top-width","clear","display","float","margin-bottom","margin-left","margin-right","margin-top","outline-color","outline-offset","outline-width","outline-style","padding-left","padding-right","padding-top","padding-bottom","position","top","left","right","bottom","z-index","vertical-align","text-align","-webkit-box-sizing","-moz-box-sizing","-ms-box-sizing","box-sizing","-webkit-box-shadow","-moz-box-shadow","-ms-box-shadow","box-shadow","-webkit-border-top-right-radius","-moz-border-radius-topright","border-top-right-radius","-webkit-border-bottom-right-radius","-moz-border-radius-bottomright","border-bottom-right-radius","-webkit-border-bottom-left-radius","-moz-border-radius-bottomleft","border-bottom-left-radius","-webkit-border-top-left-radius","-moz-border-radius-topleft","border-top-left-radius","width","height"],c=["width","height","top","left","right","bottom"],f=["html             { height: 100%; }","body             { min-height: 100%; padding: 0; margin: 0; margin-top: -1px; padding-top: 1px; }","._wysihtml5-temp { display: none; }",j.browser.isGecko?"body.placeholder { color: graytext !important; }":"body.placeholder { color: #a9a9a9 !important; }","body[disabled]   { background-color: #eee !important; color: #999 !important; cursor: default !important; }","img:-moz-broken  { -moz-force-broken-image-icon: 1; height: 24px; width: 24px; }"];var i=function(m){if(m.setActive){try{m.setActive()}catch(o){}}else{var n=m.style,p=g.documentElement.scrollTop||g.body.scrollTop,l=g.documentElement.scrollLeft||g.body.scrollLeft,k={position:n.position,top:n.top,left:n.left,WebkitUserSelect:n.WebkitUserSelect};a.setStyles({position:"absolute",top:"-99999px",left:"-99999px",WebkitUserSelect:"none"}).on(m);m.focus();a.setStyles(k).on(m);if(d.scrollTo){d.scrollTo(l,p)}}};j.views.Composer.prototype.style=function(){var o=this,n=g.querySelector(":focus"),q=this.textarea.element,k=q.hasAttribute("placeholder"),p=k&&q.getAttribute("placeholder");this.focusStylesHost=this.focusStylesHost||e.cloneNode(false);this.blurStylesHost=this.blurStylesHost||e.cloneNode(false);if(k){q.removeAttribute("placeholder")}if(q===n){q.blur()}a.copyStyles(h).from(q).to(this.iframe).andTo(this.blurStylesHost);a.copyStyles(b).from(q).to(this.element).andTo(this.blurStylesHost);a.insertCSS(f).into(this.element.ownerDocument);i(q);a.copyStyles(h).from(q).to(this.focusStylesHost);a.copyStyles(b).from(q).to(this.focusStylesHost);var m=j.lang.array(h).without(["display"]);if(n){n.focus()}else{q.blur()}if(k){q.setAttribute("placeholder",p)}if(!j.browser.hasCurrentStyleProperty()){var l=a.observe(d,"resize",function(){if(!a.contains(document.documentElement,o.iframe)){l.stop();return}var s=a.getStyle("display").from(q),r=a.getStyle("display").from(o.iframe);q.style.display="";o.iframe.style.display="none";a.copyStyles(c).from(q).to(o.iframe).andTo(o.focusStylesHost).andTo(o.blurStylesHost);o.iframe.style.display=r;q.style.display=s})}this.parent.observe("focus:composer",function(){a.copyStyles(m).from(o.focusStylesHost).to(o.iframe);a.copyStyles(b).from(o.focusStylesHost).to(o.element)});this.parent.observe("blur:composer",function(){a.copyStyles(m).from(o.blurStylesHost).to(o.iframe);a.copyStyles(b).from(o.blurStylesHost).to(o.element)});return this}})(wysihtml5);(function(d){var c=d.dom,b=d.browser,a={"66":"bold","73":"italic","85":"underline"};d.views.Composer.prototype.observe=function(){var i=this,k=this.getValue(),h=this.sandbox.getIframe(),g=this.element,f=b.supportsEventsInIframeCorrectly()?g:this.sandbox.getWindow(),e=b.supportsEvent("drop")?["drop","paste"]:["dragdrop","paste"];c.observe(h,"DOMNodeRemoved",function(){clearInterval(j);i.parent.fire("destroy:composer")});var j=setInterval(function(){if(!c.contains(document.documentElement,h)){clearInterval(j);i.parent.fire("destroy:composer")}},250);c.observe(f,"focus",function(){i.parent.fire("focus").fire("focus:composer");setTimeout(function(){k=i.getValue()},0)});c.observe(f,"blur",function(){if(k!==i.getValue()){i.parent.fire("change").fire("change:composer")}i.parent.fire("blur").fire("blur:composer")});if(d.browser.isIos()){c.observe(g,"blur",function(){var n=g.ownerDocument.createElement("input"),p=document.documentElement.scrollTop||document.body.scrollTop,m=document.documentElement.scrollLeft||document.body.scrollLeft;try{i.selection.insertNode(n)}catch(o){g.appendChild(n)}n.focus();n.parentNode.removeChild(n);window.scrollTo(m,p)})}c.observe(g,"dragenter",function(){i.parent.fire("unset_placeholder")});if(b.firesOnDropOnlyWhenOnDragOverIsCancelled()){c.observe(g,["dragover","dragenter"],function(m){m.preventDefault()})}c.observe(g,e,function(m){var o=m.dataTransfer,n;if(o&&b.supportsDataTransfer()){n=o.getData("text/html")||o.getData("text/plain")}if(n){g.focus();i.commands.exec("insertHTML",n);i.parent.fire("paste").fire("paste:composer");m.stopPropagation();m.preventDefault()}else{setTimeout(function(){i.parent.fire("paste").fire("paste:composer")},0)}});c.observe(g,"keyup",function(m){var n=m.keyCode;if(n===d.SPACE_KEY||n===d.ENTER_KEY){i.parent.fire("newword:composer")}});this.parent.observe("paste:composer",function(){setTimeout(function(){i.parent.fire("newword:composer")},0)});if(!b.canSelectImagesInContentEditable()){c.observe(g,"mousedown",function(m){var n=m.target;if(n.nodeName==="IMG"){i.selection.selectNode(n);m.preventDefault()}})}c.observe(g,"keydown",function(m){var n=m.keyCode,o=a[n];if((m.ctrlKey||m.metaKey)&&!m.altKey&&o){i.commands.exec(o);m.preventDefault()}});c.observe(g,"keydown",function(n){var p=i.selection.getSelectedNode(true),o=n.keyCode,m;if(p&&p.nodeName==="IMG"&&(o===d.BACKSPACE_KEY||o===d.DELETE_KEY)){m=p.parentNode;m.removeChild(p);if(m.nodeName==="A"&&!m.firstChild){m.parentNode.removeChild(m)}setTimeout(function(){d.quirks.redraw(g)},0);n.preventDefault()}});var l={IMG:"Image: ",A:"Link: "};c.observe(g,"mouseover",function(n){var o=n.target,q=o.nodeName,p;if(q!=="A"&&q!=="IMG"){return}var m=o.hasAttribute("title");if(!m){p=l[q]+(o.getAttribute("href")||o.getAttribute("src"));o.setAttribute("title",p)}})}})(wysihtml5);(function(b){var a=400;b.views.Synchronizer=Base.extend({constructor:function(e,c,d){this.editor=e;this.textarea=c;this.composer=d;this._observe()},fromComposerToTextarea:function(c){this.textarea.setValue(b.lang.string(this.composer.getValue()).trim(),c)},fromTextareaToComposer:function(d){var c=this.textarea.getValue();if(c){this.composer.setValue(c,d)}else{this.composer.clear();this.editor.fire("set_placeholder")}},sync:function(c){if(this.editor.currentView.name==="textarea"){this.fromTextareaToComposer(c)}else{this.fromComposerToTextarea(c)}},_observe:function(){var c,e=this,d=this.textarea.element.form,g=function(){c=setInterval(function(){e.fromComposerToTextarea()},a)},f=function(){clearInterval(c);c=null};g();if(d){b.dom.observe(d,"submit",function(){e.sync(true)});b.dom.observe(d,"reset",function(){setTimeout(function(){e.fromTextareaToComposer()},0)})}this.editor.observe("change_view",function(h){if(h==="composer"&&!c){e.fromTextareaToComposer(true);g()}else{if(h==="textarea"){e.fromComposerToTextarea(true);f()}}});this.editor.observe("destroy:composer",f)}})})(wysihtml5);wysihtml5.views.Textarea=wysihtml5.views.View.extend({name:"textarea",constructor:function(b,c,a){this.base(b,c,a);this._observe()},clear:function(){this.element.value=""},getValue:function(b){var a=this.isEmpty()?"":this.element.value;if(b){a=this.parent.parse(a)}return a},setValue:function(a,b){if(b){a=this.parent.parse(a)}this.element.value=a},hasPlaceholderSet:function(){var d=wysihtml5.browser.supportsPlaceholderAttributeOn(this.element),a=this.element.getAttribute("placeholder")||null,b=this.element.value,c=!b;return(d&&c)||(b===a)},isEmpty:function(){return !wysihtml5.lang.string(this.element.value).trim()||this.hasPlaceholderSet()},_observe:function(){var c=this.element,d=this.parent,a={focusin:"focus",focusout:"blur"},b=wysihtml5.browser.supportsEvent("focusin")?["focusin","focusout","change"]:["focus","blur","change"];d.observe("beforeload",function(){wysihtml5.dom.observe(c,b,function(f){var e=a[f.type]||f.type;d.fire(e).fire(e+":textarea")});wysihtml5.dom.observe(c,["paste","drop"],function(){setTimeout(function(){d.fire("paste").fire("paste:textarea")},0)})})}});(function(f){var e=f.dom,a="wysihtml5-command-dialog-opened",d="input, select, textarea",b="[data-wysihtml5-dialog-field]",c="data-wysihtml5-dialog-field";f.toolbar.Dialog=f.lang.Dispatcher.extend({constructor:function(h,g){this.link=h;this.container=g},_observe:function(){if(this._observed){return}var k=this,l=function(n){var i=k._serialize();if(i==k.elementToChange){k.fire("edit",i)}else{k.fire("save",i)}k.hide();n.preventDefault();n.stopPropagation()};e.observe(k.link,"click",function(i){if(e.hasClass(k.link,a)){setTimeout(function(){k.hide()},0)}});e.observe(this.container,"keydown",function(i){var n=i.keyCode;if(n===f.ENTER_KEY){l(i)}if(n===f.ESCAPE_KEY){k.hide()}});e.delegate(this.container,"[data-wysihtml5-dialog-action=save]","click",l);e.delegate(this.container,"[data-wysihtml5-dialog-action=cancel]","click",function(i){k.fire("cancel");k.hide();i.preventDefault();i.stopPropagation()});var h=this.container.querySelectorAll(d),g=0,j=h.length,m=function(){clearInterval(k.interval)};for(;g<j;g++){e.observe(h[g],"change",m)}this._observed=true},_serialize:function(){var k=this.elementToChange||{},g=this.container.querySelectorAll(b),j=g.length,h=0;for(;h<j;h++){k[g[h].getAttribute(c)]=g[h].value}return k},_interpolate:function(m){var l,o,k,n=document.querySelector(":focus"),g=this.container.querySelectorAll(b),j=g.length,h=0;for(;h<j;h++){l=g[h];if(l===n){continue}if(m&&l.type==="hidden"){continue}o=l.getAttribute(c);k=this.elementToChange?(this.elementToChange[o]||""):l.defaultValue;l.value=k}},show:function(j){var h=this,g=this.container.querySelector(d);this.elementToChange=j;this._observe();this._interpolate();if(j){this.interval=setInterval(function(){h._interpolate(true)},500)}e.addClass(this.link,a);this.container.style.display="";this.fire("show");if(g&&!j){try{g.focus()}catch(i){}}},hide:function(){clearInterval(this.interval);this.elementToChange=null;e.removeClass(this.link,a);this.container.style.display="none";this.fire("hide")}})})(wysihtml5);(function(f){var e=f.dom;var d={position:"relative"};var c={left:0,margin:0,opacity:0,overflow:"hidden",padding:0,position:"absolute",top:0,zIndex:1};var b={cursor:"inherit",fontSize:"50px",height:"50px",marginTop:"-25px",outline:0,padding:0,position:"absolute",right:"-4px",top:"50%"};var a={"x-webkit-speech":"","speech":""};f.toolbar.Speech=function(i,j){var h=document.createElement("input");if(!f.browser.supportsSpeechApiOn(h)){j.style.display="none";return}var k=document.createElement("div");f.lang.object(c).merge({width:j.offsetWidth+"px",height:j.offsetHeight+"px"});e.insert(h).into(k);e.insert(k).into(j);e.setStyles(b).on(h);e.setAttributes(a).on(h);e.setStyles(c).on(k);e.setStyles(d).on(j);var g="onwebkitspeechchange" in h?"webkitspeechchange":"speechchange";e.observe(h,g,function(){i.execCommand("insertText",h.value);h.value=""});e.observe(h,"click",function(l){if(e.hasClass(j,"wysihtml5-command-disabled")){l.preventDefault()}l.stopPropagation()})}})(wysihtml5);(function(f){var a="wysihtml5-command-disabled",b="wysihtml5-commands-disabled",c="wysihtml5-command-active",d="wysihtml5-action-active",e=f.dom;f.toolbar.Toolbar=Base.extend({constructor:function(k,g){this.editor=k;this.container=typeof(g)==="string"?document.getElementById(g):g;this.composer=k.composer;this._getLinks("command");this._getLinks("action");this._observe();this.show();var h=this.container.querySelectorAll("[data-wysihtml5-command=insertSpeech]"),l=h.length,j=0;for(;j<l;j++){new f.toolbar.Speech(this,h[j])}},_getLinks:function(m){var q=this[m+"Links"]=f.lang.array(this.container.querySelectorAll("[data-wysihtml5-"+m+"]")).get(),j=q.length,k=0,g=this[m+"Mapping"]={},n,p,h,o,l;for(;k<j;k++){n=q[k];h=n.getAttribute("data-wysihtml5-"+m);o=n.getAttribute("data-wysihtml5-"+m+"-value");p=this.container.querySelector("[data-wysihtml5-"+m+"-group='"+h+"']");l=this._getDialog(n,h);g[h+":"+o]={link:n,group:p,name:h,value:o,dialog:l,state:false}}},_getDialog:function(k,l){var j=this,i=this.container.querySelector("[data-wysihtml5-dialog='"+l+"']"),h,g;if(i){h=new f.toolbar.Dialog(k,i);h.observe("show",function(){g=j.composer.selection.getBookmark();j.editor.fire("show:dialog",{command:l,dialogContainer:i,commandLink:k})});h.observe("save",function(m){if(g){j.composer.selection.setBookmark(g)}j._execCommand(l,m);j.editor.fire("save:dialog",{command:l,dialogContainer:i,commandLink:k})});h.observe("cancel",function(){j.editor.focus(false);j.editor.fire("cancel:dialog",{command:l,dialogContainer:i,commandLink:k})})}return h},execCommand:function(i,g){if(this.commandsDisabled){return}var h=this.commandMapping[i+":"+g];if(h&&h.dialog&&!h.state){h.dialog.show()}else{this._execCommand(i,g)}},_execCommand:function(h,g){this.editor.focus(false);this.composer.commands.exec(h,g);this._updateLinkStates()},execAction:function(h){var g=this.editor;switch(h){case"change_view":if(g.currentView===g.textarea){g.fire("change_view","composer")}else{g.fire("change_view","textarea")}break}},_observe:function(){var m=this,k=this.editor,g=this.container,h=this.commandLinks.concat(this.actionLinks),l=h.length,j=0;for(;j<l;j++){e.setAttributes({href:"javascript:;",unselectable:"on"}).on(h[j])}e.delegate(g,"[data-wysihtml5-command]","mousedown",function(i){i.preventDefault()});e.delegate(g,"[data-wysihtml5-command]","click",function(o){var n=this,p=n.getAttribute("data-wysihtml5-command"),i=n.getAttribute("data-wysihtml5-command-value");m.execCommand(p,i);o.preventDefault()});e.delegate(g,"[data-wysihtml5-action]","click",function(i){var n=this.getAttribute("data-wysihtml5-action");m.execAction(n);i.preventDefault()});k.observe("focus:composer",function(){m.bookmark=null;clearInterval(m.interval);m.interval=setInterval(function(){m._updateLinkStates()},500)});k.observe("blur:composer",function(){clearInterval(m.interval)});k.observe("destroy:composer",function(){clearInterval(m.interval)});k.observe("change_view",function(i){setTimeout(function(){m.commandsDisabled=(i!=="composer");m._updateLinkStates();if(m.commandsDisabled){e.addClass(g,b)}else{e.removeClass(g,b)}},0)})},_updateLinkStates:function(){var j=this.composer.element,h=this.commandMapping,m=this.actionMapping,g,l,k,n;for(g in h){n=h[g];if(this.commandsDisabled){l=false;e.removeClass(n.link,c);if(n.group){e.removeClass(n.group,c)}if(n.dialog){n.dialog.hide()}}else{l=this.composer.commands.state(n.name,n.value);if(f.lang.object(l).isArray()){l=l.length===1?l[0]:true}e.removeClass(n.link,a);if(n.group){e.removeClass(n.group,a)}}if(n.state===l){continue}n.state=l;if(l){e.addClass(n.link,c);if(n.group){e.addClass(n.group,c)}if(n.dialog){if(typeof(l)==="object"){n.dialog.show(l)}else{n.dialog.hide()}}}else{e.removeClass(n.link,c);if(n.group){e.removeClass(n.group,c)}if(n.dialog){n.dialog.hide()}}}for(g in m){k=m[g];if(k.name==="change_view"){k.state=this.editor.currentView===this.editor.textarea;if(k.state){e.addClass(k.link,d)}else{e.removeClass(k.link,d)}}}},show:function(){this.container.style.display=""},hide:function(){this.container.style.display="none"}})})(wysihtml5);(function(c){var b;var a={name:b,style:true,toolbar:b,autoLink:true,parserRules:{tags:{br:{},span:{},div:{},p:{}},classes:{}},parser:c.dom.parse,composerClassName:"wysihtml5-editor",bodyClassName:"wysihtml5-supported",stylesheets:[],placeholderText:b,allowObjectResizing:true,supportTouchDevices:true};c.Editor=c.lang.Dispatcher.extend({constructor:function(h,d){this.textareaElement=typeof(h)==="string"?document.getElementById(h):h;this.config=c.lang.object({}).merge(a).merge(d).get();this.textarea=new c.views.Textarea(this,this.textareaElement,this.config);this.currentView=this.textarea;this._isCompatible=c.browser.supported();if(!this._isCompatible||(!this.config.supportTouchDevices&&c.browser.isTouchDevice())){var f=this;setTimeout(function(){f.fire("beforeload").fire("load")},0);return}c.dom.addClass(document.body,this.config.bodyClassName);this.composer=new c.views.Composer(this,this.textareaElement,this.config);this.currentView=this.composer;if(typeof(this.config.parser)==="function"){this._initParser()}this.observe("beforeload",function(){this.synchronizer=new c.views.Synchronizer(this,this.textarea,this.composer);if(this.config.toolbar){this.toolbar=new c.toolbar.Toolbar(this,this.config.toolbar)}});try{console.log("Heya! This page is using wysihtml5 for rich text editing. Check out https://github.com/xing/wysihtml5")}catch(g){}},isCompatible:function(){return this._isCompatible},clear:function(){this.currentView.clear();return this},getValue:function(d){return this.currentView.getValue(d)},setValue:function(d,e){if(!d){return this.clear()}this.currentView.setValue(d,e);return this},focus:function(d){this.currentView.focus(d);return this},disable:function(){this.currentView.disable();return this},enable:function(){this.currentView.enable();return this},isEmpty:function(){return this.currentView.isEmpty()},hasPlaceholderSet:function(){return this.currentView.hasPlaceholderSet()},parse:function(d){var e=this.config.parser(d,this.config.parserRules,this.composer.sandbox.getDocument(),true);if(typeof(d)==="object"){c.quirks.redraw(d)}return e},_initParser:function(){this.observe("paste:composer",function(){var d=true,e=this;e.composer.selection.executeAndRestore(function(){c.quirks.cleanPastedHTML(e.composer.element);e.parse(e.composer.element)},d)});this.observe("paste:textarea",function(){var d=this.textarea.getValue(),e;e=this.parse(d);this.textarea.setValue(e)})}})})(wysihtml5);

/*common2.js*/
function setCookie(name, value, expires) { 
  if (!expires) expires=1000*60*60*24*365*5;
  path="/";
  domain=document.domain;
  secure=false;
  var today = new Date(); 
  today.setTime( today.getTime() ); 
  var expires_date = new Date( today.getTime() + (expires) ); 
  document.cookie = name + "=" +escape( value ) + 
          ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + //expires.toGMTString() 
          ( ( path ) ? ";path=" + path : "" ) + 
          ( ( domain ) ? ";domain=" + domain : "" ) + 
          ( ( secure ) ? ";secure" : "" ); 
  domain=".overbits.net";
  document.cookie = name + "=" +escape( value ) + 
          ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + //expires.toGMTString() 
          ( ( path ) ? ";path=" + path : "" ) + 
          ( ( domain ) ? ";domain=" + domain : "" ) + 
          ( ( secure ) ? ";secure" : "" ); 
} 

function getCookie( name ) {
  var nameOfCookie = name + "=";
  var x = 0;
  while ( x <= document.cookie.length ) {
    var y = (x+nameOfCookie.length);
    if ( document.cookie.substring( x, y ) == nameOfCookie ) {
      if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
         endOfCookie = document.cookie.length;
      return unescape( document.cookie.substring( y, endOfCookie ) );
    }
    x = document.cookie.indexOf( " ", x ) + 1;
    if ( x == 0 ) break;
  }
  return "";
}

function _getid(id){
	return document.getElementById(id);
}

function trim(str) {
  	return str.replace(/^\s*|\s*$/g,"");
}

function html_entity_encode(str){
  str = str.replace(/&/gi, "&amp;");
  str = str.replace(/>/gi, "&gt;");
  str = str.replace(/</gi, "&lt;");
  str = str.replace(/\"/gi, "&quot;");
  str = str.replace(/\'/gi, "&#039;");
  return str;
}

function shortstring(s,len){
	if (!s) s='';
	if (s.length > len) s=s.substr(0,len)+"...";
	return s;
}

function cutstringmiddle(s,len,left,right){
	if (s.length <= len) return s;			
	var s1,s2;	
	s1=s.substr(0,left);
	s2=s.substr(s.length-right,s.length);	
	return s1+'.....'+s2;
}

var messagetimer=null;
function show_message(s,x,y,padding,timeout){
function getWindowWidth(){
    var windowWidth = 0;
    if (typeof(window.innerWidth) == 'number'){
        windowWidth = window.innerWidth;
    }else{
        var ieStrict = document.documentElement.clientWidth;
        var ieQuirks = document.body.clientWidth; 
        windowWidth = (ieStrict > 0) ? ieStrict : ieQuirks;
    }
	if(!windowWidth) windowWidth=0;
    return windowWidth;
}
function getWindowHeight(){
    var windowHeight = 0;
    if (typeof(window.innerHeight) == 'number'){
        windowHeight = window.innerHeight;
    }else{
        var ieStrict = document.documentElement.clientHeight; 
        var ieQuirks = document.body.clientHeight;
        windowHeight = (ieStrict > 0) ? ieStrict : ieQuirks;
    }
	if(!windowHeight) windowHeight=0;
    return windowHeight;
}

function getScrollLeft(){
    var scrollLeft;
	if(document.body && document.body.scrollLeft){
		scrollLeft = document.body.scrollLeft;
	}else if(document.documentElement && document.documentElement.scrollLeft){
		scrollLeft = document.documentElement.scrollLeft;
	}
	if(!scrollLeft) scrollLeft=0;
    return scrollLeft;
}

function getScrollTop(){
    var scrollTop;
	if(document.body && document.body.scrollTop){
		scrollTop = document.body.scrollTop;
	}else if(document.documentElement && document.documentElement.scrollTop){
		scrollTop = document.documentElement.scrollTop;
	}
	if(!scrollTop) scrollTop=0;
    return scrollTop;
} 

	if (!x) x=10;
	if (!y) y=10;
	if (!padding) padding=5;
	if (!timeout) timeout=2000;

	var kind=1;
	for(var i=1; i <= 4; i++){
		var s1="layer_message";
		if (i>1) s1="layer_message"+i;
		var obj=document.getElementById(s1);
		if (obj){
			kind=i;
			break;
		}
	}
			
	obj.style.left="1px";
	obj.style.top="1px";		
	obj.innerHTML="<label>"+s+"</label>";
	obj.style.display="";	
	
	if (kind==1) {
		x=getScrollLeft()+x;	
		y=getScrollTop()+y;
	} else if (kind==2) {
		x=getScrollLeft()+((getWindowWidth()-obj.clientWidth) / 2);
		y=getScrollTop()+((getWindowHeight()-obj.clientHeight) / 2);
	} else if (kind==3) {
		x=document.body.offsetWidth-obj.clientWidth-5;
		y=getScrollTop()+y;
	} else {
		x=getScrollLeft()+((getWindowWidth()-obj.clientWidth) / 2);
		y=getScrollTop()+y;
	}
	x=parseInt(x);
	y=parseInt(y);
	
	obj.style["border"]="1px solid #000000";
	obj.style["padding"]=padding+"px";
	obj.style.left=x+"px";
	obj.style.top=y+"px";
	
	if (messagetimer) clearTimeout(messagetimer);
	messagetimer=setTimeout(hide_message, timeout);
}

function hide_message(){
	for(var i=1; i <= 4; i++){
		var s1="layer_message";
		if (i>1) s1="layer_message"+i;
		var obj=document.getElementById(s1);
		if (obj){
			obj.style.display="none";
		}
	}
}