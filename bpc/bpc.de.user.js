// ==UserScript==
// @name            Bypass Paywalls Clean - de/at/ch
// @version         4.1.5.0
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
// @connect         funkemedien.de
// @grant           GM.xmlHttpRequest
// @require         https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc_func.js
// ==/UserScript==

(function() {
  //'use strict';

window.setTimeout(function () {

var de_funke_medien_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'harzkurier.de', 'ikz-online.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_ippen_media_domains = ['fr.de', 'merkur.de', 'ovb-online.de'];
var de_lv_domains = ['profi.de', 'wochenblatt.com'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de', 'rnd.de', 'saechsische.de'];
var de_motor_presse_domains = ['aerokurier.de', 'auto-motor-und-sport.de', 'flugrevue.de', 'motorradonline.de', 'womenshealth.de'];
var de_rp_medien_domains = ['ga.de', 'rp-online.de', 'saarbruecker-zeitung.de', 'volksfreund.de'];
var de_vrm_domains = ['allgemeine-zeitung.de', 'echo-online.de', 'wiesbadener-kurier.de'];
var de_vrm_custom_domains = ['buerstaedter-zeitung.de', 'hochheimer-zeitung.de', 'lampertheimer-zeitung.de', 'lauterbacher-anzeiger.de', 'main-spitze.de', 'mittelhessen.de', 'oberhessische-zeitung.de', 'wormser-zeitung.de'];

if (matchDomain('aachener-zeitung.de')) {
  let url = window.location.href;
  getArchive(url, 'div[data-testid="paywall-position-popover"]', '', 'article');
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

else if (matchDomain('bild.de')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
      for (let elem of lazy_images) {
        elem.style = 'width: 95%; margin: 10px;';
        elem.parentNode.removeAttribute('style');
      }
      let header = document.querySelector('article > h2 > span:last-child');
      if (header)
        header.style = 'margin: 10px;';
      let content = document.querySelector('article time ~ div');
      if (content)
        content.style = 'margin: 10px;';
    }
    let div_empty = document.querySelectorAll('div[style]');
    for (let elem of div_empty)
      if (!elem.innerText.length)
        removeDOMElement(elem);
    let article = document.querySelector('main > article');
    if (article && article.innerText.length < 1000)
      header_nofix('h2', '', 'BPC > no archive-fix');
  }
  let url = window.location.href;
  getArchive(url, 'div.offer-module', '', 'article');
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
  let paywall = document.querySelector('section.qa-paywall');
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
    header_nofix('article', paywall_sel, 'BPC > no archive-fix');
    let dark_mode = document.querySelector('html.dark');
    if (dark_mode)
      dark_mode.classList.remove('dark');
  }
  let paywall_sel = cs_param.paywall_sel || 'a-gift:has(div.paywall-delimiter)';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', 'article');
  let ads = 'div.ad-ldb-container, div.inread-cls-reduc, aside.img-ad';
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

else if (domain = matchDomain(['ksta.de', 'rundschau-online.de'])) {
  setCookie('anon_cookie', '', domain, '/', 0);
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

else if (matchDomain('mopo.de')) {
  getJsonUrl('div#paywall', '', 'div.paywall-fade');
}

else if (matchDomain('motorradonline.de')) {
  if (window.location.pathname.endsWith('/amp/'))
    ampToHtml();
}

else if (matchDomain(['noz.de', 'shz.de'])) {
  let url = window.location.href;
  getArchive(url, 'div.paywall', '', 'article');
  let ads = 'div.ad_label';
  hideDOMStyle(ads);
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
    header_nofix('article', 'svg[id*="-plus-paywall-"]', 'BPC > no archive-fix');
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
    header_nofix(link_sel, paywall_sel, 'BPC > no archive-fix');
    if (mobile) {
      let article = document.querySelector(article_src_sel);
      if (article) {
        let lazy_images = article.querySelectorAll('figure > img[loading="lazy"][style]');
        for (let elem of lazy_images) {
          elem.style = 'width: 95%;';
          elem.parentNode.style = 'margin-bottom: 20px';
          let caption = elem.parentNode.querySelector('figcaption');
          if (caption)
            caption.style = 'width: 95%;';
        }
        let article_recs = article.querySelectorAll('article');
        for (let elem of article_recs)
          elem.style = 'width: 95%;';
        let article_opulent = document.querySelector('div.page-opulent__body-inner > div > div');
        if (article_opulent)
          article_opulent.removeAttribute('style');
      }
    }
  }
  let paywall_sel = 'ws-paywall';
  let article_sel = 'div.article__body';
  let article_src_sel = 'main > article > div:last-child';
  let link_sel = 'div.page__content-inner, div.page-opulent__body';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel, '', article_src_sel, link_sel);
}

else if (matchDomain('sueddeutsche.de')) {
  let url = window.location.href;
  if (matchDomain('sz-magazin.sueddeutsche.de')) {
    func_post = function () {
      header_nofix('main', 'div#sz-paywall', 'BPC > no archive-fix');
    }
    getArchive(url, 'div.articlemain__inner--reduced', {rm_class: 'articlemain__inner--reduced'}, 'main');
  } else if (window.location.pathname.startsWith('/projekte/artikel/')) {
    func_post = function () {
      let lazy_images = document.querySelectorAll('img[loading="lazy"][style*="min-width:"]');
      for (let elem of lazy_images)
        elem.style = 'width: 80%; margin: auto;';
      let sticky = document.querySelectorAll('div > div > div[old-position="sticky"]');
      for (let elem of sticky) {
        let div_hidden = elem.parentNode.parentNode.querySelector('div[style^="display:none;"]');
        if (div_hidden)
          div_hidden.removeAttribute('style');
        removeDOMElement(elem.parentNode);
      }
      if (intro) {
        let intro_old = document.querySelector(intro_sel);
        if (intro_old && intro_old.parentNode)
          intro_old.parentNode.replaceChild(intro, intro_old);
      }
      header_nofix('main', 'div#sz-paywall', 'BPC > no archive-fix');
    }
    let intro_sel = 'section#module-0';
    let intro = document.querySelector(intro_sel);
    getArchive(url, 'div.offer-page', '', 'main');
  } else {
    let paywall = document.querySelector('head > meta[content="locked"]');
    if (paywall) {
      removeDOMElement(paywall);
      let article_sel = 'div[itemprop="articleBody"]';
      let article = document.querySelector(article_sel);
      if (article) {
        let json_script = document.querySelector('script[data-hydration-props-component-name="ArticleBodyDDRum"]');
        if (json_script) {
          try {
            let json = JSON.parse(decodeURIComponent(json_script.text));
            if (json) {
              let pars = json.uiArticleContent;
              if (pars.length) {
                article.innerHTML = '';
                addStyle(article_sel + ' p {margin-bottom: 32px;}');
              }
              let parser = new DOMParser();
              for (let par of pars) {
                let elem = document.createElement('p');
                if (['paragraph', 'datawrapper', 'youtube'].includes(par.component)) {
                  if (par.content && par.content.html) {
                    let elem_type = par.content.html.startsWith('<div>') ? 'div' : 'p';
                    let content_new = parser.parseFromString('<' + elem_type + '>' + parseHtmlEntities(par.content.html) + '</' + elem_type + '>', 'text/html');
                    let iframe = content_new.querySelector('iframe');
                    if (iframe)
                      iframe.style = 'width: 100%; height: 400px; margin-bottom: 32px;';
                    elem = content_new.querySelector(elem_type);
                  }
                } else if (par.component === 'subheading') {
                  if (par.content && par.content.text) {
                    elem.innerText = par.content.text;
                    elem.style = 'font-weight: bold;';
                  }
                } else if (par.component === 'image') {
                  if (par.content && par.content.image) {
                    let caption = par.content.caption ? par.content.caption.html + ' (Foto: ' + par.content.imageSource + ')' : '';
                    let sub_elem = makeFigure(par.content.image.url, caption);
                    elem.appendChild(sub_elem);
                  }
                } else if (!(['articleHeader', 'articleTeaserM', 'newsletterEmbed'].includes(par.component) || par.component.startsWith('iqadtile')))
                  console.log(par);
                if (elem.hasChildNodes())
                  article.appendChild(elem);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
  let ads = 'er-ad-slot, div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('suedkurier.de')) {
  let url = window.location.href;
  getArchive(url, 'aside.article-paywall', '', 'main > article');
}

else if (matchDomain('t3n.de')) {
  let paywall = document.querySelector('div.c-paywall__wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        if (json_text.includes('[embed]'))
          json_text = json_text.replace(/\[embed\]([^\[]+)\[\/embed\]/g, '$1\n');
        json_text = json_text.replace(/\[[^\]]+\]/g, '');
        let article = document.querySelector('div.paywall-blur > p');
        if (json_text && article) {
          article.innerText = parseHtmlEntities(json_text);
          article.parentNode.removeAttribute('class');
        }
      }
    }
  }
}

else if (matchDomain('tagesspiegel.de')) {
  let paywall_sel = 'div#paywall';
  let url = window.location.href;
  if (matchDomain('www.tagesspiegel.de')) {
    func_post = function () {
      let opinionary = document.querySelector('div > div#opinary-automation-placeholder');
      if (opinionary)
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
                    let doc = parser.parseFromString('<p>' + item.content + '</p>', 'text/html');
                    sub_elem = doc.querySelector('p');
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

else if (matchDomain('welt.de')) {
  func_post = function () {
    if (mobile) {
      let headers = document.querySelectorAll('main header, main header ~ div');
      for (let elem of headers)
        elem.removeAttribute('style');
      let main_divs = document.querySelectorAll('main div[style] > div > div[id]');
      for (let elem of main_divs) {
        if (elem.querySelector('img'))
          elem.parentNode.parentNode.removeAttribute('style');
      }
      let lazy_images = document.querySelectorAll('main img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    header_nofix('main header', 'img[alt="WELTplus"][loading]', 'BPC > no archive-fix');
    let ads = pageContains('span', 'Anzeige');
    removeDOMElement(...ads);
  }
  let url = window.location.href;
  getArchive(url, 'div.contains_walled_content, div.c-article-paywall', '', 'main header + div');
  let ads = 'div[data-component="Outbrain"], div[class*="c-ad"]';
  hideDOMStyle(ads);
}

else if (matchDomain('weser-kurier.de')) {
  let ads = 'div.ad-wrapper, div.anyad, div.msn-ads';
  hideDOMStyle(ads);
}

else if (matchDomain('zeit.de')) {
  let header_sel = 'article > header';
  let header = document.querySelector(header_sel);
  func_post = function () {
    if (header) {
      let header_new = document.querySelector(header_sel);
      if (header_new)
        header_new.parentNode.replaceChild(header, header_new);
    }
    let comments_link = document.querySelector('div[style*="align-items"] a[href$="#comments"]');
    if (comments_link)
      comments_link.href = '#comments';
    if (mobile) {
      let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
      let span_empty = document.querySelectorAll('span:empty');
      removeDOMElement(...span_empty);
    }
    let ads = 'div[style*=";min-height:"]:has( > div[id^="iqadtile"])';
    hideDOMStyle(ads, 2);
  }
  let url = window.location.href.split(/[#\?]/)[0];
  if (document.querySelector('head > link[rel="next"]'))
    url += '/komplettansicht';
  getArchive(url, 'aside#paywall', '', 'main', '', 'main', 'article > div');
  let ads = 'div[id^="iqadtile"], .iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain(de_funke_medien_domains)) {
  let paywall = document.querySelector('div#paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let spark_script = document.querySelector('script#__SPARK__');
    if (spark_script) {
      let match = spark_script.text.match(/PUBLICATION:\s?'([\w-]+)',/);
      if (match) {
        func_post = function () {
          document.querySelectorAll('div[data-carousel-id-slider]').forEach(x => x.removeAttribute('class'));
          let embed_templates = document.querySelectorAll('div[data-embed-id] > template[data-embedbox-id-embed-template]');
          for (let elem of embed_templates) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(elem.innerHTML, dompurify_options) + '</div>', 'text/html');
            let blockquote = doc.querySelector('div');
            elem.parentNode.before(blockquote);
            removeDOMElement(elem.parentNode);
          }
          let charts = document.querySelectorAll('aside > div[id^="datawrapper-vis-"]');
          for (let elem of charts) {
            let img = elem.querySelector('noscript > img[src]');
            if (img) {
              elem.parentNode.before(img);
              removeDOMElement(elem.parentNode);
            }
          }
        }
        let spark_domain = match[1];
        let url_src = 'https://app-webview.sparknews.funkemedien.de/' + spark_domain + window.location.pathname;
        fetch_headers = {"Authorization": "Basic YXBpOkNTeGxxRG1YM2xCTmRsS1l6allRcWZqTnFZMkhQVUVm"};
        replaceDomElementExt(url_src, true, false, 'div.article-body', 'BPC > no fix (source file)');
      }
    }
  }
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
    header_nofix('article', 'div#park-paywall', 'BPC > no archive-fix');
    let videos = 'glomex-player';
    hideDOMStyle(videos, 5);
  }
  let url = window.location.href;
  getArchive(url, 'div.park-paywall-content', '', 'article');
  let ads = 'div.portal-slot';
  hideDOMStyle(ads);
}

else if (matchDomain(de_madsack_domains) || document.querySelector('head > link[href*=".rndtech.de/"]')) {
  if (!window.location.search.includes('outputType=valid_amp')) {
    let ads = 'div[class^="Adstyled__AdWrapper"]';
    hideDOMStyle(ads);
  } else {
    ampToHtml();
  }
}

else if (matchDomain(de_ippen_media_domains) || document.querySelector('header a[href^="https://www.ippen.media"]')) {
  let ads = 'div[class^="id-TBeepSlot-"], div[data-id-advertdfpconf]';
  hideDOMStyle(ads);
}

else if (matchDomain(de_vrm_domains) || matchDomain(de_vrm_custom_domains)) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      article.querySelectorAll('div > div[role="button"]').forEach(e => removeDOMElement(e.parentNode));
      if (mobile) {
        let pictures = document.querySelectorAll('picture > img[style]');
        for (let elem of pictures) {
          elem.style = 'width: 95%; margin: 10px;';
          elem.parentNode.removeAttribute('style');
        }
      }
    }
  }
  let article_sel = 'article section';
  let url = window.location.href;
  window.setTimeout(function () {
    getArchive(url, 'div[data-testid="paywall-blurred-content"]', {rm_attrib: 'class'}, article_sel);
  }, 1000);
  let ads = 'div.adSlot, div.loadingBanner';
  hideDOMStyle(ads);
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

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

})();
