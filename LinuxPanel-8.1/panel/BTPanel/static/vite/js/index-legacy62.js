System.register([],(function(r,n){"use strict";return{execute:function(){var n,t;r("r",(function(){if(t)return n;t=1;var r=/^(attrs|props|on|nativeOn|class|style|hook)$/;function e(r,n){return function(){r&&r.apply(this,arguments),n&&n.apply(this,arguments)}}return n=function(n){return n.reduce((function(n,t){var i,s,o,f,a;for(o in t)if(i=n[o],s=t[o],i&&r.test(o))if("class"===o&&("string"==typeof i&&(a=i,n[o]=i={},i[a]=!0),"string"==typeof s&&(a=s,t[o]=s={},s[a]=!0)),"on"===o||"nativeOn"===o||"hook"===o)for(f in s)i[f]=e(i[f],s[f]);else if(Array.isArray(i))n[o]=i.concat(s);else if(Array.isArray(s))n[o]=[i].concat(s);else for(f in s)i[f]=s[f];else n[o]=t[o];return n}),{})}}))}}}));
