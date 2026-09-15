import { LANG_PARAM, LANG_STORAGE_KEY } from './locales';

/**
 * Inline <head> script that sends a visitor to their language before the page paints. Site
 * pages are prerendered static files, so this can't happen on the server.
 *
 * On site pages (not overlays or tools):
 * - a `/tr` URL or a `?lang=` param is an explicit choice: it's saved and wins;
 * - otherwise the saved choice, then the first supported browser language, then English;
 * - the visitor lands on the matching URL (`?lang=` is dropped once applied).
 * Crawlers send an English browser language and have no saved choice, so they stay on the
 * canonical URLs. Kept in sync with `pickBrowserLocale`; `landing.test.ts` runs both.
 */
export const LANDING_SCRIPT = `(function(){try{
var p=location.pathname;
if(p.indexOf("/widgets/")===0||p.indexOf("/tools/")===0)return;
var onTr=p==="/tr"||p.indexOf("/tr/")===0;
var q=new URLSearchParams(location.search);
var param=q.get("${LANG_PARAM}");
if(param==="tr"||param==="en")q.delete("${LANG_PARAM}");else param=null;
var explicit=param||(onTr?"tr":null);
var saved=null;
try{saved=localStorage.getItem("${LANG_STORAGE_KEY}");if(explicit)localStorage.setItem("${LANG_STORAGE_KEY}",explicit)}catch(e){}
var want=explicit||(saved==="tr"||saved==="en"?saved:null);
if(!want){var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];
for(var i=0;i<langs.length&&!want;i++){var b=String(langs[i]).slice(0,2).toLowerCase();if(b==="tr"||b==="en")want=b}}
var en=onTr?(p.slice(3)||"/"):p;
var target=want==="tr"?(en==="/"?"/tr":"/tr"+en):en;
if(target!==p||param){var s=q.toString();location.replace(target+(s?"?"+s:"")+location.hash)}
}catch(e){}})();`;
