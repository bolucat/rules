// ==UserScript==
// @name            Bypass Paywalls Clean - nl/be
// @version         4.1.4.2
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.nl.user.js
// @updateURL       https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc.nl.user.js
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @match           *://*.nl/*
// @match           *://*.artsenkrant.com/*
// @match           *://*.businessam.be/*
// @match           *://*.demorgen.be/*
// @match           *://*.doorbraak.be/*
// @match           *://*.flair.be/nl/*
// @match           *://*.gva.be/*
// @match           *://*.hbvl.be/*
// @match           *://*.hln.be/*
// @match           *://*.humo.be/*
// @match           *://*.knack.be/*
// @match           *://*.kw.be/*
// @match           *://*.libelle.be/*
// @match           *://*.nieuwsblad.be/*
// @match           *://*.projectcargojournal.com/*
// @match           *://*.railfreight.cn/*
// @match           *://*.railfreight.com/*
// @match           *://*.railtech.be/*
// @match           *://*.railtech.com/*
// @match           *://*.standaard.be/*
// @match           *://*.taxipro.be/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @grant           GM.xmlHttpRequest
// ==/UserScript==

(function() {
  //'use strict';

var func_post;
var fetch_headers = {};

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;
var cs_param = {};

var overlay = document.querySelector('body.didomi-popup-open');
if (overlay)
  overlay.classList.remove('didomi-popup-open');
var ads = 'div.OUTBRAIN, div[id^="taboola-"], div.ad-container, div[class*="-ad-container"], div[class*="_ad-container"], div.arc_ad, div[id^="poool-"], amp-ad, amp-embed[type="mgid"], amp-embed[type="outbrain"], amp-embed[type="taboola"]';
hideDOMStyle(ads, 10);

var be_mediahuis_domains = ['gva.be', 'hbvl.be', 'nieuwsblad.be', 'standaard.be'];
var be_roularta_domains = ['artsenkrant.com', 'beleggersbelangen.nl', 'flair.be', 'knack.be', 'kw.be', 'libelle.be'];
var nl_dpg_adr_domains = ['ad.nl', 'bd.nl', 'bndestem.nl', 'destentor.nl', 'ed.nl', 'gelderlander.nl', 'pzc.nl', 'tubantia.nl'];
var nl_dpg_media_domains = ['demorgen.be', 'flair.nl', 'humo.be', 'libelle.nl', 'margriet.nl', 'parool.nl', 'trouw.nl', 'volkskrant.nl'];
var nl_mediahuis_region_domains = ['gooieneemlander.nl', 'haarlemsdagblad.nl', 'ijmuidercourant.nl', 'leidschdagblad.nl', 'limburger.nl', 'noordhollandsdagblad.nl'];

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
        if (mobile) {
          if (article_main) {
            let div_next = document.querySelector('div[id="__next"]');
            if (div_next)
              article.style.width = div_next.offsetWidth + 'px';
          }
          let lazy_images = article.querySelectorAll('figure img[loading="lazy"][style]');
          for (let elem of lazy_images)
            elem.style = 'width: 95%;';
          let figures = article.querySelectorAll('figure div');
          for (let elem of figures) {
            elem.removeAttribute('style');
            let svg = elem.querySelector('svg');
            removeDOMElement(svg);
          }
        }
        let pars = article.querySelectorAll('div[style*="font-size"]');
        if (pars.length < 5)
          article.before(googleSearchToolLink(url));
      }
    }
    let url = window.location.href;
    let paywall_sel = 'head > meta[name$="article_ispaidcontent"][content="true"]';
    let article_sel = 'main > article';
    let article_main = document.querySelector(article_sel);
    if (!article_main)
      article_sel = 'article[role="article"] div[id]';
    getArchive(url, paywall_sel, '', article_sel);
    let popup = document.querySelector('div[data-testid="close-popup-button"]');
    if (popup)
      popup.click();
  }, 1500);
}

else if (matchDomain('businessam.be')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.text-gradient');
    if (article) {
      let scripts = document.querySelectorAll('script:not([src]):not([type])');
      let content_script;
      for (let script of scripts) {
        if (script.text.match(/window\.fullcontent64\s?=\s?"/)) {
          content_script = script;
          break;
        }
      }
      if (content_script) {
        try {
          let content = decode_utf8(atob(content_script.text.split(/window\.fullcontent64\s?=\s?"/)[1].split('";')[0]));
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
  let paywall_sel = 'div.paywall';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
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
          let article = document.querySelector('div > div.prose');
          if (article) {
            article.appendChild(content_new);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain(be_roularta_domains)) {
  if (matchDomain('beleggersbelangen.nl')) {
    let paywall = document.querySelector('div.unlimited-access');
    if (paywall) {
      removeDOMElement(paywall);
      let no_account = document.querySelector('div.no-account');
      if (no_account)
        no_account.classList.remove('no-account');
      let content_inner = document.querySelector('div.content-inner[style]');
      if (content_inner)
        content_inner.removeAttribute('style');
    }
  } else {
    let paywall = document.querySelector('div[id*="wall-modal"]');
    if (paywall) {
      removeDOMElement(paywall);
      let html = document.querySelector('html[class]');
      if (html)
        html.removeAttribute('class');
      function roularta_noscroll(node) {
        node.removeAttribute('style');
        node.removeAttribute('class');
      }
      waitDOMAttribute('html', 'html', 'class', roularta_noscroll, true);
      let intro = document.querySelectorAll('div.article-body > p, div.article-body > style');
      removeDOMElement(...intro);
      let locked = document.querySelector('body.locked');
      if (locked)
        locked.classList.remove('locked');
    }
    if (!window.navigator.userAgent.toLowerCase().includes('chrome') && !matchDomain(['artsenkrant.com', 'kw.be']) && window.location.href.match(/\/(\w+-){2,}/)) {
      let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-lazy-src]');
      for (let elem of lazy_images) {
        elem.src = elem.getAttribute('data-lazy-src');
      }
    }
  }
  let ads = 'div.rmgAd, div.c-header__ad';
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
  let more = pageContains('div.wrapper > h2', 'Verder lezen?');
  if (more.length) {
    let link_text = 'https://www.groene.nl/populair';
    let a_link = document.createElement('a');
    a_link.href = link_text;
    a_link.innerText = 'BPC > ' + link_text.split('www.')[1];
    more[0].parentNode.append(document.createElement('br'), a_link);
  }
}

else if (matchDomain(['lc.nl', 'dvhn.nl']) || document.querySelector('head > link[href*=".ndcmediagroep.nl/"]')) {
  let paywall = document.querySelector('div.signupPlus, div.pw-wrapper');
  if (paywall) {
    let intro = document.querySelector('div.startPayWall');
    let html = document.documentElement.outerHTML;
    if (html.includes('window.__NUXT__=')) {
      removeDOMElement(paywall, intro);
      try {
        let json = html.split('window.__NUXT__=')[1].split('</script>')[0].trim();
        let json_match = json.includes('type:"article",');
        if (json_match) {
          let path_match = window.location.pathname.match(/-(\d+)\./);
          if (path_match) {
            let article_id = path_match[1];
            json_match = json.includes(',id:"' + article_id + '",');
            if (!json_match && json.match(/[(,]null,/)) {
              let art_match = json.split(/[(,]null,/)[1].match(new RegExp('-' + article_id + '\\.', 'g'));
              json_match = art_match && art_match.length > 1;
            }
          }
        }
        if (!json_match)
          refreshCurrentTab();
        else if (json.includes(',body:')) {
          let intro;
          let intro_match = json.match(/,leadtext_raw:"([^"]+)",/);
          if (intro_match) {
            intro = document.createElement('p');
            intro.innerText = intro_match[1];
            intro.style = 'font-weight: bold;';
          }
          let json_text = json.split(',body:')[1].split(/,(leadText|brand_key|tts|pianoKeywords):/)[0].replace(/([{,])(\w+)(?=:(["\{\[]|[\w$]{1,2}[,\}]))/g, "$1\"$2\"").replace(/(Image\\":)(\d)([,}])/g, '$1\\"$2\\"$3').replace(/\":(\[)?([\w\$\.]+)([\]},])/g, "\":$1\"$2\"$3");
          let article = document.querySelector('div.content');
          if (article) {
            article.innerHTML = '';
            if (intro)
              article.appendChild(intro);
            let pars = JSON.parse(json_text);
            function addParText(elem, par_text, add_br = false) {
              if (par_text) {
                if (par_text.length <= 2)
                  par_text = ' ... ';
                let span = document.createElement('span');
                span.innerText = par_text;
                elem.appendChild(span);
                if (add_br)
                  elem.appendChild(document.createElement('br'));
              }
            }
            function addLink(elem, link_text, href, add_br = false) {
              let par_link = document.createElement('a');
              par_link.href = href;
              par_link.innerText = link_text;
              elem.appendChild(par_link);
              if (add_br)
                elem.appendChild(document.createElement('br'));
            }
            function addImage(elem, child) {
              let figure = document.createElement('figure');
              let img = document.createElement('img');
              img.src = child.relation.href;
              figure.appendChild(img);
              if (child.relation.caption && child.relation.caption.length > 2) {
                let caption = document.createElement('figcaption');
                caption.innerText = child.relation.caption;
                figure.appendChild(caption);
              }
              elem.appendChild(figure);
            }
            function addChildren(elem, children, add_br = false) {
              for (let child of children) {
                if (child.text) {
                  addParText(elem, child.text, add_br);
                } else if (child.relation && (child.type === 'img' || child.relation.caption) && child.relation.href) {
                  let img_par = document.createElement('p');
                  addImage(img_par, child);
                  elem.appendChild(img_par);
                } else if (child.relation && child.relation.link && child.relation.link.length > 2) {
                  addLink(elem, decodeURIComponent(child.relation.title.length > 2 ? child.relation.title : child.relation.link), child.relation.link);
                } else if (child.children && child.children[0]) {
                  if (child.children[0].text) {
                    if ((child.href && child.href.length > 2) || (child.relation && child.relation.follow && child.relation.follow.url)) {
                      if (child.children[0].text.length > 2)
                        addLink(elem, child.children[0].text, child.href || child.relation.follow.url, add_br);
                    } else
                      addParText(elem, child.children[0].text);
                  } else
                    addChildren(elem, child.children);
                }
              }
            }
            for (let par of pars) {
              let elem = document.createElement('p');
              if (par.code) {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + par.code + '</div>', 'text/html');
                elem = doc.querySelector('div');
              } else if (par.insertbox_head || par.insertbox_text) {
                if (par.insertbox_head && par.insertbox_head.length > 2)
                  addParText(elem, par.insertbox_head, true);
                if (par.insertbox_text) {
                  for (let item of par.insertbox_text) {
                    if (item.children)
                      addChildren(elem, item.children, true);
                  }
                }
              } else if (par.text) {
                addParText(elem, par.text);
              } else if (par.children) {
                addChildren(elem, par.children);
              } else if (par.typename.length > 2)
                console.log(par);
              if (elem.hasChildNodes()) {
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
  let ads = 'div.top__ad, div.marketingblock-article';
  hideDOMStyle(ads);
}

else if (matchDomain('linda.nl')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.premium-login-box_login-box');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('article');
      if (article) {
        let filter = /^window\.__INITIAL_PROPS__\s?=\s?/;
        let json_script = getSourceJsonScript(filter);
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text.split(filter)[1]);
            if (json) {
              let slug = json.slug;
              if ((slug && !window.location.pathname.includes(slug)) || !json.viewData)
                refreshCurrentTab();
              if (json && json.viewData.article && json.viewData.article.modules) {
                let modules = json.viewData.article.modules;
                for (let elem of modules) {
                  let type = elem.acf_fc_layout;
                  if (type) {
                    let item = document.createElement('div');
                    if (['body_text', 'intro', 'quote'].includes(type)) {
                      if (elem.text) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString('<div style="margin: 20px;">' + (elem.title ? elem.title : '') + elem.text.replace(/\r\n/g, '<br>') + '</div>', 'text/html');
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
              } else
                header_nofix('div.article-content_base');
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }, 1000);
}

else if (matchDomain(nl_dpg_adr_domains.concat(['hln.be']))) {
  let sub_sel = 'article[id^="PURCHASE"]';
  let sub = document.querySelector(sub_sel + ' > button');
  if (sub)
    sub.click();
  func_post = function () {
    let shades = document.querySelectorAll('div[style*="background-color"][style*=";width"]');
    for (let elem of shades)
      elem.style.width = '85%';
    let lazy_images = document.querySelectorAll('picture img[loading="lazy"][style]');
    for (let elem of lazy_images)
      elem.style = 'width: 95%;';
    let widgets = document.querySelectorAll('div[old-src^="https://valley.ad.nl/widgets/"]:not([src])');
    for (let elem of widgets) {
      let iframe = document.createElement('iframe');
      iframe.src = elem.getAttribute('old-src');
      iframe.style = 'height: 400px; border: none;';
      elem.parentNode.replaceChild(iframe, elem);
    }
    header_nofix('footer', sub_sel, 'BPC > no archive-fix');
  }
  let article_sel = 'div#remaining-paid-content';
  let url = window.location.href;
  getArchive(url, article_sel + '[data-reduced="true"]', {rm_attrib: 'data-reduced'}, article_sel);
}

else if (matchDomain(nl_dpg_media_domains)) {
  setCookie('TID_ID', '', '', '/', 0);
  let banners = 'aside[data-temptation-position^="ARTICLE_"], div[data-temptation-position^="PAGE_"], div[class^="ad--"], div[id^="article_paragraph_"]';
  hideDOMStyle(banners);
  window.setTimeout(function () {
    let elem_hidden = document.querySelectorAll('[class^="artstyle__"][style="display: none;"]');
    for (let elem of elem_hidden)
      elem.removeAttribute('style');
  }, 500);
}

else if (matchDomain(nl_mediahuis_region_domains)) {
  let video = document.querySelector('div.video, div[data-testid="article-video"]');
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      if (video) {
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
      if (mobile) {
        let div_next = document.querySelector('div[id="__next"]');
        if (div_next)
          article.style.width = div_next.offsetWidth - 20 + 'px';
        let lazy_images = article.querySelectorAll('figure img[loading="lazy"][style]');
        for (let elem of lazy_images)
          elem.style = 'width: 95%;';
        let figures = article.querySelectorAll('figure div');
        for (let elem of figures) {
          elem.removeAttribute('style');
          let svg = elem.querySelector('svg');
          removeDOMElement(svg);
        }
      }
      if (article.innerText.length < 1000) {
        let header = article.querySelector('hgroup');
        if (header)
          header.before(googleSearchToolLink(url));
      }
    }
  }
  let paywall_sel = 'head > meta[name$="article_ispaidcontent"][content="true"]';
  let article_sel = 'main > article';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel);
  window.setTimeout(function () {
    let noscroll = document.querySelector('body[class*="style_disable-scroll-popup"]');
    if (noscroll)
      noscroll.style = 'position: static !important; overflow: visible !important';
  }, 500);
  let banners = 'div[class*="style_popover"]';;
  hideDOMStyle(banners);
}

else if (matchDomain('nrc.nl')) {
  setCookie('counter', '', '', '/', 0, true);
  let banners = document.querySelectorAll('div[id$="modal__overlay"], div.header__subscribe-bar, div.banner');
  removeDOMElement(...banners);
}

else if (matchDomain('telegraaf.nl')) {
  func_post = function () {
    if (mobile) {
      let article = document.querySelector('article');
      let body = document.querySelector('body');
      if (article && body)
        article.style.width = body.offsetWidth;
    }
    let iframes = pageContains('div[style]', /^<iframe/);
    for (let elem of iframes) {
      let parser = new DOMParser();
      let doc = parser.parseFromString('<div>' + elem.innerText.replace(/”/g, '"') + '</div>', 'text/html');
      let elem_new = doc.querySelector('div');
      elem.parentNode.replaceChild(elem_new, elem);
    }
    document.querySelectorAll('div > div[style^="min-height:"] > div[id^="player_"]').forEach(e => hideDOMElement(e.parentNode.parentNode));
  }
  let url = window.location.href;
  window.setTimeout(function () {
    let paywall_sel = 'div[data-testid="paywall-position-popover"]:not(:empty)';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      if (window.location.pathname.startsWith('/video/') && document.querySelector('div[data-testid="article-video"]'))
        removeDOMElement(paywall);
      else
        getArchive(url, paywall_sel, '', 'article');
    }
  }, 1000);
  let ads = 'div[id^="ad_"], div[class^="scrollable-ads"], iframe#ecommerce-ad-iframe';
  hideDOMStyle(ads);
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

function matchCookies(name) {
  return document.cookie.split(';').filter(x => x.trim().match(name)).map(y => y.split('=')[0].trim())
}

function setCookie(names, value, domain = '', path = '/', days = 0, localstorage_hold = false) {
  var max_age = days * 24 * 60 * 60;
  let ck_names = Array.isArray(names) ? names : [];
  if (names instanceof RegExp)
    ck_names = matchCookies(names);
  else if (typeof names === 'string')
    ck_names = [names];
  for (let ck_name of ck_names) {
    document.cookie = ck_name + "=" + (value || "") + (domain ? "; domain=" + domain : '') + (path ? "; path=" + path : '') + "; max-age=" + max_age;
  }
  if (!localstorage_hold) {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}

function cookieExists(name) {
  return document.cookie.split(';').some(ck => ck.trim().indexOf(name + '=') === 0)
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

function addStyle(css, id = 1) {
  let style = document.querySelector('head > style#add'+ id);
  if (!style && document.head) {
    let sheet = document.createElement('style');
    sheet.id = 'add' + id;
    sheet.innerText = css;
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
    headers: fetch_headers,
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
    fetch(url, {headers: fetch_headers})
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
      replaceTextFail(url, article, proxy, text_fail);
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
              arch_div.appendChild(archiveLink(window.location.href.split(/[#\?]/)[0], 'BPC > Full article text fetched from (no need to report issue for external site):\r\n'));
              arch_div.style = 'margin: 0px 0px 50px;';
              arch_dom.before(arch_div);
            }
            let targets = article_new.querySelectorAll('a[target="_blank"][href^="' + window.location.origin + '"]');
            for (let elem of targets)
              elem.removeAttribute('target');
            let invalid_links = article_new.querySelectorAll('link[rel*="preload"]:not([href])');
            removeDOMElement(...invalid_links);
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
  return externalLink([new URL(url).hostname], '{url}/again?url=' + window.location.href.split(/[#\?]/)[0], url, text_fail);
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

function getJsonUrlText(article, callback, article_id = '', key = '', url_rest = false, url_slash = false) {
  let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
  let json_url;
  if (json_url_dom)
    json_url = json_url_dom.href;
  if (!json_url && article_id)
    json_url = window.location.origin + '/wp-json/wp/v2/posts/' + article_id;
  if (url_rest)
    json_url = json_url.replace('/wp-json/', '/?rest_route=/');
  else if (url_slash)
    json_url = json_url.replace('/wp-json/', '//wp-json/');
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

function getJsonUrl(paywall_sel, paywall_action = '', article_sel, art_options = {}, article_id = '', key = '', url_rest = false, url_slash = false) {
  let paywall = document.querySelectorAll(paywall_sel);
  let article = document.querySelector(article_sel);
  if (paywall.length && article) {
    clearPaywall(paywall, paywall_action);
    getJsonUrlText(article, (json_text, article) => {
      if (json_text && article)
        getJsonUrlAdd(json_text, article, art_options);
    }, article_id, key, url_rest, url_slash);
  }
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

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

function parseHtmlEntities(encodedString) {
  let translate_re = /&(nbsp|amp|quot|lt|gt|deg|hellip|laquo|raquo|ldquo|rdquo|lsquo|rsquo|mdash);/g;
  let translate = {"nbsp": " ", "amp": "&", "quot": "\"", "lt": "<", "gt": ">", "deg": "°", "hellip": "…",
      "laquo": "«", "raquo": "»", "ldquo": "“", "rdquo": "”", "lsquo": "‘", "rsquo": "’", "mdash": "—"};
  return encodedString.replace(translate_re, function (match, entity) {
      return translate[entity];
  }).replace(/&#(\d+);/gi, function (match, numStr) {
      let num = parseInt(numStr, 10);
      return String.fromCharCode(num);
  });
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

function check_loop(interval = 2000) {
  let loop = true;
  let loop_date = Number(sessionStorage.getItem('###_loop'));
  if (!(loop_date && (Date.now() - loop_date < interval))) {
    sessionStorage.setItem('###_loop', Date.now());
    loop = false;
  }
  return loop;
}

function refreshCurrentTab(not_loop = true) {
  if (!not_loop || !check_loop(5000)) {
    window.setTimeout(function () {
      window.location.reload(true);
    }, 500);
  } else {
    let header = (document.body && document.body.firstChild) || document.documentElement;
    header_nofix(header, '', 'BPC > refresh loop stopped');
  }
}

})();
