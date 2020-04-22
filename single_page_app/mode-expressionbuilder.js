ace.define("ace/mode/expressionbuilder_highlight_rules",[],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},{token:"keyword",regex:"^\\s*#(def|eval)"}]},this.normalizeRules()};r.inherits(s,i),t.ExpressionBuilderHighlightRules=s}),ace.define("ace/mode/matching_brace_outdent",[],function(e,t,n){"use strict";var r=e("../range").Range,i=function(){};(function(){this.checkOutdent=function(e,t){return/^\s+$/.test(e)?/^\s*\}/.test(t):!1},this.autoOutdent=function(e,t){var n=e.getLine(t),i=n.match(/^(\s*\})/);if(!i)return 0;var s=i[1].length,o=e.findMatchingBracket({row:t,column:s});if(!o||o.row==t)return 0;var u=this.$getIndent(e.getLine(o.row));e.replace(new r(t,0,t,s-1),u)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype),t.MatchingBraceOutdent=i}),ace.define("ace/mode/expressionbuilder",[],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./expressionbuilder_highlight_rules").ExpressionBuilderHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,u=e("./behaviour/cstyle").CstyleBehaviour,a=function(){this.HighlightRules=s,this.$outdent=new o,this.$behaviour=new u};r.inherits(a,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),s=i.tokens;if(s.length&&s[s.length-1].type=="comment")return r;if(e=="start"){var o=t.match(/^.*[\{\(\[]\s*$/);o&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.createWorker=function(e){return null},this.$id="ace/mode/expressionbuilder"}.call(a.prototype),t.Mode=a});
                (function() {
                    ace.require(["ace/mode/expressionbuilder"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            