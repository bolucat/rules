// ==UserScript==
// @name            Bypass Paywalls Clean - de/at/ch
// @version         3.9.2.3
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.de.user.js
// @updateURL       https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.de.user.js
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @match           *://*.de/*
// @match           *://*.beobachter.ch/*
// @match           *://*.faz.net/*
// @match           *://*.handelsblatt.com/*
// @match           *://*.handelszeitung.ch/*
// @match           *://*.kurier.at/*
// @match           *://*.nzz.ch/*
// @match           *://*.profil.at/*
// @match           *://*.schweizermonat.ch/*
// @match           *://*.themarket.ch/*
// @match           *://*.tt.com/*
// @match           *://*.vn.at/*
// @match           *://*.vol.at/*
// @match           *://*.wochenblatt.com/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         och.to
// @grant           GM.xmlHttpRequest
// ==/UserScript==

(function() {
  'use strict';

var func_post;

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

var overlay = document.querySelector('body.didomi-popup-open');
if (overlay)
  overlay.classList.remove('didomi-popup-open');
var ads = 'div.OUTBRAIN, div[id^="taboola-"], div.ad-container, div[class*="-ad-container"], div[class*="_ad-container"], div.arc_ad, div[id^="poool-"]';
hideDOMStyle(ads, 10);

var de_funke_medien_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'ikz-online.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_lv_domains = ['profi.de', 'wochenblatt.com'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de', 'rnd.de'];
var de_motor_presse_domains = ['aerokurier.de', 'auto-motor-und-sport.de', 'flugrevue.de', 'motorradonline.de', 'womenshealth.de'];
var de_rp_medien_domains = ['ga.de', 'rp-online.de', 'saarbruecker-zeitung.de', 'volksfreund.de'];

if (matchDomain('aachener-zeitung.de')) {
  let url = window.location.href;
  getArchive(url, 'div[data-testid="paywall-container"]', '', 'article');
  let shade = document.querySelector('div.paywalled-article');
  if (shade)
    shade.classList.remove('paywalled-article');
  let noscroll = document.querySelectorAll('html[class], body[class]');
  for (let elem of noscroll)
    elem.removeAttribute('class');
}

else if (matchDomain('aerztezeitung.de')) {
  let paywall = document.querySelector('div.AZLoginModule');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let content = document.querySelector('p.intro');
        if (json_text && content) {
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          content.after(article_new);
        }
      }
    }
  }
}

else if (matchDomain('augsburger-allgemeine.de')) {
  let paywall_sel = 'div.piano-inline-paywall';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    let url = window.location.href;
    let plus = pageContains('span[class*="plusplus"]', 'Bildergalerie');
    if (plus.length) {
      removeDOMElement(paywall);
      let article = document.querySelector('div#page-body');
      if (article)
        article.before(googleSearchToolLink(url));
    } else
      getOchToUnlock(url, paywall_sel, '', 'div#article-body-paid-content');
  }
  let ads = 'div[data-slot-name^="banner"], div[id^="taboola-"], div#piano-inline-offer';
  hideDOMStyle(ads);
}

else if (matchDomain(['beobachter.ch', 'handelszeitung.ch'])) {
  let paywall = document.querySelector('div#piano-inlined');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = document.querySelector('script#hydrationdata');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json) {
          let url_id = json_script.text.includes('"gcid":"') ? json_script.text.split('"gcid":"')[1].split('"')[0] : '';
          if (url_id && !window.location.pathname.endsWith(url_id))
            refreshCurrentTab();
          let pars = json.state;
          let paragraphs = document.querySelectorAll('div.paragraph');
          let article = paragraphs[0];
          if (article) {
            article.setAttribute('class', 'paragraph text-paragraph');
            for (let paragraph of paragraphs)
              paragraph.innerHTML = '';
            let parser = new DOMParser();
            for (let par in pars) {
              let par_elem = pars[par];
              let elem = document.createElement('div');
              elem.style = 'font-size: 1.7rem; margin: 25px;';
              let sub_elem = '';
              if (par_elem.__typename === 'TextParagraph' && par_elem.text) {
                let content_new = parser.parseFromString('<div>' + par_elem.text + '</div>', 'text/html');
                sub_elem = content_new.querySelector('div');
              } else if (par_elem.__typename === 'EmbedParagraph' && par_elem.embedCode) {
                let content_new = parser.parseFromString('<div>' + par_elem.embedCode + '</div>', 'text/html');
                sub_elem = content_new.querySelector('div');
                let iframe = sub_elem.querySelector('iframe[width]');
                if (iframe) {
                  let ratio = iframe.width / (mobile ? 320 : 640);
                  iframe.width = iframe.width / ratio;
                  iframe.height = iframe.height / ratio;
                }
              } else if (par_elem.__typename === 'ImageFile') {
                if (par_elem.origin) {
                  sub_elem = document.createElement('img');
                  sub_elem.src = par_elem.origin;
                  sub_elem.alt = par_elem.alt;
                  if (par_elem.width) {
                    let ratio = par_elem.width / (mobile ? 320 : 640);
                    sub_elem.width = par_elem.width / ratio;
                    sub_elem.height = par_elem.height / ratio;
                  }
                }
              } else if (par_elem.__typename === 'Image') {
                if (par_elem.credit) {
                  sub_elem = document.createElement('p');
                  sub_elem.appendChild(document.createTextNode(par_elem.credit));
                }
              } else if (par_elem.__typename === 'ImageParagraph') {
                if (par_elem.caption) {
                  let content_new = parser.parseFromString('<div>' + par_elem.caption + '</div>', 'text/html');
                  sub_elem = content_new.querySelector('div');
                }
              } else if (!['Article', 'Author', 'Channel', 'LandingPage', 'Query'].includes(par_elem.__typename)) {
                console.log(par_elem);
              }
              if (sub_elem) {
                elem.appendChild(sub_elem);
                article.appendChild(elem);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let ads = 'div.ad-wrapper, div[id^="apn-ad-slot-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('boersen-zeitung.de')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('storefront-section#paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url = window.location.href;
      replaceDomElementExt(url, false, false, 'article');
    }
  }, 2000);
}

else if (matchDomain('cicero.de')) {
  let url = window.location.href;
  if (!window.location.search.match(/(\?|&)amp/)) {
    let paywall = document.querySelector('.plenigo-paywall');
    if (paywall) {
      removeDOMElement(paywall);
      func_post = function () {
        let related_images = document.querySelectorAll('amp-carousel a > amp-img[src]');
        for (let elem of related_images) {
          let img = document.createElement('img');
          Object.assign(img, {
            src: elem.getAttribute('src'),
            height: elem.getAttribute('height'),
            width: elem.getAttribute('width'),
            alt: elem.getAttribute('alt')
          });
          elem.parentNode.replaceChild(img, elem);
        }
        let img_captions = document.querySelectorAll('div.carousel-caption:empty');
        removeDOMElement(...img_captions);
      }
      let url_amp = url.split('?')[0] + '?amp';
      replaceDomElementExt(url_amp, false, false, '.field-name-field-cc-body');
    }
  } else {
    let teasered_content = document.querySelector('.teasered-content');
    if (teasered_content)
      teasered_content.classList.remove('teasered-content');
    let teasered_content_fader = document.querySelector('.teasered-content-fader');
    let btn_read_more = document.querySelector('.btn--read-more');
    removeDOMElement(teasered_content_fader, btn_read_more);
    let ads = 'amp-ad';
    hideDOMStyle(ads);
  }
  let urban_ad_sign = document.querySelectorAll('.urban-ad-sign');
  removeDOMElement(...urban_ad_sign);
}

else if (matchDomain('faz.net')) {
  if (matchDomain('zeitung.faz.net')) { // legacy
    let paywall_z = document.querySelector('div.c-red-carpet');
    if (paywall_z) {
      removeDOMElement(paywall_z);
      let og_url = document.querySelector('head > meta[property="og:url"][content]');
      if (og_url)
        window.location.href = og_url.content;
      else
        header_nofix('div.article__text');
    }
    let sticky_advt = document.querySelector('div.sticky-advt');
    removeDOMElement(sticky_advt);
  } else {
    let url = window.location.href;
    getArchive(url, 'div.paywall, div.wall__wrapper', '', 'article');
    let ads = 'div.lay-PaySocial, div.iqadtile_wrapper, div.iqdcontainer';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('freitag.de')) {
  let paywall = document.querySelector('aside.qa-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let related = document.querySelector('div.c-teaser-plus-related--paywall');
    if (related)
      related.classList.remove('c-teaser-plus-related--paywall');
    let article = document.querySelector('div.bo-article-text');
    if (article) {
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = breakText_headers(json.articleBody);
          let pars = json_text.split(/\n\n/g);
          if (json_text) {
            article.innerHTML = '';
            for (let par of pars) {
              if (!par.startsWith('Placeholder ')) {
                let par_new = document.createElement('p');
                par_new.innerText = par;
                article.appendChild(par_new);
              }
            }
          }
        }
      } else {
        let hidden_article = document.querySelector('div.o-paywall');
        if (hidden_article) {
          let par_first = true;
          let pars = breakText_headers(hidden_article.innerText).split(/\n\n/g);
          for (let par of pars) {
            let par_new = document.createElement('p');
            let overlap = '';
            if (par_first) {
              let intro = article.querySelectorAll('p');
              let intro_last = intro[intro.length - 1];
              par = par.trim();
              overlap = findOverlap(intro_last.innerText, par);
              if (overlap)
                intro_last.innerText = intro_last.innerText.replace(new RegExp(overlap + '$'), '') + par;
              par_first = false;
            }
            if (!overlap && !par.startsWith('Placeholder ')) {
              par_new.innerText = par;
              article.appendChild(par_new);
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('golem.de')) {
  let url = window.location.href;
  func_post = function () {
    let js_block = 'figure[id]:not([class])';
    hideDOMStyle(js_block);
  }
  getOchToUnlock(url, 'div.paywall-wrapper', '', 'article');
  let ads = 'div[id^="iqadtile"]';
}

else if (matchDomain('handelsblatt.com')) {
  let paywall = document.querySelector('app-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article');
    if (article) {
      let url = window.location.href;
      article.after(googleSearchToolLink(url));
      header_nofix('article', '', 'BPC > refresh page');
    }
  }
  window.localStorage.removeItem('HB.METERING');
  let overlay = document.querySelector('div[id^="sp_message_container_"]');
  removeDOMElement(overlay);
  let noscroll = document.querySelector('html[class]');
  if (noscroll)
    noscroll.removeAttribute('class');
}

else if (matchDomain('heise.de')) {
  func_post = function () {
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      paywall.before(archiveLink(url));
      removeDOMElement(paywall);
    }
  }
  let paywall_sel = 'a-gift:not([has-access])';
  let url = window.location.href;
  getOchToUnlock(url, paywall_sel, '', 'article');
  let ads = 'div.ad-ldb-container, div.inread-cls-reduc';
  hideDOMStyle(ads);
}

else if (matchDomain('jacobin.de')) {
  let paywall = pageContains('h3.m-auto', 'Dieser Artikel ist nur mit Abo zugänglich.');
  if (paywall.length) {
    let slash = document.querySelector('div.slash');
    removeDOMElement(paywall[0].parentNode, slash);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json && json.props.pageProps.sections && json.props.pageProps.sections[1].content) {
          let url_next = json.query.slug;
          if (url_next && !window.location.pathname.includes(url_next))
            refreshCurrentTab();
          let pars = json.props.pageProps.sections[1].content;
          let first_par = document.querySelector('body > div#__next p.bodyText');
          if (first_par) {
            let par_class = first_par.getAttribute('class');
            let article = first_par.parentNode;
            if (article) {
              let add_par = false;
              for (let par of pars) {
                if (!add_par) {
                  if (par.type === 'paywall')
                    add_par = true;
                } else {
                  if (par.text) {
                    let elem_type = 'p';
                    let elem_class = par_class;
                    let elem_style;
                    if (['paragraph', 'quote'].includes(par.type)) {
                      if (par.type === 'quote')
                        elem_style = 'font-size: 36px; font-weight: bold;';
                    } else if (par.type === 'header') {
                      elem_type = 'h2';
                      elem_class = 'content-element font-headline h2 my-1em';
                    }
                    let content = par.text.replace(/&nbsp;/g, '');
                    let parser = new DOMParser();
                    let content_new = parser.parseFromString('<' + elem_type + ' class="' + elem_class + (elem_style ? '" style="' + elem_style : '') + '">' + content + '</' + elem_type + 'p>', 'text/html');
                    article.appendChild(content_new.querySelector(elem_type));
                  } else
                    console.log(par);
                }
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('krautreporter.de')) {
  let paywall = document.querySelector('.js-article-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    window.setTimeout(function () {
      let paywall_divider = document.querySelector('.js-paywall-divider');
      let steady_checkout = document.querySelector('#steady-checkout');
      removeDOMElement(paywall_divider, steady_checkout);
      let blurred = document.querySelectorAll('.blurred');
      for (let elem of blurred)
        elem.classList.remove('blurred', 'json-ld-paywall-marker', 'hidden@print');
    }, 500);
  }
}

else if (matchDomain(['ksta.de', 'rundschau-online.de'])) {
  function unhide_article(node) {
    removeDOMElement(node);
    let article = document.querySelector('div[data-article-content][style]');
    if (article)
      article.removeAttribute('style');
  }
  waitDOMElement('div[data-type="paywall"]', 'DIV', unhide_article, true);
  let banners = 'div.dm-slot, div.dm-zephr-banner';
  hideDOMStyle(banners);
}

else if (matchDomain('kurier.at')) {
  let paywall = document.querySelector('div#cfs-paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let div_hidden = document.querySelector('div.paywall');
    if (div_hidden) {
      div_hidden.classList.remove('paywall');
      div_hidden.removeAttribute('style');
    }
  }
  let ads = 'div[data-ad], div[data-outbrain]';
  hideDOMStyle(ads);
}

else if (matchDomain('motorradonline.de')) {
  if (window.location.pathname.endsWith('/amp/'))
    ampToHtml();
}

else if (matchDomain('nw.de')) {
  let paywall = document.querySelector('div#paywall');
  if (paywall) {
    paywall.removeAttribute('id');
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = parseHtmlEntities(json.articleBody.replace(/\n/g, '\n\n').replace(/\.responsive[-@%{}()\.:;\w\s]+}\s?}/g, ''));
        let article = paywall.querySelector('div[class*="paywall-overlay"]');
        if (json_text && article)
          article.innerText = json_text;
      }
    }
  }
}

else if (matchDomain('nwzonline.de')) {
  let ads = 'div.adslot';
  hideDOMStyle(ads);
}

else if (matchDomain(['nzz.ch', 'themarket.ch'])) {
  let fade = document.querySelectorAll('.nzzinteraction');
  for (let elem of fade)
    elem.classList.remove('nzzinteraction');
  let ads = 'div.resor';
  hideDOMStyle(ads);
}

else if (matchDomain('philomag.de')) {
  let paywall = document.querySelector('div[id^="block-paywall"]');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articlebody.replace(/%paywall%/g, '').replace(/(\\r)?\\n/g, '<br><br>');
        let content = document.querySelector('div.content-center > div.description');
        if (json_text && content) {
          content.innerHTML = '';
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          content.appendChild(article_new);
        }
      }
    }
  }
}

else if (matchDomain('profil.at')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
    paywall.removeAttribute('style');
    let fade = 'div#cfs-paywall-container';
    hideDOMStyle(fade);
  }
  let overlay = 'div.consentOverlay';
  hideDOMStyle(overlay, 2);
}

else if (matchDomain('schweizermonat.ch')) {
  getJsonUrl('div.entry-paywall-login', '', 'div.entry-main > div.entry__post-content');
}

else if (matchDomain('spektrum.de')) {
  let paywall = document.querySelector('article.pw-premium');
  if (paywall)
    paywall.classList.remove('pw-premium');
}

else if (matchDomain(['spiegel.de', 'manager-magazin.de'])) {
  let url = window.location.href;
  func_post = function () {
    let failed_iframes = document.querySelectorAll('div > div[x-show="!iframeIsLoaded"]');
    for (let elem of failed_iframes)
      hideDOMElement(elem.parentNode);
    let body_dark = document.querySelector('body[class*="dark:"]');
    if (body_dark)
      removeClassesByPrefix(body_dark, 'dark:');
    let charts = document.querySelectorAll('section div[x-data*="{isLoaded:"]');
    for (let elem of charts)
      elem.style.height = elem.offsetHeight + 'px';
    if (mobile) {
      let lazy_images = document.querySelectorAll('picture img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    let article = document.querySelector('article');
    if (article) {
      let paywall_sel = 'svg[id*="-plus-paywall-"]';
      let paywall = document.querySelector(paywall_sel);
      if (paywall) {
        if (matchDomain('spiegel.de')) {
          let archive_link = document.querySelector('div#bpc_archive > a:not([href*="/again?"])');
          if (archive_link)
            removeDOMElement(archive_link.parentNode);
          article.firstChild.before(ochToUnlockLink(url));
        } else
          header_nofix('article', paywall_sel, 'BPC > no archive-fix');
      } else {
        let hidden_media = document.querySelector('svelte-scroller-outer');
        if (hidden_media)
          article.firstChild.before(document.createTextNode('For hidden media:'), ochToUnlockLink(url));
      }
    }
  }
  getArchive(url, 'div[data-area="paywall"]', '', 'article');
}

else if (matchDomain('springermedizin.de')) {
  let paywall = document.querySelector('div#pay-wall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let article = document.querySelector('div > p.intro--paragraph');
        if (json_text && article) {
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          article.parentNode.replaceChild(article_new, article);
        }
      }
    }
  }
}

else if (matchDomain('stern.de')) {
  func_post = function () {
    header_nofix(article_sel + ' p', paywall_sel, 'BPC > no external site-fix');
  }
  let paywall_sel = 'div.paid-barrier';
  let article_sel = 'div.article__body';
  let url = window.location.href;
  getOchToUnlock(url, paywall_sel, '', article_sel);
}

else if (matchDomain('sueddeutsche.de')) {
  let url = window.location.href;
  if (matchDomain('sz-magazin.sueddeutsche.de')) {
    func_post = function () {
      let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
      for (let hidden_image of hidden_images)
        hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    }
    getOchToUnlock(url, 'p.paragraph--reduced', {rm_class: 'paragraph--reduced'}, 'main');
  } else if (window.location.pathname.startsWith('/projekte/artikel/')) {
    func_post = function () {
      let par = document.querySelector('div.publishdate');
      if (par) {
        let lazy_images = document.querySelectorAll('img[loading]');
        for (let elem of lazy_images) {
          if (elem.width) {
            let ratio = elem.width / (par.offsetWidth);
            elem.style = 'width: ' + elem.width / ratio + 'px; height: ' + elem.height / ratio + 'px; margin: 20px;';
          }
        }
      }
      if (intro) {
        let intro_old = document.querySelector(intro_sel);
        if (intro_old && intro_old.parentNode)
          intro_old.parentNode.replaceChild(intro, intro_old);
      }
      let paywalled_slide = document.querySelectorAll('div.paywalled-slide');
      for (let elem of paywalled_slide)
        elem.removeAttribute('class');
    }
    let intro_sel = 'section#module-0';
    let intro = document.querySelector(intro_sel);
    getOchToUnlock(url, 'div.offer-page', '', 'main');
  } else {
    getOchToUnlock(url, 'head > meta[content="locked"]', '', 'div[itemprop="articleBody"]');
  }
  let ads = 'er-ad-slot, div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('suedkurier.de')) {
  let url = window.location.href;
  getArchive(url, 'aside.article-paywall', '', 'main > article');
}

else if (matchDomain('tagesspiegel.de')) {
  let paywall_sel = 'div#paywall';
  let url = window.location.href;
  if (matchDomain('www.tagesspiegel.de')) {
    func_post = function () {
      let opinionary = document.querySelector('div > div#opinary-automation-placeholder');
      hideDOMElement(opinionary.parentNode);
      if (mobile) {
        let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
        for (let elem of lazy_images)
          elem.style = 'width: 95%;';
      }
    }
    getArchive(url, paywall_sel, '', 'div#story-elements');
  } else if (matchDomain('interaktiv.tagesspiegel.de')) {
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('div.tslr-article > p');
      if (article)
        article.firstChild.before(archiveLink(url));
    }
  }
  let ads = 'div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('tt.com')) {
  let paywall = document.querySelector('div#piano-logwall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div[data-io-article-url]');
    if (article) {
      let json_script = document.querySelector('script#tt-com-www-state');
      if (json_script) {
        try {
          let json_articles = JSON.parse(json_script.text).TT_COM_WWW_GLOBAL_STATE.articles;
          let json_article_id = json_articles.ids[0];
          if (!json_article_id || (json_article_id && !window.location.pathname.includes(json_article_id)))
            refreshCurrentTab();
          let parser = new DOMParser();
          let pars = json_articles.entities[json_article_id].articleData.article.elements;
          for (let par of pars) {
            let elem;
            if (['body', 'subheadline1'].includes(par.type)) {
              if (par.content) {
                let doc = parser.parseFromString('<p>' + par.content + '</p>', 'text/html');
                elem = doc.querySelector('p');
                if (par.type === 'subheadline1')
                  elem.style = 'font-weight: bold;';
              }
            } else if (par.type = 'x-im/content-part') {
              if (par.elements) {
                elem = document.createElement('p');
                for (let item of par.elements) {
                  if (item.content) {
                    let sub_elem = document.createElement('p');
                    sub_elem.innerText = parseHtmlEntities(item.content);
                    elem.appendChild(sub_elem);
                  }
                }
              }
            } else if (par.type.match(/^x-im\//)) {
              if (par.url) {
                if (par.url.startsWith('https://twitter.com/')) {
                  elem = document.createElement('p');
                  let sub_elem = document.createElement('a');
                  sub_elem.href = elem.innerText = par.url;
                  sub_elem.target = '_blank';
                  elem.appendChild(sub_elem);
                } else {
                  elem = document.createElement('iframe');
                  elem.src = par.url;
                  elem.style = 'height: ' + article.offsetWidth + 'px; width: ' + article.offsetWidth + 'px;';
                }
              }
            }
            if (elem)
              article.appendChild(elem);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  let ads = 'div[class*="ads-container"], div.adblock-warning';
  hideDOMStyle(ads);
}

else if (matchDomain('vn.at')) {
  if (window.location.href.match(/\.vn\.at\/.+\/\d{4}\//)) {
    let paywall = document.querySelector('div.paywalled-content');
    if (paywall) {
      let par = paywall.querySelector('p');
      if (!par) {
        refreshCurrentTab();
      } else {
        let lazy_images = document.querySelectorAll('img[src^="data:image/"][lazy-src]');
        for (let elem of lazy_images) {
          elem.src = elem.getAttribute('lazy-src');
        }
      }
    } else
      refreshCurrentTab();
  }
}

else if (matchDomain('vol.at')) {
  if (!window.location.pathname.match(/\/amp\/?$/)) {
    window.setTimeout(function () {
      let paywall = document.querySelector('div.vodl-region-article__premium-content');
      if (paywall) {
        paywall.removeAttribute('class');
        if (!paywall.hasChildNodes()) {
          let json_script = document.querySelector('script#externalPostDataNode');
          if (json_script) {
            try {
              let json = JSON.parse(json_script.text);
              let json_text = json.content.data.post.content;
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div class="entry-content">' + json_text + '</div>', 'text/html');
              let article_new = doc.querySelector('div');
              let hidden_images = article_new.querySelectorAll('img[src^="/"][srcset]');
              let json_domain = json.content.data.post.thumbnail.src.match(/https:\/\/(www\.)?\w+\.at/)[0];
              for (let elem of hidden_images) {
                elem.src = elem.src.replace('https://www.vol.at', json_domain);
                elem.removeAttribute('srcset');
              }
              let hidden_comments = document.querySelector('div[class*="backdrop-blur"]');
              if (hidden_comments)
                hidden_comments.removeAttribute('class');
              let article = document.querySelector('div.article-body');
              if (article) {
                article.innerHTML = '';
                article.appendChild(article_new);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }, 500);
    let ads = 'div[id^="rm-adslot-"], div[id^="piano_rec"]';
    hideDOMStyle(ads);
  } else
    ampToHtml();
}

else if (matchDomain('welt.de')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('picture img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    header_nofix('main header', 'img[alt="WELTplus"][loading]', 'BPC > no archive-fix');
    let ads = pageContains('span', 'Anzeige');
    removeDOMElement(...ads);
  }
  let url = window.location.href;
  getArchive(url, 'div.contains_walled_content, div.c-article-paywall', '', 'main');
  let ads = 'div[data-component="Outbrain"], div[class*="c-ad"]';
  hideDOMStyle(ads);
}

else if (matchDomain('weltkunst.de')) {
  let paywall = document.querySelector('section.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
    if (json_url_dom) {
      let json_url = json_url_dom.href;
      fetch(json_url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.content.rendered;
            let content = document.querySelector('div.article div.text');
            if (json_text) {
              if (content) {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
                let content_new = doc.querySelector('div');
                content.innerHTML = '';
                content.appendChild(content_new);
              }
            } else
              header_nofix(content);
          });
        }
      });
    }
  }
  let par_initial = document.querySelector('p.initial');
  removeDOMElement(par_initial);
}

else if (matchDomain('weser-kurier.de')) {
  let ads = 'div.ad-wrapper, div.anyad';
  hideDOMStyle(ads);
}

else if (matchDomain('wiwo.de')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('article img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    if (paywall) {
      removeDOMElement(paywall);
      let archive_link = document.querySelector('div#bpc_archive > a:not([href*="/again?"])');
      if (archive_link)
        removeDOMElement(archive_link.parentNode);
      let article = document.querySelector(article_sel);
      if (article)
        article.before(googleSearchToolLink(url));
    }
  }
  let paywall_sel = 'app-paywall';
  let article_sel = 'article';
  let url = window.location.href;
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    getArchive(url, paywall_sel, '', article_sel);
    waitDOMElement(paywall_sel, paywall_sel.toUpperCase(), node => getArchive(url, paywall_sel, '', article_sel), true);
  }
  if (!mobile) {
    let banner = 'div.c-overscroller';
    hideDOMStyle(banner, 5);
  }
  let ads = 'div.iqadtile';
  hideDOMStyle(ads);
}

else if (matchDomain('zeit.de')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
      let span_empty = document.querySelectorAll('span:empty');
      removeDOMElement(...span_empty);
    }
    let ads = document.querySelectorAll('div[style*=";min-height:"] > div[id^="iqadtile"]');
    for (let ad of ads)
      hideDOMElement(ad.parentNode);
  }
  let url = window.location.href.split(/[#\?]/)[0];
  if (document.querySelector('head > link[rel="next"]'))
    url += '/komplettansicht';
  getArchive(url, 'aside#paywall', '', 'article', '', 'article', 'article > div');
  let ads = 'div[id^="iqadtile"]';
  hideDOMStyle(ads);
}

else if (matchDomain(de_funke_medien_domains)) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('picture img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    header_nofix(article_sel, paywall_sel, 'BPC > no archive-fix');
  }
  let paywall_sel = 'div#paywall-container';
  let article_sel = 'article';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel);
  let ads = 'aside.ad-slot-wrapper';
  hideDOMStyle(ads);
}

else if (matchDomain(de_lv_domains)) {
  let paywall = document.querySelector('div[id^="paymentprocess-"]');
  if (paywall) {
    let intro = document.querySelector('div.m-paywall__textFadeOut');
    removeDOMElement(paywall, intro);
    let div_hidden = document.querySelector('div.paywall-full-content[style]');
    if (div_hidden) {
      div_hidden.removeAttribute('class');
      div_hidden.removeAttribute('style');
    }
  }
  let ads = 'div.adZone';
  hideDOMStyle(ads);
}

else if (matchDomain(de_motor_presse_domains)) {
  let ads = 'div#ads-container, div.va-sponsored, div.mps_markAd';
  hideDOMStyle(ads);
}

else if (matchDomain(de_rp_medien_domains)) {
  func_post = function () {
    let videos = 'glomex-player';
    hideDOMStyle(videos, 5);
  }
  let url = window.location.href;
  getArchive(url, 'div.park-paywall-content', '', 'article');
  let ads = 'div.portal-slot';
  hideDOMStyle(ads);
}

else if (matchDomain(de_madsack_domains) || document.querySelector('head > link[href*=".rndtech.de/"]')) {
  if (!window.location.search.startsWith('?outputType=valid_amp')) {
    let ads = 'div[class^="Adstyled__AdWrapper"]';
    hideDOMStyle(ads);
  } else {
    ampToHtml();
  }
}

else if (matchDomain('ovb-online.de') || matchDomain(['bgland24.de', 'chiemgau24.de', 'innsalzach24.de', 'mangfall24.de', 'rosenheim24.de', 'wasserburg24.de'])) {
  let ads = 'div.id-TBeepSlot, div[data-id-advertdfpconf]';
  hideDOMStyle(ads);
}

else if (matchDomain('ruhrnachrichten.de') || document.querySelector('a.mgw-logo[href^="https://mgw.de"]')) {
  let pathname = window.location.pathname;
  let article_id;
  if (pathname.includes('-p-'))
    article_id = pathname.split('-p-')[1].split('/')[0];
  getJsonUrl('body.is_plus_article', {rm_class: 'is_plus_article'}, 'article', {art_append: 1, art_hold: 1, art_class: 'article__content'}, article_id);
  if (!matchDomain('ruhrnachrichten.de')) {
    window.setTimeout(function () {
      let push = document.querySelector('div.cleverpush-bell');
      removeDOMElement(push);
    }, 1000);
  }
}

}, 1000);

// General Functions

function matchDomain(domains, hostname) {
  var matched_domain = false;
  if (!hostname)
    hostname = window.location.hostname;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function urlHost(url) {
  if (/^http/.test(url)) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.log(`url not valid: ${url} error: ${e}`);
    }
  }
  return url;
}

function matchUrlDomain(domains, url) {
  return matchDomain(domains, urlHost(url));
}

function setCookie(name, value, domain, path, days, localstorage_hold = false) {
  var max_age = days * 24 * 60 * 60;
  document.cookie = name + "=" + (value || "") + "; domain=" + domain + "; path=" + path + "; max-age=" + max_age;
  if (!localstorage_hold)
    window.localStorage.clear();
}

function removeDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.remove();
  }
}

function hideDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.style = 'display:none !important;';
  }
}

function hideDOMStyle(selector, id = 1) {
  let style = document.querySelector('head > style#ext'+ id);
  if (!style && document.head) {
    let sheet = document.createElement('style');
    sheet.id = 'ext' + id;
    sheet.innerText = selector + ' {display: none !important;}';
    document.head.appendChild(sheet);
  }
}

function clearPaywall(paywall, paywall_action) {
  if (paywall) {
    if (!paywall_action)
      removeDOMElement(...paywall);
    else {
      for (let elem of paywall) {
        if (paywall_action.rm_class)
          elem.classList.remove(paywall_action.rm_class);
        else if (paywall_action.rm_attrib)
          elem.removeAttribute(paywall_action.rm_attrib);
      }
    }
  }
}

function makeFigure(url, caption_text, img_attrib = {}, caption_attrib = {}) {
  let elem = document.createElement('figure');
  let img = document.createElement('img');
  img.src = url;
  for (let attrib in img_attrib)
    if (img_attrib[attrib])
      img.setAttribute(attrib, img_attrib[attrib]);
  elem.appendChild(img);
  if (caption_text) {
    let caption = document.createElement('figcaption');
    for (let attrib in caption_attrib)
      if (caption_attrib[attrib])
        caption.setAttribute(attrib, caption_attrib[attrib]);
    let cap_par = document.createElement('p');
    cap_par.innerText = caption_text;
    caption.appendChild(cap_par);
    elem.appendChild(caption);
  }
  return elem;
}

function header_nofix(header, cond_sel = '', msg = 'BPC > no fix') {
  if (header && typeof header === 'string')
    header = document.querySelector(header);
  if (header && !document.querySelector('div#bpc_nofix')) {
    if (cond_sel) {
      let elem = document.querySelectorAll(cond_sel);
      if (elem.length)
        removeDOMElement(...elem);
      else
        return false;
    }
    let nofix_div = document.createElement('div');
    nofix_div.id = 'bpc_nofix';
    nofix_div.style = 'margin: 20px; font-size: 20px; font-weight: bold; color: red;';
    nofix_div.innerText = msg;
    header.before(nofix_div);
  }
}

function waitDOMElement(selector, tagName = '', callback, multiple = false) {
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!tagName || (node.tagName === tagName)) {
          if (node.matches(selector)) {
            callback(node);
            if (!multiple)
              this.disconnect();
          }
        }
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
}

function waitDOMAttribute(selector, tagName = '', attributeName = '', callback, multiple = false) {
  let targetNode = document.querySelector(selector);
  if (!targetNode)
    return;
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.target.attributes[attributeName]) {
        callback(mutation.target);
        if (!multiple)
          this.disconnect();
      }
    }
  }).observe(targetNode, {
    attributes: true,
    attributeFilter: [attributeName]
  });
}

function getSelectorLevel(selector) {
  if (selector.replace(/,\s+/g, ',').match(/[>\s]+/))
    selector = selector.replace(/,\s+/g, ',').split(',').map(x => x.match(/[>\s]+/) ? x + ', ' + x.split(/[>\s]+/).pop() : x).join(', ');
  return selector;
}

function getArticleSrc(url, url_src, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let url_fetch = url_src || url;
  GM.xmlHttpRequest({
    method: "GET",
    url: url_fetch,
    onload: function (response) {
      let html = response.responseText;
      if (proxy && base64) {
        html = decode_utf8(atob(html));
        selector_source = 'body';
      }
      let recursive;
      if (url.startsWith('https://archive.')) {
        if (url_fetch.includes('/https')) {
          if (html.includes('<div class="TEXT-BLOCK"')) {
            url_src = html.split('<div class="TEXT-BLOCK"')[1].split('</div>')[0].split('href="')[1].split('"')[0];
            getArticleSrc(url, url_src, proxy, base64, selector, text_fail, selector_source, selector_archive);
            recursive = true;
          } else
            html = '';
        }
      }
      if (!recursive)
        replaceDomElementExtSrc(url, url_src, html, proxy, base64, selector, text_fail, selector_source, selector_archive);
    }
  });
}

function getOchToUnlock(url, paywall_sel, paywall_action = '', selector, selector_source = selector) {
  let url_unlock = 'https://och.to/unlock/' + url.split(/[#\?]/)[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
    clearPaywall(paywall, paywall_action);
    replaceDomElementExt(url_unlock, true, false, selector, '', selector_source);
  }
}

function replaceDomElementExt(url, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let article = document.querySelector(selector);
  if (!article)
    return;
  if (proxy) {
    if (!text_fail) {
      if (url.startsWith('https://archive.'))
        text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n';
      else if (!matchUrlDomain(window.location.hostname, url))
        text_fail = 'BPC > failed to load from external site:\r\n';
    }
    getArticleSrc(url, '', proxy, base64, selector, text_fail, selector_source, selector_archive);
  } else {
    let options = {};
    fetch(url, options)
    .then(response => {
      let article = document.querySelector(selector);
      if (response.ok) {
        response.text().then(html => {
          replaceDomElementExtSrc(url, '', html, false, base64, selector, text_fail, selector_source);
        });
      } else {
        replaceTextFail(url, article, proxy, text_fail);
      }
    }).catch(function (err) {
      false;
    });
  }
}

var selector_level = false;
function replaceDomElementExtSrc(url, url_src, html, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let article = document.querySelector(selector);
  let article_link = document.querySelector(selector_archive);
  let no_content_msg = '&nbsp;| no article content found! | :';
  if (html) {
    if (!proxy && base64) {
      html = decode_utf8(atob(html));
      selector_source = 'body';
    }
    let parser = new DOMParser();
    window.setTimeout(function () {
      if (url.startsWith('https://archive.') && url_src) {
        let domain_archive = url.match(/^https:\/\/(archive\.\w{2})/)[1];
        let pathname = new URL(url_src).pathname;
        html = html.replace(new RegExp('https:\\/\\/' + domain_archive.replace('.', '\\.') + '\\/o\\/\\w+\\/', 'g'), '').replace(new RegExp("(src=\"|background-image:url\\(')" + pathname.replace('/', '\\/'), 'g'), "$1" + 'https://' + domain_archive + pathname);
      }
      let doc = parser.parseFromString(html, 'text/html');
      if (selector_level)
        selector_source = getSelectorLevel(selector_source);
      let article_new = doc.querySelector(selector_source);
      if (article_new) {
        if (article && article.parentNode) {
          if (url.startsWith('https://archive.')) {
            let arch_dom = (selector_archive !== selector) ? (article_new.querySelector(selector_archive) || document.querySelector(selector_archive)) : article_new;
            if (arch_dom) {
              if (arch_dom.firstChild)
                arch_dom = arch_dom.firstChild;
              let arch_div = document.createElement('div');
              arch_div.appendChild(archiveLink_renew(url_src));
              arch_div.appendChild(archiveLink(window.location.href, 'BPC > Full article text fetched from (no need to report issue for external site):\r\n'));
              arch_div.style = 'margin: 0px 0px 50px;';
              arch_dom.before(arch_div);
            }
            let targets = article_new.querySelectorAll('a[target="_blank"][href^="' + window.location.origin + '"]');
            for (let elem of targets)
              elem.removeAttribute('target');
            let invalid_links = article_new.querySelectorAll('link[rel*="preload"]:not([href])');
            removeDOMElement(...invalid_links);
          } else if (url.startsWith('https://och.to/unlock/')) {
            let unlock_links = article_new.querySelectorAll('a[href^="/unlock/"]');
            for (let elem of unlock_links)
              elem.href = elem.href.split('/unlock/')[1];
          }
          window.setTimeout(function () {
            if (article.parentNode) {
              article.parentNode.replaceChild(article_new, article);
              if (func_post)
                func_post();
            }
          }, 200);
        }
      } else
        replaceTextFail(url, article_link, proxy, text_fail.replace(':', no_content_msg));
    }, 200);
  } else {
    replaceTextFail(url, article_link, proxy, url_src ? text_fail.replace(':', no_content_msg) : text_fail);
  }
}

function replaceTextFail(url, article, proxy, text_fail) {
  if (text_fail && article) {
    let text_fail_div = document.createElement('div');
    text_fail_div.id = 'bpc_fail';
    text_fail_div.setAttribute('style', 'margin: 0px 50px; font-weight: bold; color: red;');
    text_fail_div.appendChild(document.createTextNode(text_fail));
    if (proxy) {
      if (url.startsWith('https://archive.')) {
        text_fail_div = archiveLink(url.replace(/^https:\/\/archive\.\w{2}\//, ''), text_fail);
      } else {
        let a_link = document.createElement('a');
        a_link.innerText = url;
        a_link.href = url;
        a_link.target = '_blank';
        text_fail_div.appendChild(a_link);
      }
    }
    if (article.firstChild)
      article.firstChild.before(text_fail_div);
    else
      article.appendChild(text_fail_div);
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function archiveRandomDomain() {
  let tld_array = ['fo', 'is', 'li', 'md', 'ph', 'vn'];
  let tld = tld_array[randomInt(6)];
  return 'archive.' + tld;
}

function getArchive(url, paywall_sel, paywall_action = '', selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let url_archive = 'https://' + archiveRandomDomain() + '/' + url.split(/[#\?]/)[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
    clearPaywall(paywall, paywall_action);
    replaceDomElementExt(url_archive, true, false, selector, text_fail, selector_source, selector_archive);
  }
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', archiveRandomDomain()], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function archiveLink_renew(url, text_fail = 'BPC > Only use to renew if text is incomplete or updated:\r\n') {
  return externalLink([new URL(url).hostname], '{url}/again?url=' + window.location.href, url, text_fail);
}

function ochToUnlockLink(url, text_fail = 'BPC > Try for full article content (no need to report issue for external site):\r\n') {
  return externalLink(['och.to'], 'https://{domain}/unlock/{url}', url, text_fail);
}

function googleSearchToolLink(url, text_fail = 'BPC > Try for full article text (test url & copy html (tab) code to [https://codebeautify.org/htmlviewer]):\r\n') {
  return externalLink(['search.google.com'], 'https://search.google.com/test/rich-results?url={url}', encodeURIComponent(url), text_fail);
}

function nftLink(url, text_fail = 'BPC > Full article text:\r\n') {
  return externalLink(['1ft.io'], 'https://{domain}/{url}', url, text_fail);
}

function externalLink(domains, ext_url_templ, url, text_fail = 'BPC > Full article text:\r\n') {
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.setAttribute('style', 'margin: 20px; font-size: 20px; font-weight: bold; color: red;');
  let parser = new DOMParser();
  text_fail = text_fail.replace(/\[(?<url>[^\]]+)\]/g, function (match, url) {
    return "<a href='" + url + "' target='_blank' style='color: red'>" + new URL(url).hostname + "</a>";
  });
  let doc = parser.parseFromString('<span>' + text_fail + '</span>', 'text/html');
  let elem = doc.querySelector('span');
  text_fail_div.appendChild(elem);
  for (let domain of domains) {
    let ext_url = ext_url_templ.replace('{domain}', domain).replace('{url}', url.split('?')[0]);
    let a_link = document.createElement('a');
    a_link.innerText = domain;
    a_link.href = ext_url;
    a_link.target = '_blank';
    text_fail_div.appendChild(document.createTextNode(' | '));
    text_fail_div.appendChild(a_link);
  }
  return text_fail_div;
}

function removeClassesByPrefix(el, prefix) {
  let el_classes = el.classList;
  for (let el_class of el_classes) {
    if (el_class.startsWith(prefix))
      el_classes.remove(el_class);
  }
}

function amp_iframes_replace(weblink = false, source = '') {
  let amp_iframes = document.querySelectorAll('amp-iframe' + (source ? '[src*="' + source + '"]' : ''));
  let par, elem;
  for (let amp_iframe of amp_iframes) {
    if (!weblink) {
      if (amp_iframe.offsetHeight > 10) {
        elem = document.createElement('iframe');
        elem.src = amp_iframe.getAttribute('src').replace(/^http:/, 'https:');
        elem.style = 'height: ' + amp_iframe.offsetHeight + 'px; width: 100%; border: 0px;';
        if (amp_iframe.getAttribute('sandbox'))
          elem.sandbox = amp_iframe.getAttribute('sandbox');
        amp_iframe.parentNode.replaceChild(elem, amp_iframe);
      }
    } else {
      par = document.createElement('p');
      par.style = 'margin: 20px 0px;';
      elem = document.createElement('a');
      elem.innerText = 'Media-link';
      elem.setAttribute('href', amp_iframe.getAttribute('src'));
      elem.setAttribute('target', '_blank');
      par.appendChild(elem);
      amp_iframe.parentNode.replaceChild(par, amp_iframe);
    }
  }
}

function amp_redirect_not_loop(amphtml) {
  let amp_redirect_date = Number(sessionStorage.getItem('###_amp_redirect'));
  if (!(amp_redirect_date && Date.now() - amp_redirect_date < 2000)) {
    sessionStorage.setItem('###_amp_redirect', Date.now());
    window.location.href = amphtml.href;
  } else {
    let header = (document.body && document.body.firstChild) || document.documentElement;
    header_nofix(header, '', 'BPC > redirect to amp failed (disable amp-to-html extension/add-on or browser setting)');
  }
}

function amp_redirect(paywall_sel, paywall_action = '', amp_url = '') {
  let paywall = document.querySelectorAll(paywall_sel);
  let amphtml = document.querySelector('head > link[rel="amphtml"]');
  if (!amphtml && amp_url)
    amphtml = {href: amp_url};
  if (paywall.length && amphtml) {
    clearPaywall(paywall, paywall_action);
    amp_redirect_not_loop(amphtml);
  }
}

function amp_unhide_subscr_section(amp_ads_sel = 'amp-ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let preview = document.querySelectorAll('[subscriptions-section="content-not-granted"]');
  removeDOMElement(...preview);
  let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
  for (let elem of subscr_section)
    elem.removeAttribute('subscriptions-section');
  hideDOMStyle(amp_ads_sel, 5);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function amp_unhide_access_hide(amp_access = '', amp_access_not = '', amp_ads_sel = 'amp-ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let access_hide = document.querySelectorAll('[amp-access' + amp_access + '][amp-access-hide]:not([amp-access="error"], [amp-access^="message"], .piano)');
  for (let elem of access_hide)
    elem.removeAttribute('amp-access-hide');
  if (amp_access_not) {
    let amp_access_not_dom = document.querySelectorAll('[amp-access' + amp_access_not + ']');
    removeDOMElement(...amp_access_not_dom);
  }
  hideDOMStyle(amp_ads_sel, 6);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function breakText(str, headers = false) {
  str = str.replace(/(?:^|[A-Za-z\"\“\)])(\.+|\?|!)(?=[A-ZÖÜ\„\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
  if (headers)
    str = str.replace(/(([a-z]{2,}|[\"\“]))(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
  return str;
}

function breakText_headers(str) {
  str = breakText(str, true);
  // exceptions: names with alternating lower/uppercase (no general fix)
  let str_rep_arr = ['AstraZeneca', 'BaFin', 'BerlHG', 'BfArM', 'BilMoG', 'BioNTech', 'ChatGPT', 'DiGA', 'EuGH', 'FinTechRat', 'GlaxoSmithKline', 'IfSG', 'medRxiv', 'mmHg', 'OpenAI', 'PlosOne', 'StVO', 'TikTok'];
  let str_rep_split;
  let str_rep_src;
  for (let str_rep of str_rep_arr) {
    str_rep_split = str_rep.split(/([a-z]+)(?=[A-Z](?=[A-Za-z]+))/);
    str_rep_src = str_rep_split.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue + ((currentValue !== currentValue.toUpperCase()) ? '\n\n' : '');
      });
    if (str_rep_src.endsWith('\n\n'))
      str_rep_src = str_rep_src.slice(0, -2);
    str = str.replace(new RegExp(str_rep_src, "g"), str_rep);
  }
  str = str.replace(/De\n\n([A-Z])/g, "De$1");
  str = str.replace(/La\n\n([A-Z])/g, "La$1");
  str = str.replace(/Le\n\n([A-Z])/g, "Le$1");
  str = str.replace(/Mc\n\n([A-Z])/g, "Mc$1");
  return str;
}

function parseHtmlEntities(encodedString) {
  let parser = new DOMParser();
  let doc = parser.parseFromString('<textarea>' + encodedString + '</textarea>', 'text/html');
  let dom = doc.querySelector('textarea');
  return dom.value;
}

function encode_utf8(str) {
  return unescape(encodeURIComponent(str));
}

function decode_utf8(str) {
  return decodeURIComponent(escape(str));
}

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('head > link[rel="canonical"][href]');
    if (canonical)
      window.location.href = canonical.href;
  }, 1000);
}

function refreshCurrentTab() {
  window.location.reload(true);
}

function getArticleJsonScript() {
  let scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let json_script;
  for (let script of scripts) {
    if (script.innerText.match(/"(articlebody|text)":/i)) {
      json_script = script;
      break;
    }
  }
  return json_script;
}

function getNestedKeys(obj, key) {
  if (key in obj)
    return obj[key];
  let keys = key.split('.');
  let value = obj;
  for (let i = 0; i < keys.length; i++) {
    value = value[keys[i]];
    if (value === undefined)
      break;
  }
  return value;
}

function getJsonUrlText(article, callback, article_id = '', key = '', url_slash = false) {
  let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
  let json_url;
  if (json_url_dom) {
    json_url = json_url_dom.href;
    if (url_slash)
      json_url = json_url.replace('/wp-json/', '//wp-json/');
  }
  if (!json_url && article_id)
    json_url = window.location.origin + '/wp-json/wp/v2/posts/' + article_id;
  if (json_url) {
    fetch(json_url)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          try {
            let json_text = parseHtmlEntities(!key ? json.content.rendered : getNestedKeys(json, key));
            callback(json_text, article);
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }
}

function getJsonUrlAdd(json_text, article, art_options = {}) {
  let art_type = 'div';
  let art_attrib = '';
  if (Object.keys(art_options).length) {
    if (art_options.art_type)
      art_type = art_options.art_type;
    if (art_options.art_class)
      art_attrib += ' class="' + art_options.art_class + '"';
    if (art_options.art_id)
      art_attrib += ' id="' + art_options.art_id + '"';
    if (art_options.art_style)
      art_attrib += ' style="' + art_options.art_style + '"';
    if (art_options.func_text)
      json_text = art_options.func_text(json_text);
  }
  let parser = new DOMParser();
  let doc = parser.parseFromString('<' + art_type + art_attrib + '>' + json_text + '</' + art_type + '>', 'text/html');
  let article_new = doc.querySelector(art_type);
  if (art_options.art_append || !article.parentNode) {
    if (!art_options.art_hold)
      article.innerHTML = '';
    article.appendChild(article_new);
  } else
    article.parentNode.replaceChild(article_new, article);
  if (func_post)
    func_post();
}

function getJsonUrl(paywall_sel, paywall_action = '', article_sel, art_options = {}, article_id = '', key = '', url_slash = false) {
  let paywall = document.querySelectorAll(paywall_sel);
  let article = document.querySelector(article_sel);
  if (paywall.length && article) {
    clearPaywall(paywall, paywall_action);
    getJsonUrlText(article, (json_text, article) => {
      if (json_text && article)
        getJsonUrlAdd(json_text, article, art_options);
    }, article_id, key, url_slash);
  }
}

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

})();
