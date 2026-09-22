import { DEFAULT_LOCALE, LANG_PARAM, LANG_STORAGE_KEY, LOCALES } from './locales';

/**
 * Inline <head> script that sends a visitor to their language before the page paints. Site
 * pages are prerendered static files, so this can't happen on the server.
 *
 * On site pages (not overlays or tools):
 * - a language URL like `/tr` or a `?lang=` param is an explicit choice: it's saved and wins;
 * - otherwise the saved choice, then the first supported browser language, then English;
 * - the visitor lands on the matching URL (`?lang=` is dropped once applied).
 * Crawlers send an English browser language and have no saved choice, so they stay on the
 * canonical URLs. Kept in sync with `pickBrowserLocale`; `landing.test.ts` runs both.
 */
export const LANDING_SCRIPT = `(function(){try{
var L=${JSON.stringify(LOCALES)},D="${DEFAULT_LOCALE}";
var p=location.pathname;
if(p.indexOf("/widgets/")===0||p.indexOf("/tools/")===0)return;
var seg=p.split("/")[1];
var onLoc=seg!==D&&L.indexOf(seg)>=0?seg:null;
var q=new URLSearchParams(location.search);
var param=q.get("${LANG_PARAM}");
if(L.indexOf(param)>=0)q.delete("${LANG_PARAM}");else param=null;
var explicit=param||onLoc;
var saved=null;
try{saved=localStorage.getItem("${LANG_STORAGE_KEY}");if(explicit)localStorage.setItem("${LANG_STORAGE_KEY}",explicit)}catch(e){}
var want=explicit||(L.indexOf(saved)>=0?saved:null);
if(!want){var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];
for(var i=0;i<langs.length&&!want;i++){var b=String(langs[i]).slice(0,2).toLowerCase();if(L.indexOf(b)>=0)want=b}}
var en=onLoc?(p.slice(onLoc.length+1)||"/"):p;
var target=want&&want!==D?(en==="/"?"/"+want:"/"+want+en):en;
if(target!==p||param){var s=q.toString();location.replace(target+(s?"?"+s:"")+location.hash)}
}catch(e){}})();`;
