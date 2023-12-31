// ==UserScript==
// @name            Bypass Paywalls Clean - de/at/ch
// @version         3.4.8.2
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.de.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.de.user.js
// @homepageURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.de/*
// @match           *://*.beobachter.ch/*
// @match           *://*.diepresse.com/*
// @match           *://*.faz.net/*
// @match           *://*.handelszeitung.ch/*
// @match           *://*.kurier.at/*
// @match           *://*.nzz.ch/*
// @match           *://*.profil.at/*
// @match           *://*.schweizermonat.ch/*
// @match           *://*.topagrar.at/*
// @match           *://*.topagrar.com/*
// @match           *://*.tt.com/*
// @match           *://*.vn.at/*
// @match           *://*.vol.at/*
// @match           *://*.wochenblatt.com/*
// @grant           GM.xmlHttpRequest
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

var de_funke_medien_domains = ['abendblatt.de', 'ikz-online.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
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
  let banners = document.querySelectorAll('div.piano-article');
  hideDOMElement(...banners);
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
  let ads = document.querySelectorAll('div.ad-wrapper');
  hideDOMElement(...ads);
}

else if (matchDomain('bild.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.offer-module');
  if (paywall) {
    removeDOMElement(paywall);
    getArchive(url, 'article');
  }
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

else if (matchDomain('diepresse.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.premium-content');
    if (article) {
      article.removeAttribute('class');
      let scripts = document.querySelectorAll('script:not([src]):not([type])');
      let json_script;
      for (let script of scripts) {
        if (script.text.match(/window\.contentInformation\s?=\s?/)) {
          json_script = script;
          break;
        }
      }
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text.split(/window\.contentInformation\s?=\s?/)[1].split('};')[0] + '}');
          if (json.flexmodule_list) {
            let pars = json.flexmodule_list;
            let par_first = false;
            let split = false;
            let parser = new DOMParser();
            for (let par of pars) {
              if (split) {
                if (par) {
                  let doc = parser.parseFromString('<div>' + par + '</div>', 'text/html');
                  let content_new = doc.querySelector('div');
                  article.appendChild(content_new);
                }
              } else {
                if (par)
                  par_first = true;
                else if (!par && par_first)
                  split = true;
              }
              let lazy_images = article.querySelectorAll('img.lazyload[data-src]:not([src])');
              for (let elem of lazy_images) {
                elem.removeAttribute('class');
                elem.src = elem.getAttribute('data-src')
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('faz.net')) {
  if (matchDomain('zeitung.faz.net')) {// legacy
    let paywall_z = document.querySelector('div.c-red-carpet');
    if (paywall_z) {
      removeDOMElement(paywall_z);
      let og_url = document.querySelector('head > meta[property="og:url"][content]');
      if (og_url)
        window.location.href = og_url.content;
      else
        header_nofix(document.querySelector('div.article__text'));
    }
    let sticky_advt = document.querySelector('div.sticky-advt');
    removeDOMElement(sticky_advt);
  } else {
    let paywall = document.querySelector('#paywall-form-container-outer, section.atc-ContainerPaywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url_mobile = 'https://m.faz.net' + window.location.pathname;
      try {
        GM.xmlHttpRequest({
          method: "GET",
          url: url_mobile,
          headers: {"User-agent": "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.171 Mobile Safari/537.36"},
          onload: function (response) {
            let html = response.responseText;
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let json_script = doc.querySelector('script[id="schemaOrgJson"]');
            if (json_script) {
              let json_text;
              try {
                let json = JSON.parse(json_script.text.replace(/(\r|\n)/g, ''));
                json_text = json.articleBody;
              } catch (err) {
                console.log(err);
                return;
              }
              let article_text = document.querySelector('div.art_txt.paywall, div.atc-Text.js-atc-Text');
              if (json_text && article_text) {
                let pars = article_text.querySelectorAll('p.atc-TextParagraph');
                removeDOMElement(...pars);
                json_text = breakText_headers(json_text).split("\n\n");
                for (let p_text of json_text) {
                  let elem = document.createElement("p");
                  elem.setAttribute('class', 'atc-TextParagraph');
                  if (p_text.length < 80)
                    elem.style = 'font-weight: bold;';
                  elem.innerText = p_text;
                  article_text.appendChild(elem);
                };
              } else {
                let json_script = getArticleJsonScript();
                if (json_script) {
                  let json = JSON.parse(json_script.text);
                  if (json) {
                    let json_text = json.articleBody;
                    let article_text = document.querySelectorAll('div.copy');
                    if (json_text && article_text.length) {
                      for (let elem of article_text)
                        elem.innerText = '';
                      article_text[0].innerText = json_text;
                      let copy_intro = document.querySelector('p.copy--intro');
                      removeDOMElement(copy_intro);
                    }
                  }
                }
              }
            }
		  }
        })
      } catch (err) {
        console.log(err);
      }
    }
    let lay_paysocial = document.querySelector('div.lay-PaySocial');
    let ads = document.querySelectorAll('div.iqadtile_wrapper');
    hideDOMElement(lay_paysocial, ...ads);
  }
}

else if (matchDomain('freiepresse.de')) {
  if (window.location.pathname.includes('-artikel')) {
    let url = window.location.href;
    let func_post = function () {
      let lazy_images = document.querySelectorAll('picture.lazy');
      for (let elem of lazy_images) {
        elem.removeAttribute('class');
        let source = elem.querySelector('source[data-srcset]');
        if (source) {
          let img_new = document.createElement('img');
          img_new.src = source.getAttribute('data-srcset').split(' ')[0];
          source.parentNode.replaceChild(img_new, source);
        }
      }
    }
    getGoogleWebcache(url, 'div.article-teaser', '', 'article', func_post);
  }
}

else if (matchDomain('freitag.de')) {
  let paywall = document.querySelector('div.qa-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let related = document.querySelector('div.c-teaser-plus-related--paywall');
    if (related)
      related.classList.remove('c-teaser-plus-related--paywall');
    let article = document.querySelector('div#x-article-text');
    if (article) {
      let intro = article.querySelectorAll('p');
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = breakText_headers(json.articleBody);
          let pars = json_text.split(/\n\n/g);
          if (json_text) {
            removeDOMElement(...intro);
            let article_new = document.createElement('div');
            for (let par of pars) {
              if (!par.startsWith('Placeholder ')) {
                let par_new = document.createElement('p');
                par_new.innerText = par;
                article_new.appendChild(par_new);
              }
            }
            article.appendChild(article_new);
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
              let intro_last = intro[intro.length - 1];
              par = par.trim();
              overlap = findOverlap(intro_last.innerText, par);
              if (overlap)
                intro_last.innerText = intro_last.innerText.replace(new RegExp(overlap + '$'), '') + par;
              par_first = false;
            }
            if (!overlap) {
              par_new.innerText = par;
              article.appendChild(par_new);
            }
          }
        }
      }
    }
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

else if (matchDomain(['mz.de', 'volksstimme.de'])) {
  let url = window.location.href;
  getGoogleWebcache(url, 'div.fp-paywall', '', 'div[data-t-name="Article"]');
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
    amp_redirect('a[data-event-value="paywall-overlay-click"]');
  } else {
    amp_unhide_access_hide('="loggedIn AND hasAbo"', '', 'amp-ad, amp-embed, .banner', false);
  }
}

else if (matchDomain('nzz.ch')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.dynamic-regwall');
    if (paywall) {
      removeDOMElement(paywall);
      let url = window.location.href;
      getArchive(url, 'section[data-nzz-article]');
    }
    let ads = document.querySelectorAll('div.resor');
    hideDOMElement(...ads);
  }, 2000);
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
    let fade = document.querySelector('div#cfs-paywall-container');
    hideDOMElement(fade);
  }
}

else if (matchDomain('schwaebische.de')) {
  let url = window.location.href;
  let paywall_sel = 'div > div.sve-paywall-wrapper_overlay';
  let paywall = document.querySelector(paywall_sel);
  getGoogleWebcache(url, paywall_sel, '', 'div.article_body');
  if (paywall) {
    removeDOMElement(paywall.parentNode);
    let body = document.querySelector('body[style]');
    if (body)
      body.removeAttribute('style');
    waitDOMAttribute('body', 'body', 'style', node => node.removeAttribute('style'), true);
  }
  window.setTimeout(function () {
    let ads = document.querySelectorAll('div.fp-ad-placeholder');
    hideDOMElement(...ads);
  }, 1000);
}

else if (matchDomain('schweizermonat.ch')) {
  getJsonUrl('div.entry-paywall-login', '', 'div.entry-main > div.entry__post-content');
}

else if (matchDomain('spiegel.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div[data-area="paywall"]');
  if (paywall) {
    removeDOMElement(paywall);
    getArchive(url, 'div[data-area="body"]');
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

else if (matchDomain('sueddeutsche.de')) {
  let url = window.location.href;
  let paywall;
  if (window.location.pathname.startsWith('/projekte/artikel/')) {
    paywall = document.querySelector('div.offer-page');
    if (paywall) {
      removeDOMElement(paywall);
      getArchive(url, 'main');
    }
  } else {
    paywall = document.querySelector('p.sz-article-body__paragraph--reduced');
    if (paywall) {
      paywall.removeAttribute('class');
      getArchive(url, 'div[itemprop="articleBody"]');
    }
  }
  window.setTimeout(function () {
    let ads = document.querySelectorAll('div.ad-container, er-ad-slot');
    hideDOMElement(...ads);
  }, 1500);
}

else if (matchDomain('tagesspiegel.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div#paywal, div#pw');
  if (paywall) {
    removeDOMElement(paywall);
    if (matchDomain('www.tagesspiegel.de')) {
      let url_archive = 'https://' + archiveRandomDomain() + '/' + url;
      getArchive(url, 'div#story-elements');
    } else if (matchDomain('interaktiv.tagesspiegel.de')) {
      let article = document.querySelector('div.tslr-article > p');
      if (article)
        article.firstChild.before(archiveLink(url));
    }
  }
}

else if (matchDomain('tt.com')) {
  let div_hidden = document.querySelectorAll('.exclusive-elem');
  for (let elem of div_hidden)
    elem.classList.remove('exclusive-elem');
  let ads = document.querySelectorAll('div.ad-container, div[class*="ads-container"], div.adblock-warning');
  hideDOMElement(...ads);
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

else if (matchDomain('welt.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.contains_walled_content');
  if (paywall) {
    removeDOMElement(paywall);
    getArchive(url, 'article');
  }
  let ads = document.querySelectorAll('div[data-component="Outbrain"], div[data-component="OEmbedComponent"], div[class*="c-ad"]');
  hideDOMElement(...ads);
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
  let ads = document.querySelectorAll('div.ad-wrapper, div.anyad');
  hideDOMElement(...ads);
}

else if (matchDomain('zeit.de')) {
  let url = window.location.href.split(/[#\?]/)[0];
  let paywall = document.querySelector('aside#paywall');
  if (paywall) {
    removeDOMElement(paywall);
    if (document.querySelector('head > link[rel="next"]'))
      url += '/komplettansicht';
    getArchive(url, 'article');
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
  let ads = document.querySelectorAll('div.adZone');
  hideDOMElement(...ads);
}

else if (matchDomain(de_westfalen_medien_domains)) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed, section[class^="fp-ad"]');
  } else {
    amp_redirect('section.fp-article-paywall');
  }
}

else if (matchDomain(de_funke_medien_domains)) {
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
  let pathname = window.location.pathname;
  let article_id;
  if (pathname.includes('-p-'))
    article_id = pathname.split('-p-')[1].split('/')[0];
  getJsonUrl('body.is_plus_article', {rm_class: 'is_plus_article'}, 'article', {art_append: 1, art_hold: 1, art_class: 'article__content'}, article_id);
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

function header_nofix(header, msg = 'BPC > no fix') {
  if (header && !document.querySelector('div#bpc_nofix')) {
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
    header_nofix(header, 'BPC > redirect to amp failed (disable amp-to-html extension/add-on or browser setting)');
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

function getSelectorLevel(selector) {
  if (selector.replace(/,\s+/g, ',').match(/[>\s]+/))
    selector = selector.replace(/,\s+/g, ',').split(',').map(x => x.match(/[>\s]+/) ? x + ', ' + x.split(/[>\s]+/).pop() : x).join(', ');
  return selector;
}

function getGoogleWebcache(url, paywall_sel, paywall_action = '', article_sel, func_post = '', article_new_sel = article_sel, arch_link = false, arch_link_sel = article_new_sel) {
  let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split(/[#\?]/)[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
    clearPaywall(paywall, paywall_action);
    let article = document.querySelector(article_sel);
    if (article) {
      GM.xmlHttpRequest({
        method: "GET",
        url: url_cache,
        onload: function (response) {
          let parser = new DOMParser();
          let doc = parser.parseFromString(response.responseText, 'text/html');
          let article_new = doc.querySelector(getSelectorLevel(article_new_sel));
          if (article.parentNode && article_new)
            article.parentNode.replaceChild(article_new, article);
          else if (arch_link) {
            let arch_dom = (article_new_sel !== arch_link_sel) ? article_new.querySelector(arch_link_sel) : article_new;
            if (arch_dom)
              arch_dom.firstChild.before(archiveLink_renew(window.location.href));
          }
        }
      });
      if (func_post) {
        window.setTimeout(function () {
          func_post();
        }, 500);
      }
    }
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

function getArchive(url, article_sel, text_fail = '', article_new_sel = article_sel, arch_link = true, arch_sel = article_new_sel) {
  let article = document.querySelector(article_sel);
  if (article) {
    let domain_archive = archiveRandomDomain();
    let url_archive = 'https://' + domain_archive + '/' + url.split(/[#\?]/)[0];
    GM.xmlHttpRequest({
      method: "GET",
      url: url_archive,
      onload: function (response) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.responseText, 'text/html');
        let url_arch = doc.querySelector('div.TEXT-BLOCK > a[href]');
        if (url_arch) {
          url_arch = url_arch.href;
          GM.xmlHttpRequest({
            method: "GET",
            url: url_arch,
            onload: function (response) {
              let pathname = new URL(url_arch).pathname;
              let html = response.responseText.replace(new RegExp('https:\\/\\/' + domain_archive.replace('.', '\\.') + '\\/o\\/\\w+\\/', 'g'), '').replace(new RegExp("(src=\"|background-image:url\\(')" + pathname.replace('/', '\\/'), 'g'), "$1" + 'https://' + domain_archive + pathname);
              let parser = new DOMParser();
              let doc = parser.parseFromString(html, 'text/html');
              let article_new = doc.querySelector(getSelectorLevel(article_new_sel));
              if (article_new) {
                if (arch_link) {
                  let arch_dom = (article_new_sel !== arch_sel) ? article_new.querySelector(arch_sel) : article_new;
                  if (arch_dom) {
                    arch_dom.firstChild.before(archiveLink_renew(window.location.href));
                    arch_dom.firstChild.before(archiveLink(window.location.href, 'BPC > Try when layout issues (no need to report issue for external site):\r\n'));
                  }
                }
                let targets = article_new.querySelectorAll('a[target="_blank"][href^="https://' + window.location.hostname + '"]');
                for (let elem of targets)
                  elem.removeAttribute('target');
                let invalid_links = article_new.querySelectorAll('link[rel="preload"]:not([href]');
                removeDOMElement(...invalid_links);
                article.parentNode.replaceChild(article_new, article);
              }
            }
          });
        } else {
          article.firstChild.before(archiveLink(url));
        }
      }
    });
  }
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', 'archive.is'], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function archiveLink_renew(url, text_fail = 'BPC > Only use to renew if text is incomplete or updated:\r\n') {
  return externalLink([archiveRandomDomain()], 'https://{domain}?renew=1&url={url}', url, text_fail);
}

function googleWebcacheLink(url, text_fail = 'BPC > Try for full article text:\r\n') {
  return externalLink(['webcache.googleusercontent.com'], 'https://{domain}/search?q=cache:{url}', url, text_fail);
}

function nftLink(url, text_fail = 'BPC > Full article text:\r\n') {
  return externalLink(['1ft.io'], 'https://{domain}/{url}', url, text_fail);
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

function breakText(str, headers = false) {
  str = str.replace(/(?:^|[A-Za-z\"\“\)])(\.|\?|!)(?=[A-ZÖÜ\„\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
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

function getJsonUrlText(article, callback, article_id = '') {
  let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
  let json_url = json_url_dom.href;
  if (!json_url && article_id)
    json_url = 'https://' + window.location.hostname + '/wp-json/wp/v2/posts/' + article_id;
  if (json_url) {
    fetch(json_url)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          try {
            let json_text = parseHtmlEntities(json.content.rendered);
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
}

function getJsonUrl(paywall_sel, paywall_action = '', article_sel, art_options = {}, article_id = '') {
  let paywall = document.querySelectorAll(paywall_sel);
  let article = document.querySelector(article_sel);
  if (paywall.length && article) {
    clearPaywall(paywall, paywall_action);
    getJsonUrlText(article, (json_text, article) => {
      if (json_text && article)
        getJsonUrlAdd(json_text, article, art_options);
    }, article_id);
  }
}

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

})();
