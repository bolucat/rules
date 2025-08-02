// ==UserScript==
// @name            Bypass Paywalls Clean - fi/se
// @version         4.0.8.3
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.fi.se.user.js
// @updateURL       https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.fi.se.user.js
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @match           *://*.berlingske.dk/*
// @match           *://*.dn.se/*
// @match           *://*.etc.se/*
// @match           *://*.suomensotilas.fi/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @grant           GM.xmlHttpRequest
// @require         https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc_func.js
// ==/UserScript==

(function() {
  //'use strict';

window.setTimeout(function () {

if (matchDomain('berlingske.dk')) {
  let paywall = document.querySelector('div#paywall');
  removeDOMElement(paywall);
  let ads = 'div.advert-unit';
  hideDOMStyle(ads);
}

else if (matchDomain('dn.se')) {
  let url = window.location.href;
  getArchive(url, 'div.paywall-wrapper', '', 'article');
  let ads = 'div.bad';
  hideDOMStyle(ads);
}

else if (matchDomain('etc.se')) {
  let paywall = document.querySelector('section.prose-feature > section.teaser-section');
  if (paywall) {
    paywall.classList.remove('teaser-section');
    paywall.parentNode.querySelectorAll('.hidden').forEach(e => e.classList.remove('hidden'));
  }
  let ads = 'div[class$="-ad"], article section.font-sans';
  hideDOMStyle(ads);
  let video_iframes = document.querySelectorAll('div.embed-block > iframe[width][height]');
  for (let elem of video_iframes) {
    if (elem.width > 1000) {
      let ratio = elem.width / (mobile ? 320 : 640);
      elem.width = elem.width / ratio;
      elem.height = elem.height / ratio;
    }
  }
}

else if (matchDomain('suomensotilas.fi')) {
  let obscured = document.querySelector('div.epfl-pw-obscured');
  if (obscured)
    obscured.classList.remove('epfl-pw-obscured');
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
