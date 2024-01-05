// ==UserScript==
// @name            Bypass Paywalls Clean - nl/be
// @version         3.4.9.0
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.nl.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.nl.user.js
// @homepageURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.ad.nl/*
// @match           *://*.artsenkrant.com/*
// @match           *://*.bd.nl/*
// @match           *://*.bndestem.nl/*
// @match           *://*.businessam.be/*
// @match           *://*.businessinsider.nl/*
// @match           *://*.demorgen.be/*
// @match           *://*.destentor.nl/*
// @match           *://*.doorbraak.be/*
// @match           *://*.dvhn.nl/*
// @match           *://*.ed.nl/*
// @match           *://*.fd.nl/*
// @match           *://*.flair.be/nl/*
// @match           *://*.flair.nl/*
// @match           *://*.frieschdagblad.nl/*
// @match           *://*.gelderlander.nl/*
// @match           *://*.groene.nl/*
// @match           *://*.hoogeveenschecourant.nl/*
// @match           *://*.humo.be/*
// @match           *://*.knack.be/*
// @match           *://*.kw.be/*
// @match           *://*.lc.nl/*
// @match           *://*.libelle.be/*
// @match           *://*.libelle.nl/*
// @match           *://*.margriet.nl/*
// @match           *://*.meppelercourant.nl/*
// @match           *://*.nieuweooststellingwerver.nl/*
// @match           *://*.nieuwsbladnof.nl/*
// @match           *://*.nrc.nl/*
// @match           *://*.parool.nl/*
// @match           *://*.pzc.nl/*
// @match           *://*.steenwijkercourant.nl/*
// @match           *://*.stellingwerf.nl/*
// @match           *://*.telegraaf.nl/*
// @match           *://*.trouw.nl/*
// @match           *://*.tubantia.nl/*
// @match           *://*.vn.nl/*
// @match           *://*.volkskrant.nl/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         archive.fo
// @connect         webcache.googleusercontent.com
// @grant           GM.xmlHttpRequest
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce = true;

var be_roularta_domains = ['artsenkrant.com', 'beleggersbelangen.nl', 'flair.be', 'knack.be', 'kw.be', 'libelle.be'];
var nl_dpg_adr_domains = ['ad.nl', 'bd.nl', 'bndestem.nl', 'destentor.nl', 'ed.nl', 'gelderlander.nl', 'pzc.nl', 'tubantia.nl'];
var nl_dpg_media_domains = ['demorgen.be', 'flair.nl', 'humo.be', 'libelle.nl', 'margriet.nl', 'parool.nl', 'trouw.nl', 'volkskrant.nl'];

if (matchDomain('businessam.be')) {
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

else if (matchDomain('fd.nl')) {
  let url = window.location.href;
  let paywall = document.querySelectorAll('section.upsell, div.upsell-modal-background');
  if (paywall.length) {
    removeDOMElement(...paywall);
    getArchive(url, 'main');
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
    if (!window.navigator.userAgent.toLowerCase().includes('chrome') && !matchDomain(['artsenkrant.com', 'kw.be']) && window.location.href.match(/\/((\w)+(\-)+){3,}/)) {
      let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-lazy-src]');
      for (let elem of lazy_images) {
        elem.src = elem.getAttribute('data-lazy-src');
      }
    }
  }
  let ads = document.querySelectorAll('div.rmgAd, div.c-header__ad');
  hideDOMElement(...ads);
}

else if (matchDomain('groene.nl')) {
  let url = window.location.href;
  let paywall = document.querySelector('div#closed-block');
  if (paywall) {
    removeDOMElement(paywall);
    getArchive(url, 'article');
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
        let url_nuxt = json.includes(',canonical:"') ? json.split(',canonical:"')[1].match(/\d+\.(html|ece)/)[0] : false;
        if (!url_nuxt)
          url_nuxt = json.match(/[(,]null,/) ? json.split(/[(,]null,/)[1].match(/\d+\.(html|ece)/)[0] : false;
        if (url_nuxt && !window.location.pathname.includes(url_nuxt))
          refreshCurrentTab();
        else if (json.includes(',body:')) {
          let json_text = json.split(',body:')[1].split(/,(leadText|brand_key|tts):/)[0].replace(/([{,])(\w+)(?=:(["\{\[]|[\w$]{1,2}[,\}]))/g, "$1\"$2\"").replace(/(Image\\":)(\d)([,}])/g, '$1\\"$2\\"$3').replace(/\":(\[)?([\w\$\.]+)([\]},])/g, "\":$1\"$2\"$3");
          let article = document.querySelector('div.content');
          if (article) {
            article.innerHTML = '';
            let pars = JSON.parse(json_text);
            function addParText(elem, par_text, add_br = false) {
              if (par_text.length > 2) {
                let span = document.createElement('span');
                span.innerText = par_text;
                elem.appendChild(span);
                if (add_br)
                  elem.appendChild(document.createElement('br'));
              }
            }
            for (let par of pars) {
              let elem = document.createElement('p');
              if (par.code) {
                let parser = new DOMParser();
                let article_html = parser.parseFromString('<div>' + par.code + '</div>', 'text/html');
                elem = article_html.querySelector('div');
              } else if (par.insertbox_head || par.insertbox_text) {
                if (par.insertbox_head && par.insertbox_head.length > 2) {
                  addParText(elem, par.insertbox_head, true);
                }
                if (par.insertbox_text) {
                  for (let item of par.insertbox_text) {
                    if (item.children) {
                      for (let child of item.children) {
                        if (child.text) {
                          addParText(elem, child.text, true);
                        } else if (child.href && child.href.length > 2) {
                          let par_link = document.createElement('a');
                          par_link.href = child.href;
                          par_link.innerText = child.children[0].text;
                          elem.appendChild(par_link);
                          elem.appendChild(document.createElement('br'));
                        } else if (child.children) {
                          for (let sub_child of child.children) {
                            if (sub_child.text) {
                              addParText(elem, sub_child.text);
                            } else if (sub_child.children && sub_child.children.length && sub_child.children[0].text) {
                              addParText(elem, sub_child.children[0].text);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else if (par.text) {
                addParText(elem, par.text);
              } else if (par.children) {
                for (let child of par.children) {
                  if (child.relation) {
                    if (child.type === 'img' && child.relation.href) {
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
                    } else if (child.relation.link && child.relation.link.length > 2 && ((child.relation.title && child.relation.title.length > 2) || child.relation.imageAlt)) {
                      let par_link = document.createElement('a');
                      par_link.href = child.relation.link;
                      par_link.innerText = child.relation.title.length > 2 ? child.relation.title : (child.relation.imageAlt.length > 2 ? child.relation.imageAlt : child.relation.link);
                      elem.appendChild(par_link);
                    }
                  } else if (child.text) {
                    addParText(elem, child.text);
                  } else if (child.children && child.children[0]) {
                    if (child.children[0].text && child.children[0].text.length > 2) {
                      if ((child.href && child.href.length > 2) || (child.relation && child.relation.follow && child.relation.follow.url)) {
                        let par_link = document.createElement('a');
                        par_link.href = child.href || child.relation.follow.url;
                        par_link.innerText = child.children[0].text;
                        elem.appendChild(par_link);
                      } else {
                        addParText(elem, child.children[0].text);
                      }
                    } else if (child.children[0].children && child.children[0].children[0] && child.children[0].children[0].text && child.children[0].children[0].text.length > 2)
                      addParText(elem, child.children[0].children[0].text);
                  }
                }
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
  let ads = document.querySelectorAll('.top__ad, .marketingblock-article');
  hideDOMElement(...ads);
}

else if (matchDomain(nl_dpg_adr_domains)) {
  let url = window.location.href;
  let paywall = document.querySelector('div#remaining-paid-content[data-reduced="true"]');
  if (paywall) {
    removeDOMElement(paywall);
    getArchive(url, 'div.article__body', '', 'div#remaining-paid-content');
    let noscroll = document.querySelectorAll('html[style], body[style]');
    for (let elem of noscroll)
      elem.removeAttribute('style');
  }
}

else if (matchDomain(nl_dpg_media_domains)) {
  setCookie('TID_ID', '', '', '/', 0);
  let banners = document.querySelectorAll('div[data-temptation-position^="PAGE_"], div[class^="ad--"]');
  let paywall = document.querySelectorAll('[data-temptation-position^="ARTICLE_"]');
  removeDOMElement(...banners, ...paywall);
  window.setTimeout(function () {
    let elem_hidden = document.querySelectorAll('[class^="artstyle__"][style="display: none;"]');
    for (let elem of elem_hidden)
      elem.removeAttribute('style');
  }, 500);
}

else if (matchDomain('nrc.nl')) {
  setCookie('counter', '', '', '/', 0, true);
  let banners = document.querySelectorAll('div[id$="modal__overlay"], div.header__subscribe-bar, div.banner');
  removeDOMElement(...banners);
}

else if (matchDomain('telegraaf.nl')) {
  function telegraaf_main(node) {
    let article_body = document.querySelector('section.TextArticlePage__imageWrapper, section > div.DetailArticleImage');
    if (node && article_body) {
      let div_main = document.createElement('div');
      div_main.style = 'margin: 20px 0px;';
      let div_elem = document.createElement('div');
      let par_style = 'font-weight: normal; font-size: 16px; line-height: 1.5;';
      let scripts = document.querySelectorAll('script:not([src]):not([type])');
      let window_script;
      for (let script of scripts) {
        if (script.text.length > 2500 && script.text.includes('window.telegraaf.articleBodyBlocks')) {
          window_script = script;
          break;
        }
      }
      if (window_script) {
        removeDOMElement(paywall);
        let window_text = window_script.text.split('window.telegraaf.articleBodyBlocks')[1].split('window.telegraaf.')[0].replace(/(^\s?=\s?"|";$|\\")/gm, '').replace(/\\\\u003c/gm, '<');
        let parser = new DOMParser();
        let doc = parser.parseFromString('<div>' + window_text + '</div>', 'text/html');
        let article_new = doc.querySelector('div');
        let pars = article_new.querySelectorAll('p');
        for (let par of pars)
          par.style = 'margin: 10px 0px;';
        let placeholders = article_new.querySelectorAll('div.TeaserImage__placeholder');
        for (let elem of placeholders)
          elem.removeAttribute('class');
        let media = article_new.querySelectorAll('div.NewsletterForm, div.DetailArticleVideo');
        removeDOMElement(...media);
        div_main.appendChild(article_new);
      } else {
        let json_script = getArticleJsonScript();
        if (json_script) {
          removeDOMElement(node);
          try {
            let json = JSON.parse(json_script.text);
            if (json) {
              let json_text = json.articleBody;
              if (json_text) {
                let intro = document.querySelector('span[id^="articleIntro"], p.Article__intro > span:not([class])');
                if (intro)
                  json_text = json_text.replace(intro.innerText + '\n\n', '');
                let text_array = json_text.split('\\n');
                for (let p_text of text_array) {
                  let p_div = document.createElement('p');
                  p_div.innerText = p_text;
                  p_div.style = par_style;
                  div_elem.appendChild(p_div);
                };
                div_main.appendChild(div_elem);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      article_body.after(div_main);
    }
  }
  setCookie('page_count', '', '', '/', 0);
  if (window.location.href.startsWith('https://www.telegraaf.nl/error?ref=/')) {
    window.setTimeout(function () {
      window.location.href = window.location.href.split('&')[0].replace('error?ref=/', '');
    }, 500);
  }
  let refresh = document.querySelector('div[id="content"] > meta[http-equiv="refresh"]');
  if (refresh) {
    refreshCurrentTab();
  }
  let paywall = document.querySelector('div.MeteringNotification__backdrop, data-hydrate[data-name="PaywallHandler"]');
  if (paywall)
    telegraaf_main(paywall);
  else
    waitDOMElement('div.MeteringNotification__backdrop', 'DIV', telegraaf_main, true);
  let banners = document.querySelectorAll('.ArticleBodyBlocks__inlineArticleSpotXBanner, .WebpushOptin');
  removeDOMElement(...banners);
}

else if (matchDomain('vn.nl')) {
  getJsonUrl('div.content__message-no-access-container', '', 'div[data-article-content-target]', {art_append: true});
  let content_restriction = document.querySelector('div.content__restriction');
  removeDOMElement(content_restriction);
  let article_content = document.querySelector('section[data-article-content-element]');
  if (article_content) {
    article_content.style = 'max-height:none !important;';
    let body = document.querySelector('body');
    if (body)
      body.style = 'height:auto !important;';
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
      if (url.startsWith('https://webcache.googleusercontent.com'))
        text_fail = 'BPC > failed to load from Google webcache:\r\n';
      else if (url.startsWith('https://archive.'))
        text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n';
    }
    getArticleSrc(url, '', proxy, base64, selector, text_fail, selector_source, selector_archive);
  } else {
    let options = {};
    if (matchUrlDomain('espn.com', url))
      options.headers = {
        'X-Forwarded-For': randomIP(185, 185)
      };
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

function replaceDomElementExtSrc(url, url_src, html, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let article = document.querySelector(selector);
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
      let article_new = doc.querySelector(getSelectorLevel(selector_source));
      if (article_new) {
        if (article && article.parentNode) {
          if (url.startsWith('https://archive.')) {
            let arch_dom = (selector_archive !== selector) ? article_new.querySelector(selector_archive) : article_new;
            if (arch_dom) {
              arch_dom.firstChild.before(archiveLink_renew(window.location.href));
              arch_dom.firstChild.before(archiveLink(window.location.href, 'BPC > Try when layout issues (no need to report issue for external site):\r\n'));
            }
            let targets = article_new.querySelectorAll('a[target="_blank"][href^="' + window.location.origin + '"]');
            for (let elem of targets)
              elem.removeAttribute('target');
            let invalid_links = article_new.querySelectorAll('link[rel="preload"]:not([href]');
            removeDOMElement(...invalid_links);
          }
          window.setTimeout(function () {
            article.parentNode.replaceChild(article_new, article);
          }, 200);
        }
      } else
        replaceTextFail(url, article, proxy, text_fail);
    }, 200);
  } else {
    replaceTextFail(url, article, proxy, text_fail);
  }
}

function replaceTextFail(url, article, proxy, text_fail) {
  if (text_fail && article) {
    let text_fail_div = document.createElement('div');
    text_fail_div.setAttribute('style', 'margin: 0px 50px; font-weight: bold; color: red;');
    text_fail_div.appendChild(document.createTextNode(text_fail));
    if (proxy) {
      if (url.startsWith('https://archive.')) {
        text_fail_div = archiveLink(url.replace(/^https:\/\/archive\.\w{2}\//, ''));
      } else {
        let a_link = document.createElement('a');
        a_link.innerText = url;
        a_link.href = url;
        a_link.target = '_blank';
        text_fail_div.appendChild(a_link);
      }
    }
    article.firstChild.before(text_fail_div);
  }
}

function getGoogleWebcache(url, paywall_sel, paywall_action = '', selector, func_post = '', selector_source = selector) {
  let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split(/[#\?]/)[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
    clearPaywall(paywall, paywall_action);
    replaceDomElementExt(url_cache, true, false, selector, '', selector_source);
    if (func_post) {
      window.setTimeout(function () {
        func_post();
      }, 1500);
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

function getArchive(url, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let url_archive = 'https://' + archiveRandomDomain() + '/' + url.split(/[#\?]/)[0];
  replaceDomElementExt(url_archive, true, false, selector, text_fail, selector_source, selector_archive);
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', archiveRandomDomain()], 'https://{domain}?run=1&url={url}', url, text_fail);
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

function getJsonUrlText(article, callback, article_id = '') {
  let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
  let json_url = json_url_dom.href;
  if (!json_url && article_id)
    json_url = window.location.origin + '/wp-json/wp/v2/posts/' + article_id;
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
    let canonical = document.querySelector('head > link[rel="canonical"]');
    window.location.href = canonical.href;
  }, 1000);
}

function refreshCurrentTab() {
  window.location.reload(true);
}

})();
