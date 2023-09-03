// ==UserScript==
// @name            Bypass Paywalls Clean - nl/be
// @version         3.3.1.6
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.nl.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.nl.user.js
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.ad.nl/*
// @match           *://*.artsenkrant.com/*
// @match           *://*.bd.nl/*
// @match           *://*.bndestem.nl/*
// @match           *://*.demorgen.be/*
// @match           *://*.destentor.nl/*
// @match           *://*.dvhn.nl/*
// @match           *://*.ed.nl/*
// @match           *://*.fd.nl/*
// @match           *://*.flair.be/nl/*
// @match           *://*.flair.nl/*
// @match           *://*.frieschdagblad.nl/*
// @match           *://*.gelderlander.nl/*
// @match           *://*.gooieneemlander.nl/*
// @match           *://*.groene.nl/*
// @match           *://*.haarlemsdagblad.nl/*
// @match           *://*.hln.be/*
// @match           *://*.hoogeveenschecourant.nl/*
// @match           *://*.humo.be/*
// @match           *://*.ijmuidercourant.nl/*
// @match           *://*.knack.be/*
// @match           *://*.kw.be/*
// @match           *://*.lc.nl/*
// @match           *://*.leidschdagblad.nl/*
// @match           *://*.libelle.be/*
// @match           *://*.libelle.nl/*
// @match           *://*.margriet.nl/*
// @match           *://*.meppelercourant.nl/*
// @match           *://*.nieuweooststellingwerver.nl/*
// @match           *://*.nieuwsbladnof.nl/*
// @match           *://*.noordhollandsdagblad.nl/*
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
var nl_mediahuis_region_domains = ['gooieneemlander.nl', 'haarlemsdagblad.nl', 'ijmuidercourant.nl', 'leidschdagblad.nl', 'noordhollandsdagblad.nl'];

if (matchDomain('fd.nl')) {
  let url = window.location.href;
  let paywall = document.querySelectorAll('section.upsell, div.upsell-modal-background');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let article = document.querySelector('article');
    if (article)
      article.firstChild.before(archiveLink(url));
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
    let ads = document.querySelectorAll('div.rmgAd');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('groene.nl')) {
  let url = window.location.href;
  let paywall = document.querySelector('div#closed-block');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('section.article-wrapper');
    if (article)
      article.firstChild.before(ext_12ftLink(url));
  }
}

else if (matchDomain(['lc.nl', 'dvhn.nl']) || document.querySelector('link[href*=".ndcmediagroep.nl/"]')) {
  if (true) {
    let paywall = document.querySelector('div.signupPlus, div.pw-wrapper');
    if (paywall) {
      let intro = document.querySelector('div.startPayWall');
      removeDOMElement(paywall, intro);
      let html = document.documentElement.outerHTML;
      if (html.includes('window.__NUXT__=')) {
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
            try {
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
                    } else if (child.children && child.children.length && child.children[0].text && child.children[0].text.length > 2) {
                      if ((child.href && child.href.length > 2) || (child.relation && child.relation.follow && child.relation.follow.url)) {
                        let par_link = document.createElement('a');
                        par_link.href = child.href || child.relation.follow.url;
                        par_link.innerText = child.children[0].text;
                        elem.appendChild(par_link);
                      } else {
                        addParText(elem, child.children[0].text);
                      }
                    }
                  }
                } else if (par.typename.length > 2)
                  console.log(par);
                if (elem.hasChildNodes()) {
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
  }
  let ads = document.querySelectorAll('.top__ad, .marketingblock-article');
  removeDOMElement(...ads);
}

else if (matchDomain(nl_mediahuis_region_domains)) {
  window.setTimeout(function () {
    let close_button = document.querySelector('button[data-testid="button-close"]');
    if (close_button)
      close_button.click();
    let premium = document.querySelector('div.common-components-plus_pluslabel--container');
    if (premium) {
      let hidden_article = document.querySelector('div[data-auth-body="article"]');
      if (hidden_article)
        hidden_article.removeAttribute('style');
      let paywall = document.querySelector('div[data-auth-root="paywall"]');
      removeDOMElement(paywall);
      let auth_body = document.querySelector('div[data-auth-body="article"]');
      if (paywall && auth_body) {
        let auth_body_par_count = auth_body.querySelectorAll('p');
        if (auth_body_par_count.length < 2) {
          let json_script = document.querySelector('script[data-fragment-type="PacoArticleContent"]');
          let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
          try {
            let json = JSON.parse(json_str);
            let article = Object.values(json)[0]['data']['article']['body'];
            auth_body.innerHTML = '';
            let par_html, par_dom, par_elem, par_div, par_key;
            let parser = new DOMParser();
            for (let par of article) {
              for (let key in par) {
                par_dom = document.createElement('p');
                par_elem = '';
                par_key = par[key];
                if (key === 'subhead') {
                  par_html = parser.parseFromString('<div><strong>' + par_key + '</strong></div>', 'text/html');
                  par_elem = par_html.querySelector('div');
                } else if (key === 'twitter' || key === 'instagram') {
                  par_elem = document.createElement('a');
                  Object.assign(par_elem, {
                    href: par_key,
                    innerText: par_key.split('?')[0],
                    target: '_blank'
                  });
                } else if (key === 'youtube') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://www.youtube.com/embed/' + par_key.id,
                    id: 'ytplayer',
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'streamone') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://content.tmgvideo.nl/embed/item=' + par_key.id,
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'image') {
                  par_elem = document.createElement('div');
                  let par_img = document.createElement('img');
                  par_img.src = par_key.url;
                  par_elem.appendChild(par_img);
                  par_div = document.createElement('div');
                  par_div.innerText = par[key].caption ? par[key].caption : '';
                  par_div.innerText += par[key].credit ? '\n' + par[key].credit : '';
                  par_elem.appendChild(par_div);
                } else {
                  par_html = parser.parseFromString('<p style="font-size: 18px; line-height: 1.625;">' + par_key + '</div>', 'text/html');
                  par_elem = par_html.querySelector('p');
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
                auth_body.appendChild(par_dom);
              }
            }
          } catch (err) {
            console.warn('unable to parse text');
            console.warn(err);
          }
        }
      }
    }
  }, 500);
}

else if (matchDomain(nl_dpg_adr_domains.concat(['hln.be']))) {
  let url = window.location.href;
  let paywall = document.querySelector('div#remaining-paid-content');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article__body');
    if (article)
      article.firstChild.before(archiveLink(url));
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
      let apollo_script;
      for (let script of scripts) {
        if (script.text.includes('window.__APOLLO_STATE__=')) {
          apollo_script = script;
          break;
        }
      }
      if (apollo_script) {
        removeDOMElement(node);
        try {
          let apollo_json = JSON.parse(apollo_script.text.replace(/(^window.__APOLLO_STATE__=|;$)/g, ''));
          let start = false;
          for (let key in apollo_json) {
            let elem = apollo_json[key];
            if (!start) {
              if (key.includes('.introBlocks.'))
                start = true;
            } else {
              let typename = elem.__typename;
              if (key.startsWith('Article:') || ['ArticleAuthorBiography'].includes(typename))
                break;
              else {
                let par = document.createElement('p');
                if (typename === 'HtmlBlock') {
                  let item = document.createElement('p');
                  item.innerText = elem.contentHTML.replace(/((<|\\u003c)([^>]+)(>|\\u003e))/gi, '');
                  item.style = par_style;
                  par.appendChild(item);
                } else if (typename === 'SubheadBlock') {
                  let item = document.createElement('p');
                  item.innerText = elem.text.replace(/((<|\\u003c)([^>]+)(>|\\u003e))/gi, '');
                  item.style = par_style;
                  par.appendChild(item);
                } else if (typename === 'Image') {
                  let figure = document.createElement('figure');
                  let img = document.createElement('img');
                  img.src = elem.url.startsWith('https:') ? elem.url : 'https:' + elem.url;
                  img.width = !mobile ? 640 : 320;
                  figure.appendChild(img);
                  if (elem.description) {
                    let caption = document.createElement('figcaption');
                    caption.innerText = elem.description + (elem.copyright ? ' | ' + elem.copyright : '');
                    figure.appendChild(caption);
                  }
                  par.appendChild(figure);
                } else if (typename === 'Article') {
                  let item = document.createElement('a');
                  item.href = elem.url.startsWith('https:') ? elem.url : 'https:' + elem.url;
                  item.innerText = elem.title;
                  par.appendChild(item);
                } else if (!['ImageBlock', 'InlineRelatedArticlesBlock', 'Video', 'Webshop'].includes(typename))
                  console.log(elem);
                if (par.childNodes) {
                  div_main.appendChild(par); ;
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
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
                text_array.forEach(p_text => {
                  let p_div = document.createElement('p');
                  p_div.innerText = p_text;
                  p_div.style = par_style;
                  div_elem.appendChild(p_div);
                });
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
  let paywall = document.querySelector('div.content__message-no-access-container');
  if (paywall) {
    let content_restriction = document.querySelector('div.content__restriction');
    removeDOMElement(paywall, content_restriction);
    let body = document.querySelector('body');
    if (body)
      body.style = 'height:auto !important;';
    let article_content = document.querySelector('section[data-article-content-element]');
    if (article_content)
      article_content.style = 'max-height:none !important;';
    let json_url_dom = document.querySelector('link[rel="alternate"][type="application/json"][href]');
    if (json_url_dom) {
      let json_url = json_url_dom.href;
      fetch(json_url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.content.rendered;
            let content = document.querySelector('div[data-article-content-target]');
            if (json_text && content) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div data-article-content-target>' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              content.parentNode.replaceChild(content_new, content);
            }
          });
        }
      });
    }
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

function archiveLink(url, text_fail = 'BPC > Full article text (only report issue if not working for over a week):\r\n') {
  return externalLink(['archive.today', 'archive.is'], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function googleWebcacheLink(url, text_fail = 'BPC > Full article text:\r\n') {
  return externalLink(['webcache.googleusercontent.com'], 'https://{domain}/search?q=cache:{url}', url, text_fail);
}

function ext_12ftLink(url, text_fail = 'BPC > Full article text:\r\n') {
  return externalLink(['12ft.io'], 'https://{domain}/{url}', url, text_fail);
}

function externalLink(domains, ext_url_templ, url, text_fail = 'BPC > Full article text:\r\n') {
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.setAttribute('style', 'margin: 20px; font-weight: bold; color:red;');
  text_fail_div.appendChild(document.createTextNode(text_fail));
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

})();
