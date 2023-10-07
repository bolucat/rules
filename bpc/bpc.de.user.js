// ==UserScript==
// @name            Bypass Paywalls Clean - de/at/ch
// @version         3.3.6.4
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.de.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.de.user.js
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.de/*
// @match           *://*.beobachter.ch/*
// @match           *://*.faz.net/*
// @match           *://*.handelszeitung.ch/*
// @match           *://*.kurier.at/*
// @match           *://*.nzz.ch/*
// @match           *://*.topagrar.at/*
// @match           *://*.topagrar.com/*
// @match           *://*.vn.at/*
// @match           *://*.vol.at/*
// @match           *://*.wochenblatt.com/*
// @match           *://webcache.googleusercontent.com/*
// ==/UserScript==

(function() {
  'use strict';

if (matchDomain('webcache.googleusercontent.com')) {
  window.setTimeout(function () {
    if (window.location.search.startsWith('?q=cache:https://www.schwaebische.de')) {
      let ads = document.querySelectorAll('div.fp-ad-placeholder');
      hideDOMElement(...ads);
    }
  }, 1000);
}

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

var de_funke_medien_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_lv_domains = ['profi.de', 'topagrar.at', 'topagrar.com', 'wochenblatt.com'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de', 'rnd.de'];
var de_westfalen_medien_domains = ['muensterschezeitung.de', 'westfalen-blatt.de', 'wn.de'];

if (matchDomain('aerztezeitung.de')) {
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
  let url = window.location.href;
  if (!url.includes('-amp.html')) {
    let paywall = document.querySelector('div.aa-visible-logged-out');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.replace('.html', '-amp.html');
    }
  } else {
    amp_unhide_subscr_section();
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
          let url_id = json_script.text.includes('"gcid":"') ? json_script.text.split('"gcid":"')[1].split('","nid"')[0] : '';
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
              let content = pars[par].text;
              if (content) {
                let content_new = parser.parseFromString('<div style="font-size: 1.7rem; margin: 50px;">' + content + '</div>', 'text/html');
                let article_new = content_new.querySelector('div'); ;
                article.appendChild(article_new);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let ads = document.querySelectorAll('div.ad-wrapper');
  hideDOMElement(...ads);
}

else if (matchDomain('boersen-zeitung.de')) {
  window.setTimeout(function () {
    let url = window.location.href;
    let paywall = document.querySelector('storefront-element[child-id="paywall"]');
    if (paywall) {
      removeDOMElement(paywall);
      replaceDomElementExt(url, false, false, 'article');
    }
  }, 2000);
}

else if (matchDomain('cicero.de')) {
  let url = window.location.href;
  if (!window.location.search.match(/(\?|&)amp/)) {
    amp_redirect('.plenigo-paywall');
  } else {
    let teasered_content = document.querySelector('.teasered-content');
    if (teasered_content)
      teasered_content.classList.remove('teasered-content');
    let teasered_content_fader = document.querySelector('.teasered-content-fader');
    let btn_read_more = document.querySelector('.btn--read-more');
    removeDOMElement(teasered_content_fader, btn_read_more);
    let amp_ads = document.querySelectorAll('amp-ad');
    hideDOMElement(...amp_ads);
  }
  let urban_ad_sign = document.querySelectorAll('.urban-ad-sign');
  removeDOMElement(...urban_ad_sign);
}

else if (matchDomain('faz.net')) {
  if (matchDomain('zeitung.faz.net')) {
    let paywall_z = document.querySelector('.c-red-carpet');
    if (paywall_z) {
      removeDOMElement(paywall_z);
      let og_url = document.querySelector('head > meta[property="og:url"][content]');
      if (og_url)
        window.location.href = og_url.content;
    }
    let sticky_advt = document.querySelector('.sticky-advt');
    removeDOMElement(sticky_advt);
  } else {
    let paywall = document.querySelector('#paywall-form-container-outer, .atc-ContainerPaywall');
    if (paywall) {
      removeDOMElement(paywall);
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json_text = JSON.parse(json_script.text).articleBody;
        if (json_text) {
          let article_text = document.querySelector('.art_txt.paywall,.atc-Text.js-atc-Text');
          article_text.innerText = '';
          let elem = document.createElement("p");
          elem.setAttribute('class', 'atc-TextParagraph');
          elem.innerText = json_text;
          article_text.appendChild(elem);
        }
      }
    }
    let lay_paysocial = document.querySelector('div.lay-PaySocial');
    let ads = document.querySelectorAll('div.iqadtile_wrapper');
    removeDOMElement(lay_paysocial, ...ads);
  }
}

else if (matchDomain('freiepresse.de')) {
  let url = window.location.href;
  let article_teaser = document.querySelector('div.article-teaser');
  if (article_teaser && url.match(/(\-artikel)(\d){6,}/)) {
    window.setTimeout(function () {
      window.location.href = url.replace('-artikel', '-amp');
    }, 500);
  } else if (url.match(/(\-amp)(\d){6,}/)) {
    let amp_ads = document.querySelectorAll('amp-fx-flying-carpet, amp-ad, amp-embed');
    let pw_layer = document.querySelector('.pw-layer');
    hideDOMElement(...amp_ads, pw_layer);
  }
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
  window.setTimeout(function () {
    let paywall = document.querySelector('div.dm-paywall-wrapper');
    if (paywall) {
      let json_script = getArticleJsonScript();
      if (json_script) {
        removeDOMElement(paywall);
        try {
          let json = JSON.parse(json_script.text);
          if (json && json['@graph']) {
            let json_data = json['@graph'].filter(x => x.articleBody)[0];
            let url_json = json_data['@id'];
            if (url_json && !url_json.includes(window.location.pathname))
              refreshCurrentTab();
            let json_text = json_data.articleBody;
            let article = document.querySelector('article');
            if (json_text && article) {
              let article_new = document.createElement('p');
              article_new.setAttribute('class', 'dm-paragraph my-8 dm-article-content-width');
              article_new.innerText = json_text;
              article.appendChild(article_new);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, 1000);
  let banners = document.querySelectorAll('div.dm-slot, div[id^="taboola-feed"]');
  hideDOMElement(...banners);
}

else if (matchDomain('kurier.at')) {
  let paywall = document.querySelector('div.plusContent');
  if (paywall) {
    paywall.classList.remove('plusContent');
    window.setTimeout(function () {
      let elem_hidden = paywall.querySelectorAll('.ng-star-inserted[style="display: none;"]');
      for (let elem of elem_hidden)
        elem.removeAttribute('style');
    }, 2000);
  }
  let banners = document.querySelectorAll('div#view-offer, app-paywall, adfullbanner, outbrain');
  removeDOMElement(...banners);
}

else if (matchDomain(['shz.de', 'svz.de'])) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_access_hide('="NOT data.reduced"', '="data.reduced"', 'amp-ad, amp-embed, .ads-wrapper, #flying-carpet-wrapper');
  } else {
    amp_redirect('.paywall');
    let ads = document.querySelectorAll('div.nozmhn_ad');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('nw.de')) {
  if (!window.location.pathname.endsWith('.amp.html')) {
    amp_redirect('div[data-tracking-visible^="paywall-"]');
  } else {
    amp_unhide_access_hide('="loggedIn AND hasAbo"', '', 'amp-ad, amp-embed, . banner');
  }
}

else if (matchDomain('nwzonline.de')) {
  let paywall = document.querySelector('div.offerlist-wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = breakText(parseHtmlEntities(json.articleBody));
        let content = document.querySelector('div.article-body');
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

else if (matchDomain('nzz.ch')) {
  if (!window.location.href.includes('/amp/')) {
    amp_redirect('.dynamic-regwall');
    let ads = document.querySelectorAll('div.resor');
    hideDOMElement(...ads);
  } else {
    let amp_ads = document.querySelectorAll('amp-ad');
    hideDOMElement(...amp_ads);
  }
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

else if (matchDomain('schwaebische.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.sve-paywall-wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article_body');
    if (article)
      article.firstChild.before(googleWebcacheLink(url));
    let body = document.querySelector('body');
    if (body)
      body.removeAttribute('style');
    waitDOMAttribute('body', 'body', 'style', node => node.removeAttribute('style'), true);
  }
  let ads = document.querySelectorAll('div.fp-ad-placeholder');
  hideDOMElement(...ads);
}

else if (matchDomain('spiegel.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div[data-area="paywall"]');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div[data-area="body"]');
    if (article)
      article.insertBefore(archiveLink(url), article.firstChild);
  }
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

else if (matchDomain('vn.at')) {
  if (window.location.href.match(/\.vn\.at\/.+\/\d{4}/)) {
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
          console.log('empty');
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
              let hidden_comments = document.querySelector('div.vodl-region-article__content[hidden]');
              if (hidden_comments) {
                hidden_comments.removeAttribute('hidden');
                let blurred = hidden_comments.querySelector('div.blur');
                if (blurred)
                  blurred.classList.remove('blur');
              }
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
    let banners = document.querySelectorAll('div[id^="rm-adslot-"], div[id^="piano_rec"]');
    hideDOMElement(...banners);
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

else if (matchDomain('zeit.de')) {
  let url = window.location.href.split(/[#\?]/)[0];
  let paywall = document.querySelector('aside#paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article-body');
    if (article) {
      if (document.querySelector('head > link[rel="next"]'))
        url += '/komplettansicht';
      article.firstChild.before(archiveLink(url));
    }
    let fade = document.querySelector('div.paragraph--faded');
    if (fade)
      fade.classList.remove('paragraph--faded');
  }
}

else if (matchDomain(de_lv_domains)) {
  let paywall_topagrar = document.querySelector('div > div.paywall-package');
  let paywall_other = document.querySelector('div[id^="paymentprocess-"]');
  if (paywall_topagrar || paywall_other) {
    if (paywall_topagrar)
      removeDOMElement(paywall_topagrar.parentNode);
    else {
      let intro = document.querySelector('div.m-paywall__textFadeOut');
      removeDOMElement(paywall_other, intro);
    }
    let div_hidden = document.querySelector('div.paywall-full-content[style]');
    if (div_hidden) {
      div_hidden.removeAttribute('class');
      div_hidden.removeAttribute('style');
    }
  }
  let banners = document.querySelectorAll('.adZone');
  removeDOMElement(...banners);
}

else if (matchDomain(de_westfalen_medien_domains)) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed, section[class^="fp-ad"]');
  } else {
    amp_redirect('section.fp-article-paywall');
  }
}

else if (matchDomain(de_funke_medien_domains) || document.querySelector('a[href="https://www.funkemedien.de/"]')) {
  if (window.location.search.startsWith('?service=amp'))
    amp_unhide_access_hide('="NOT p.showRegWall AND NOT p.showPayWall"', '', 'amp-ad, amp-embed, amp-fx-flying-carpet');
  else
    sessionStorage.setItem('deobfuscate', 'true');
}

else if (matchDomain(de_madsack_domains) || document.querySelector('head > link[href*=".rndtech.de/"]')) {
  if (!window.location.search.startsWith('?outputType=valid_amp')) {
    let ads = document.querySelectorAll('div[class^="Adstyled__AdWrapper"]');
    hideDOMElement(...ads);
  } else {
    ampToHtml();
  }
}

else if (matchDomain('ruhrnachrichten.de') || document.querySelector('a.mgw-logo[href^="https://mgw.de"]')) {
  let paywall = document.querySelector('body.is_plus_article');
  if (paywall) {
    paywall.classList.remove('is_plus_article');
    let json_url;
    let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
    if (json_url_dom) {
      let json_url = json_url_dom.href;
    } else {
      let pathname = window.location.pathname;
      let article_id;
      if (pathname.includes('-p-'))
        article_id = pathname.split('-p-')[1].split('/')[0];
      if (article_id)
        json_url = 'https://' + window.location.hostname + '/wp-json/wp/v2/posts/' + article_id;
    }
    if (json_url) {
      fetch(json_url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.content.rendered;
            let content = document.querySelector('article');
            if (json_text && content) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              content.appendChild(content_new);
            }
          });
        }
      });
    }
  }
  let ads = document.querySelector('div.OUTBRAIN');
  hideDOMElement(ads);
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

function setCookie(name, value, domain, path, days) {
  window.localStorage.clear();
  var max_age = days * 24 * 60 * 60;
  document.cookie = name + "=" + (value || "") + "; domain=" + domain + "; path=" + path + "; max-age=" + max_age;
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
      element.style = 'display:none;';
  }
}

function header_nofix(header, msg = 'BPC > no fix') {
  if (header) {
    let nofix_div = document.createElement('div');
    nofix_div.setAttribute('style', 'margin: 20px; font-size: 20px; font-weight: bold; color: red;');
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

function amp_iframes_replace(weblink = false, source = '') {
  let amp_iframes = document.querySelectorAll('amp-iframe' + (source ? '[src*="'+ source + '"]' : ''));
  let par, elem;
  for (let amp_iframe of amp_iframes) {
    if (!weblink) {
      elem = document.createElement('iframe');
      Object.assign(elem, {
        src: amp_iframe.getAttribute('src'),
        height: amp_iframe.getAttribute('height'),
        width: 'auto',
        style: 'border: 0px;'
      });
      if (amp_iframe.getAttribute('sandbox'))
        elem.sandbox = amp_iframe.getAttribute('sandbox');
      amp_iframe.parentNode.replaceChild(elem, amp_iframe);
    } else {
      par = document.createElement('p');
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
    header_nofix(header, 'BPC > redirect to amp failed (disable amp-to-html extension/add-on or browser setting)');
  }
}

function amp_redirect(paywall_sel, paywall_action = '', amp_url = '') {
  let paywall = document.querySelector(paywall_sel);
  let amphtml = document.querySelector('head > link[rel="amphtml"]');
  if (!amphtml && amp_url)
    amphtml = {href: amp_url};
  if (paywall && amphtml) {
    if (!paywall_action)
      removeDOMElement(paywall);
    else {
      if (paywall_action.rm_class)
        paywall.classList.remove(paywall_action.rm_class);
      else if (paywall_action.rm_attrib)
        paywall.removeAttribute(paywall_action.rm_attrib);
    }
    amp_redirect_not_loop(amphtml);
  }
}

function amp_unhide_subscr_section(amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let preview = document.querySelectorAll('[subscriptions-section="content-not-granted"]');
  removeDOMElement(...preview);
  let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
  for (let elem of subscr_section)
    elem.removeAttribute('subscriptions-section');
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  hideDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function amp_unhide_access_hide(amp_access = '', amp_access_not = '', amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let access_hide = document.querySelectorAll('[amp-access' + amp_access + '][amp-access-hide]:not([amp-access="error"], [amp-access^="message"], .piano)');
  for (let elem of access_hide)
    elem.removeAttribute('amp-access-hide');
  if (amp_access_not) {
    let amp_access_not_dom = document.querySelectorAll('[amp-access' + amp_access_not + ']');
    removeDOMElement(...amp_access_not_dom);
  }
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  hideDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('head > link[rel="canonical"]');
    window.location.href = canonical.href;
  }, 500);
}

function refreshCurrentTab() {
  window.location.reload(true);
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (only report issue if not working for over a week):\r\n') {
  return externalLink(['archive.today', 'archive.is'], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function googleWebcacheLink(url, text_fail = 'BPC > Try for full article text:\r\n') {
  if (!matchUrlDomain([], url))
    url = url.split('?')[0];
  return externalLink(['webcache.googleusercontent.com'], 'https://{domain}/search?q=cache:{url}', url, text_fail);
}

function ext_12ftLink(url, text_fail = 'BPC > Full article text:\r\n') {
  return externalLink(['12ft.io'], 'https://{domain}/{url}', url, text_fail);
}

function externalLink(domains, ext_url_templ, url, text_fail = 'BPC > Full article text:\r\n') {
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.setAttribute('style', 'margin: 20px; font-size: 20px; font-weight: bold; color: red;');
  let parser = new DOMParser();
  text_fail = text_fail.replace(/\[([^\]]+)\]/g, "<a href='$1' target='_blank' style='color: red'>$1</a>");
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

function breakText(str) {
  str = str.replace(/(?:^|[A-Za-z\"\“\)])(\.|\?|!)(?=[A-ZÖÜ\„\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
  str = str.replace(/(([a-z]{2,}|[\"\“]))(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
  // exceptions: names with alternating lower/uppercase (no general fix)
  let str_rep_arr = ['AstraZeneca', 'BaFin', 'BerlHG', 'BfArM', 'BilMoG', 'BioNTech', 'DiGA', 'EuGH', 'FinTechRat', 'GlaxoSmithKline', 'IfSG', 'medRxiv', 'mmHg', 'PlosOne', 'StVO'];
  let str_rep_split,
  str_rep_src;
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

function replaceDomElementExt(url, proxy, base64, selector, text_fail = '', selector_source = selector) {
  let proxyurl = proxy ? '' : '';
  let article = document.querySelector(selector);
  let options = {headers: {"Content-Type": "text/plain", "X-Requested-With": "XMLHttpRequest"}};
  fetch(proxyurl + url, options)
  .then(response => {
    if (response.ok) {
      response.text().then(html => {
        if (base64) {
          html = decode_utf8(atob(html));
          selector_source = 'body';
        }
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let article_new = doc.querySelector(selector_source);
        if (article_new) {
          if (article && article.parentNode)
            article.parentNode.replaceChild(article_new, article);
        }
      });
    } else {
      console.log('no content/article');
    }
  }).catch(function (err) {
    console.log('no content/article');
  });
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

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

})();
