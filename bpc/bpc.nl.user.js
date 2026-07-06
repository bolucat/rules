// ==UserScript==
// @name            Bypass Paywalls Clean - nl/be
// @version         4.3.9.1
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.nl.user.js
// @updateURL       https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.nl.user.js
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.nl/*
// @match           *://*.businessam.be/*
// @match           *://*.demorgen.be/*
// @match           *://*.doorbraak.be/*
// @match           *://*.gva.be/*
// @match           *://*.hbvl.be/*
// @match           *://*.hln.be/*
// @match           *://*.humo.be/*
// @match           *://*.nieuwsblad.be/*
// @match           *://*.projectcargojournal.com/*
// @match           *://*.railfreight.cn/*
// @match           *://*.railfreight.com/*
// @match           *://*.railtech.be/*
// @match           *://*.railtech.com/*
// @match           *://*.standaard.be/*
// @match           *://*.taxipro.be/*
// @match           *://*.tijd.be/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         mediafin.be
// @grant           GM.xmlHttpRequest
// @require         https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc_func.js
// ==/UserScript==

(function() {
  //'use strict';

window.setTimeout(function () {

var be_mediahuis_domains = ['gva.be', 'hbvl.be', 'nieuwsblad.be', 'standaard.be'];
var nl_dpg_adr_domains = ['ad.nl', 'bd.nl', 'bndestem.nl', 'destentor.nl', 'ed.nl', 'gelderlander.nl', 'pzc.nl', 'tubantia.nl'];
var nl_dpg_media_domains = ['demorgen.be', 'flair.nl', 'humo.be', 'libelle.nl', 'margriet.nl', 'parool.nl', 'trouw.nl', 'volkskrant.nl'];

if (matchDomain('adformatie.nl')) {
  document.querySelectorAll('iframe[uc-src]').forEach(e => e.src = e.getAttribute('uc-src'));
  let ads = 'div.c-ad-slot';
  hideDOMStyle(ads);
}

else if (matchDomain(be_mediahuis_domains)) {
  window.setTimeout(function () {
    let video = document.querySelector('div.video, div[data-testid="article-video"]');
    func_post = function () {
      let article = document.querySelector(article_sel);
      if (article) {
        if (video) {
          if (matchDomain(['gva.be', 'nieuwsblad.be'])) {
            let placeholder = video.querySelector('div[class^="Placeholder_placeholder"]');
            if (placeholder)
              placeholder.removeAttribute('class');
          }
          let video_new = article.querySelector('div[id$="-streamone"], div[id^="video-player-"], div[id^="player_"]');
          if (video_new && video_new.parentNode)
            video_new.parentNode.replaceChild(video, video_new);
          else {
            let header = article.querySelector('h1');
            let br = document.createElement('br');
            if (header)
              header.after(br, video, br);
          }
        }
        let gallery, img_width, captions, next, next_images, next_img_width;
        let gallery_new = document.createElement('div');
        let figure_nr = 0;
        let gallery_figures = document.querySelectorAll('div > ul > li > figure');
        for (let figure of gallery_figures) {
          if (!figure_nr) {
            gallery = figure.parentNode.parentNode.parentNode;
            captions = Array.from(gallery.querySelectorAll('span')).filter(e => e.innerText.includes('©'));
            next = gallery.nextSibling;
            if (next)
              next_images = next.querySelectorAll('img[currentsourceurl]');
          }
          let img = figure.querySelector('img[currentsourceurl]');
          if (img && next_images) {
            let img_src = img.getAttribute('currentsourceurl');
            if (img_src) {
              if (img_src.includes('/alternates/'))
                img_width = img_src.split('/alternates/')[1].split('/')[0];
            } else if (img_width && next_images[figure_nr]) {
              img_src = next_images[figure_nr].getAttribute('currentsourceurl');
              if (img_src && img_src.includes('/alternates/')) {
                next_img_width = img_src.split('/alternates/')[1].split('/')[0];
                img_src = img_src.replace(next_img_width, img_width);
              }
            }
            let figure_new = makeFigure(img_src, captions && captions[figure_nr] ? captions[figure_nr].parentNode.innerText : '', {style: 'height: 500px;'});
            figure_new.style = 'margin: 20px 0px;';
            gallery_new.appendChild(figure_new);
          }
          figure_nr++;
        }
        if (gallery && next) {
          next.after(gallery_new);
          removeDOMElement(gallery, next);
        }
        let errors = document.querySelectorAll('div[height][old-src]:not([src]):has(div#__next_error__)');
        for (let elem of errors) {
          let iframe = document.createElement('iframe');
          iframe.src = elem.getAttribute('old-src');
          iframe.style = 'width: 100%; height: ' + elem.getAttribute('height') + 'px;';
          elem.parentNode.replaceChild(iframe, elem);
        }
        if (mobile) {
          if (article_main) {
            let div_next = document.querySelector('div[id="__next"]');
            if (div_next)
              article.style.width = 0.8 * div_next.offsetWidth + 'px';
          }
          let lazy_images = article.querySelectorAll('figure img[loading="lazy"][style]');
          for (let elem of lazy_images) {
            elem.style = 'width: 95%;';
            if (elem.parentNode.style && elem.parentNode.getAttribute('style').includes('min-height:'))
              elem.parentNode.style['min-height'] = 'unset';
          }
          let figures = article.querySelectorAll('figure div');
          for (let elem of figures) {
            elem.removeAttribute('style');
            let svg = elem.querySelector('svg');
            removeDOMElement(svg);
          }
        }
        let pars = article.querySelectorAll('section > div[style*="font-size:"]:not([id])');
        if (pars.length < 5)
          article.firstChild.before(googleSearchToolLink(url));
        let ads = article_sel + ' div:empty:not([class])';
        hideDOMStyle(ads, 2);
      }
    }
    let url = window.location.href;
    let paywall_sel = 'head > meta[name$="article_ispaidcontent"][content="true"], div[data-testid="paywall-position-inline-paywall"]:not(:empty)';
    let article_sel = 'main > article';
    let article_main = document.querySelector(article_sel);
    if (!article_main)
      article_sel = 'article[role="article"] div[id]';
    let free = pageContains('div[data-testid="paywall-position-sticky-banner-top"]:not(:empty) span', 'gratis');
    if (!free.length)
      getArchive(url, paywall_sel, '', article_sel);
    let popup = document.querySelector('div[data-testid="close-popup-button"]');
    if (popup)
      popup.click();
  }, 1500);
  let ads = 'div[id^="ad_inline-"], div.mh-ad-label, div[data-testid="paywall-position-sticky-banner-bottom"], section[data-theme-sponsored-content], div[data-pym-src]';
  hideDOMStyle(ads);
}

else if (matchDomain('businessam.be')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.text-gradient');
    if (article) {
      let filter = /window\.fullcontent64\s?=\s?"/;
      let content_script = getSourceJsonScript(filter);
      if (content_script) {
        try {
          let content = decode_utf8(atob(content_script.text.split(filter)[1].split('";')[0]));
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + content + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          article.parentNode.replaceChild(content_new, article);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('businessinsider.nl')) {
  getJsonUrl('div.piano-article__paywall', '', 'div.piano-article__content');
}

else if (matchDomain('doorbraak.be')) {
  window.setTimeout(function () {
    let plus = document.querySelector('h1 > svg');
    let article = document.querySelector('div > div.prose');
    if (plus && article) {
      let paywall_sel = 'div.paywall';
      let paywall = document.querySelector(paywall_sel);
      let pars = article.querySelectorAll('p');
      if (paywall || pars.length < 2) {
        removeDOMElement(paywall);
        waitDOMElement(paywall_sel, 'DIV', removeDOMElement, false);
        let json_script = document.querySelector('script#__NUXT_DATA__');
        if (json_script) {
          try {
            if (!json_script.text.substr(0, 500).includes(window.location.pathname))
              refreshCurrentTab();
            let json = JSON.parse(json_script.text);
            json = json.filter(x => typeof x === 'string' && x.startsWith('<p>'));
            let json_text = json[0];
            if (json_text) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              article.appendChild(content_new);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }, 1000);
}

else if (matchDomain('fd.nl')) {
  if (window.location.hostname === 'specials.fd.nl') {
    document.querySelectorAll('div[class^="Opening_contentContainer"], section[class^="ScrollyText_"]').forEach(e => e.style = 'color: white;');
  } else {
    func_post = function () {
      if (mobile) {
        let art_width = document.body.offsetWidth;
        document.querySelectorAll('article:not([id])').forEach(e => e.style = 'width: ' + art_width * 0.90 + 'px; margin: 20px;');
        document.querySelectorAll('figure img[loading="lazy"][style]').forEach(e => e.style = 'width: 95%;');
      }
      let paywall = pageContains('section > h1', 'Lees direct het artikel');
      if (paywall.length) {
        let div_empty = document.querySelectorAll('div:empty');
        removeDOMElement(paywall[0].parentNode.parentNode, ...div_empty);
        header_nofix('main header', '', 'BPC > no archive-fix');
      }
    }
    let url = window.location.href;
    getArchive(url, 'section.upsell, div.upsell-modal-background', '', 'main');
  }
  let header = document.querySelector('div.header-placeholder');
  if (header)
    header.style.top = 0;
  let ads = 'div[data-id^="fd-message-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('ftm.nl')) {
  let videos = document.querySelectorAll('div.body > div.video-pp');
  for (let video of videos) {
    let video_id_dom = video.querySelector('a.video[data-youtube-id]');
    if (video_id_dom) {
      video_new = document.createElement('iframe');
      video_new.src = 'https://www.youtube.com/embed/' + video_id_dom.getAttribute('data-youtube-id');
      video_new.style = 'width: 95%; height: 400px; margin: 0px 20px;';
      video.parentNode.replaceChild(video_new, video);
    }
  }
  let audio_controls = document.querySelectorAll('audio[controls][style]');
  for (let elem of audio_controls)
    elem.removeAttribute('style');
  document.querySelectorAll('div.foldable').forEach(e => e.classList.remove('foldable'));
  let banners = 'div.banner-pp';
  hideDOMStyle(banners);
}

else if (matchDomain('groene.nl')) {
  let url = window.location.href;
  getArchive(url, 'div#closed-block', '', 'article');
  let login = document.querySelector('header li > a[href*="/accounts/inloggen"]');
  if (login) {
    let pop = document.createElement('li');
    let pop_link = document.createElement('a');
    pop_link.href = '/populair';
    pop_link.innerText = 'Populair';
    pop.appendChild(pop_link);
    login.parentNode.after(pop);
  }
}

else if (matchDomain('linda.nl')) {
  window.setTimeout(function () {
    let premium_sel = 'div#article div[class$="premiumlabel" i], article.premium-article_container';
    let premium = window.location.pathname.startsWith('/premium/') || document.querySelector(premium_sel);
    let article_sel = 'div.premium-article_main-content, div.article-content_htmlContent';
    let article = document.querySelector(article_sel);
    if (premium && article) {
      let paywall_sel = cs_param.paywall_sel || 'div.premium-login-box_loginBox';
      hideDOMStyle(paywall_sel);
      let fade = document.querySelector('div[class*="_loginRequired"]');
      if (fade)
        fade.className = article.className.replace(/[-\w]+_loginRequired/, '');
      let pars = article.querySelectorAll('p');
      if (pars.length > 5)
        return;
      let filter = /^window\.__INITIAL_PROPS__\s?=\s?/;
      let json_script = getSourceJsonScript(filter);
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text.split(filter)[1]);
          if (json) {
            let slug = json.slug;
            if ((slug && !window.location.pathname.includes(slug)) || !json.viewData)
              refreshCurrentTab();
            if (json.viewData.article) {
              function replace_also_read(str) {
                return str.replace(/{also-read title="([^}]+)" url="([^}]+)" [^}]+"}/g, "<div style='margin: 15px 0px'><a href=\"$2\">Lees ook: $1</a></div>");
              }
              if (json.viewData.article.modules) {
                let modules = json.viewData.article.modules;
                article.innerHTML = '';
                for (let elem of modules) {
                  let type = elem.acf_fc_layout;
                  if (type) {
                    let item = document.createElement('div');
                    if (['body_text', 'intro', 'quote'].includes(type)) {
                      if (elem.text) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString('<div style="margin: 20px;">' + replace_also_read((elem.title ? elem.title : '') + elem.text.replace(/\r\n/g, '<br>')) + '</div>', 'text/html');
                        item = doc.querySelector('div');
                        if (type === 'intro') {
                          let intro = item.querySelector('p');
                          if (intro)
                            intro.style = 'font-weight: bold; ';
                        } else if (type === 'quote')
                          item.style['text-align'] = 'center';
                        article.append(item);
                      }
                    } else if (type === 'image') {
                      let elem_images = elem.images_portrait || elem.images_landscape;
                      if (elem_images && elem_images.length) {
                        for (let img of elem_images) {
                          let url = img.image.sizes.large;
                          let caption_text = img.credits ? img.credits.replace(/(\n|<[^<]*>)/g, '') : '';
                          item = makeFigure(url, caption_text, {style: 'width: 100%;'});
                          article.append(item);
                        }
                      }
                    } else
                      console.log(elem);
                  }
                }
              } else if (json.viewData.article.body) {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + replace_also_read(json.viewData.article.body) + '</div>', 'text/html');
                let article_new = doc.querySelector('div');
                if (article_new) {
                  article.innerHTML = '';
                  article.appendChild(article_new);
                }
              } else
                header_nofix('div.article-content_base');
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, 1000);
}

else if (matchDomain('nationalgeographic.nl')) {
  let ads = 'div#gpt-leaderboard-ad, .breaker-ad:is(div, section)';
  hideDOMStyle(ads);
}

else if (matchDomain(nl_dpg_adr_domains.concat(['hln.be']))) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      if (mobile) {
        document.querySelectorAll('div[style*="grid-column-end:"]').forEach(e => e.style.width = article.offsetWidth + 'px');
      }
      article.querySelectorAll('div[style*="background-color:"][style*="width:"]:not(:has(> figure))').forEach(e => e.style.width = '85%'); //shades
      let lazy_images = article.querySelectorAll('img[loading="lazy"][style]:not([style*=";width:100%;"])');
      for (let elem of lazy_images) {
        elem.style = 'width: 95%;';
        if (elem.parentNode.style && elem.parentNode.getAttribute('style').includes('min-height:')) {
          elem.parentNode.removeAttribute('style');
          elem.parentNode.parentNode.removeAttribute('style');
        }
        if ((!elem.src || elem.src.startsWith('data:image/')) && elem.getAttribute('currentsourceurl'))
          elem.src = elem.getAttribute('currentsourceurl');
      }
      let widgets = article.querySelectorAll('div > div > div[old-src]:not([src])');
      for (let elem of widgets) {
        let iframe = document.createElement('iframe');
        iframe.src = elem.getAttribute('old-src');
        iframe.style = 'width: 100%; border: none;';
        if (iframe.src.includes('/widgets/') || iframe.src.includes('/playlists/'))
          iframe.style.height = '400px';
        elem.parentNode.replaceChild(iframe, elem);
      }
      let errors = article.querySelectorAll('div > div[old-src]:not([src]):has(div#main-frame-error)');
      for (let elem of errors) {
        let elem_new = document.createElement('iframe');
        elem_new.src = elem.getAttribute('old-src');
        elem_new.style = 'width: 100%; height: 400px; border: none;';
        elem.parentNode.removeAttribute('style');
        elem.parentNode.replaceChild(elem_new, elem);
      }
      let picture_divs = article.querySelectorAll('picture > div[style*="min-height:"]:has(svg)');
      for (let elem of picture_divs) {
        elem.parentNode.removeAttribute('style');
        removeDOMElement(elem);
      }
      let video_buttons = article.querySelectorAll('button[type="button"]');
      removeDOMElement(...video_buttons);
      let media = article.querySelectorAll('div[style*="aspect-ratio:"]');
      for (let elem of media) {
        if (elem.innerText.trim().length < 3)
          removeDOMElement(elem);
      }
      if (header_img && !article.querySelector('header figure, figure > div > svg'))
        article.firstChild.before(header_img);
      if (comments)
        article.appendChild(comments);
      if (readmore)
        article.appendChild(readmore);
    }
    let article_divs = document.querySelectorAll(article_sel + ' > div:not(:empty)');
    if (article_divs.length < 3)
      article.before(googleSearchToolLink(url));
    let ads = 'span[style*="background-color:"]:has(> span[style*="min-height:"]), span > br, ' + article_sel + ' div:empty:not([class])';
    hideDOMStyle(ads, 2);
  }
  let header_img = document.querySelector('div[data-content-type="MEDIA_TOP"]');
  let comments = document.querySelector('div[data-content-type="SHARE"]');
  let readmore = document.querySelector('div[data-content-type="CROSS_PROMOTION"]');
  let url = window.location.href;
  let article_sel = 'article';
  let paywall_sel = article_sel + ' svg.premium-indicator[class*="article-premium-indicator-"]';
  let paywall_action = {rm_class: 'premium-indicator'};
  if (window.location.pathname.includes('~') && !document.querySelector(paywall_sel)) { // regwall
    let pars = document.querySelectorAll(article_sel + ' div[data-content-type="PARAGRAPH"]');
    if (pars.length < 3) {
      if (document.querySelector('div[data-content-type="MEDIA_TOP"] > div > figure'))
        header_nofix('section.grid', '', 'BPC > regwall (use free account)');
      getArchive(url, article_sel, {rm_attrib: 'none'}, article_sel);
    }
  } else
    getArchive(url, paywall_sel, paywall_action, article_sel);
  let ads = 'div.dfp-space';
  hideDOMStyle(ads);
}

else if (matchDomain(nl_dpg_media_domains)) {
  setCookie('TID_ID', '', '', '/', 0);
  let banners = 'aside[data-temptation-position^="ARTICLE_"], div[data-temptation-position^="PAGE_"], div[class^="ad--"], div[id^="article_paragraph_"], div[data-advert-orig-id], div[class$="1-container"]';
  hideDOMStyle(banners);
  window.setTimeout(function () {
    document.querySelectorAll('[class^="artstyle__"][style="display: none;"]').forEach(e => e.removeAttribute('style'));
  }, 500);
}

else if (matchDomain('nrc.nl')) {
  setCookie('counter', '', '', '/', 0, true);
  let banners = 'div[id$="modal__overlay"], div.header__subscribe-bar, div.banner, dialog.dmt-login-modal';
  hideDOMStyle(banners);
}

else if (matchDomain('telegraaf.nl')) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      if (mobile) {
        let body = document.querySelector('body');
        if (body) {
          article.style.width = body.offsetWidth * 0.95 + 'px';
          let lazy_images = document.querySelectorAll('button > img[loading="lazy"]');
          for (let elem of lazy_images) {
            elem.style = 'width: 100%;';
            elem.parentNode.style['min-height'] = 'auto';
          }
        }
        article.querySelectorAll('section[style*=";width:"]').forEach(e => e.removeAttribute('style'));
      }
      let gallery, img_width, captions, next, next_images, next_img_width;
      let gallery_new = document.createElement('div');
      let figure_nr = 0;
      let gallery_figures = document.querySelectorAll('div > ul > li > figure');
      for (let figure of gallery_figures) {
        if (!figure_nr) {
          gallery = figure.parentNode.parentNode.parentNode;
          captions = Array.from(gallery.querySelectorAll('span')).filter(e => e.innerText.includes('©'));
          next = gallery.nextSibling;
          if (next)
            next_images = next.querySelectorAll('img[currentsourceurl]');
        }
        let img = figure.querySelector('img[currentsourceurl]');
        if (img && next_images) {
          let img_src = img.getAttribute('currentsourceurl');
          if (img_src) {
            if (img_src.includes('/alternates/'))
              img_width = img_src.split('/alternates/')[1].split('/')[0];
          } else if (img_width && next_images[figure_nr]) {
            img_src = next_images[figure_nr].getAttribute('currentsourceurl');
            if (img_src && img_src.includes('/alternates/')) {
              next_img_width = img_src.split('/alternates/')[1].split('/')[0];
              img_src = img_src.replace(next_img_width, img_width);
            }
          }
          let figure_new = makeFigure(img_src, captions && captions[figure_nr] ? captions[figure_nr].parentNode.innerText : '', {style: 'width: 100%;'});
          figure_new.style = 'margin: 20px 0px;';
          gallery_new.appendChild(figure_new);
        }
        figure_nr++;
      }
      if (gallery && next) {
        next.after(gallery_new);
        removeDOMElement(gallery, next);
      }
      let iframes = pageContains('div[style]', /^<iframe/);
      if (iframes.length) {
        let parser = new DOMParser();
        for (let elem of iframes) {
          let doc = parser.parseFromString('<div>' + elem.innerText.replace(/”/g, '"') + '</div>', 'text/html');
          let elem_new = doc.querySelector('div');
          elem.parentNode.replaceChild(elem_new, elem);
        }
      }
      let social_media = article.querySelectorAll('div[style*="background-position:"] > button');
      if (social_media.length) {
        let json_script = document.querySelector('script#__NEXT_DATA__');
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text);
            if (json) {
              let embedcodes = getNestedKeys(json, 'props.pageProps.data.context.embedcodes');
              if (embedcodes && embedcodes.length) {
                let parser = new DOMParser();
                for (let n = 0; n < social_media.length; n++) {
                  if (embedcodes[n] && embedcodes[n].html) {
                    let doc = parser.parseFromString('<div style="margin: 20px 0px;">' + embedcodes[n].html + '</div>', 'text/html');
                    let embed_new = doc.querySelector('div');
                    social_media[n].parentNode.parentNode.replaceChild(embed_new, social_media[n].parentNode);
                  }
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      let errors = document.querySelectorAll('div[old-src]:not([src]):has(div#__next_error__)');
      for (let elem of errors) {
        let elem_new = document.createElement('iframe');
        elem_new.src = elem.getAttribute('old-src');
        elem_new.style = 'width: 100%; height: ' + elem.getAttribute('height') + 'px;';
        elem.parentNode.replaceChild(elem_new, elem);
      }
      document.querySelectorAll('div > div[style^="min-height:"] > div[id^="player_"]').forEach(e => hideDOMElement(e.parentNode.parentNode));
      let pars = document.querySelectorAll(article_sel + ' section > div[style*="font-family:"]:not(:empty)');
      if (pars.length < 5)
        article.after(googleSearchToolLink(url));
      let ads = article_sel + ' div:empty';
      hideDOMStyle(ads, 2);
    }
  }
  let url = window.location.href.split(/[#\?]/)[0];
  let article_sel = 'article';
  window.setTimeout(function () {
    let paywall_sel = 'div[data-testid="paywall-position-popover"]:not(:empty)';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      if (window.location.pathname.startsWith('/video/') && document.querySelector('div[data-testid="article-video"]'))
        removeDOMElement(paywall);
      else
        getArchive(url, paywall_sel, '', article_sel);
      let noscroll = document.querySelector('body[class]');
      if (noscroll)
        noscroll.removeAttribute('class');
    }
  }, 1000);
  let ads = 'div[id^="ad_"], div[class^="scrollable-ads"], iframe#ecommerce-ad-iframe, div[data-pym-src], div.mh-ad-label';
  hideDOMStyle(ads);
}

else if (matchDomain('tijd.be')) {
  let article_match = window.location.pathname.match(/\/(\d+)\.html$/);
  if (article_match) {
    let article_id = article_match[1];
    let url = window.location.href;
    let nofix_msg = 'BPC > no data yet (refresh page)';
    if (matchDomain('belegger.tijd.be')) {
      window.setTimeout(function () {
      let paywall = document.querySelector('div[class^="ArticleTemplate_paywallContainer_"]');
      if (paywall) {
        removeDOMElement(paywall);
		let article_sel = 'div[class^="ArticleTemplate_articleBodyCenter_"]';
        let article = document.querySelector(article_sel);
        if (article) {
          let authorization = mediafin_get_auth();
          if (authorization) {
            let url_src = 'https://api.mediafin.be/content/article/urn:article:' + article_id;
            getExtFetch(url_src, '', {headers: {authorization: authorization}}, mediafin_main, [article]);
          } else {
            header_nofix(article, '', nofix_msg);
            article.before(googleSearchToolLink(url));
          }
        }
        addStyle('body {overflow: auto !important} ' + article_sel + ' {margin: 20px 0px;}');
        let banner = document.querySelector('div[data-id="react-paywall-auth0"]');
        removeDOMElement(banner);
      }
      }, 1000);
    } else {
      window.setTimeout(function () {
        let close_button = document.querySelector('button.ds-modal__top-bar__closebutton');
        if (close_button)
          close_button.click();
      }, 1000);
      let paywall = document.querySelector('html.paywall-active');
      if (paywall) {
        paywall.classList.remove('paywall-active');
        if (!(window.location.href.includes('/live-blog/') || document.querySelector('header.live-blog-header'))) {
          let article = document.querySelector('div[itemprop="articleBody"]');
          if (article) {
            let authorization = mediafin_get_auth();
            if (authorization) {
              let url_src = 'https://api.mediafin.be/content/article/urn:article:' + article_id;
              getExtFetch(url_src, '', {headers: {authorization: authorization}}, mediafin_main, [article]);
            } else {
              header_nofix(article, '', nofix_msg);
              article.before(googleSearchToolLink(url));
            }
          }
        } else {
          let main = document.querySelector('main');
          if (main)
            main.after(googleSearchToolLink(url));
        }
      }
    }
    function clear_inert() {
      document.querySelectorAll('[inert]').forEach(e => e.removeAttribute('inert'));
    }
    clear_inert();
  }
}

else if (matchDomain('vn.nl')) {
  let paywall = document.querySelectorAll('section[class^="c-paywall"]');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let article = document.querySelector('div.c-article-content__container');
    if (article) {
      let json_script = document.querySelector('script#__NEXT_DATA__');
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json && json.props.pageProps.article && json.props.pageProps.article.content) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + json.props.pageProps.article.content + '</div>', 'text/html');
            let content_new = doc.querySelector('div');
            article.innerHTML = '';
            article.appendChild(content_new);
            let audio = document.querySelector('div.c-author-info__audio-player');
            if (audio) {
              if (json.props.pageProps.article.audioplayer.audioFile.node.mediaItemUrl) {
                let audio_new = document.createElement('audio');
                audio_new.src = json.props.pageProps.article.audioplayer.audioFile.node.mediaItemUrl;
                audio_new.style = 'height: 50px; width: 60%;';
                audio_new.setAttribute('controls', '');
                audio.parentNode.replaceChild(audio_new, audio);
              }
            }
          } else
            refreshCurrentTab();
        } catch (err) {
          console.log(err);
        }
      }
    }
    let noscroll = document.querySelector('html[class]');
    if (noscroll)
      noscroll.removeAttribute('class');
  }
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
