// ==UserScript==
// @name            Bypass Paywalls Clean - fr
// @version         3.3.2.8
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fr.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fr.user.js
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.fr/*
// @match           *://*.arcinfo.ch/*
// @match           *://*.bienpublic.com/*
// @match           *://*.connaissancedesarts.com/*
// @match           *://*.dhnet.be/*
// @match           *://*.femmesdaujourdhui.be/*
// @match           *://*.flair.be/fr/*
// @match           *://*.journaldunet.com/*
// @match           *://*.la-croix.com/*
// @match           *://*.lacote.ch/*
// @match           *://*.lalibre.be/*
// @match           *://*.lavenir.net/*
// @match           *://*.ledauphine.com/*
// @match           *://*.ledevoir.com/*
// @match           *://*.legrandcontinent.eu/*
// @match           *://*.lejsl.com/*
// @match           *://*.lenouvelliste.ch/*
// @match           *://*.lesinrocks.com/*
// @match           *://*.letemps.ch/*
// @match           *://*.levif.be/*
// @match           *://*.loeildelaphotographie.com/*
// @match           *://*.marianne.net/*
// @match           *://*.monacomatin.mc/*
// @match           *://*.parismatch.com/*
// @match           *://*.science-et-vie.com/*
// @match           *://*.sudinfo.be/*
// @match           *://webcache.googleusercontent.com/*
// ==/UserScript==

(function() {
  'use strict';

if (matchDomain('webcache.googleusercontent.com')) {
  window.setTimeout(function () {
    if (window.location.search.includes('q=cache:https://www.letemps.ch')) {
      let lazy_images = document.querySelectorAll('img.lazy[src="/placeholder.png"][data-src]');
      for (let elem of lazy_images) {
        elem.src = elem.getAttribute('data-src');
        elem.removeAttribute('class');
      }
      let fade = document.querySelector('div.post__content--faded');
      if (fade)
        fade.classList.remove('post__content--faded');
      let ads = document.querySelectorAll('div.topad');
      hideDOMElement(...ads);
    }
  }, 1000);
}

window.setTimeout(function () {

var be_groupe_ipm_domains = ['dhnet.be', 'lalibre.be', 'lavenir.net'];
var be_roularta_domains = ['femmesdaujourdhui.be', 'flair.be', 'levif.be'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
var fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr', 'rugbyrama.fr'];
var fr_groupe_nice_matin_domains = ['monacomatin.mc', 'nicematin.com', 'varmatin.com'];
var domain;

if (matchDomain('alternatives-economiques.fr')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('#temp-paywall');
    removeDOMElement(paywall);
    let data_ae_poool = document.querySelector('div[data-ae-poool]');
    if (data_ae_poool)
      data_ae_poool.removeAttribute('style');
  }, 1000); // Delay (in milliseconds)
}

else if (matchDomain(['arcinfo.ch', 'lacote.ch', 'lenouvelliste.ch'])) {// Groupe ESH Médias
  let paywall = document.querySelector('section#paywall-articles');
  if (paywall) {
    removeDOMElement(paywall);
    let url_id = window.location.pathname.match(/\d+$/).pop();
    let html = document.documentElement.outerHTML;
    let og_url = document.querySelector('meta[name="og:url"][content]');
    if (og_url && !og_url.content.endsWith(url_id))
      refreshCurrentTab();
    let json;
    if (html.includes('window.__NUXT__='))
      json = html.split('window.__NUXT__=')[1].split('</script>')[0].trim().replace(/blocs:\[\{.*?\}\],/g, '');
    let article = document.querySelector('div.html-content');
    let no_intro = false;
    if (!article) {
      article = document.querySelector('div.container-mobile-full');
      no_intro = true;
    }
    if (article && json) {
      let content = '';
      if (json.includes('text_1="'))
        content = json.split('text_1="').pop().split('";')[0];
      else {
        let parts = json.split('html:"');
        parts.splice(0, 1);
        for (let part of parts)
          content += part.split('",has_pre_content')[0];
      }
      if (content) {
        content = content.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u002F/g, '/').replace(/\\"/g, '"').replace(/\\r\\n/g, '');
        let parser = new DOMParser();
        let content_new = parser.parseFromString('<div class="html-content">' + content + '</div>', 'text/html');
        let article_top;
        if (!no_intro) {
          article_top = article.parentNode.parentNode;
          removeDOMElement(article.parentNode);
        } else
          article_top = article;
        article_top.appendChild(content_new.querySelector('div'));
      } else {
        refreshCurrentTab();
      }
    }
  }
}

else if (matchDomain('atlantico.fr')) {
  let paywall = document.querySelector('div.markup[class*="Paywall"]');
  if (paywall)
    paywall.setAttribute('class', 'markup');
}

else if (matchDomain(be_groupe_ipm_domains)) {
  let paywall = document.querySelector('div.is-preview');
  if (paywall) {
    paywall.classList.remove('is-preview');
    window.setTimeout(function () {
      let div_hidden = document.querySelector('div.is-hidden');
      if (div_hidden)
        div_hidden.classList.remove('is-hidden');
    }, 500);
  }
  let ads = document.querySelectorAll('div.ap-AdContainer, div.ap-Outbrain');
  hideDOMElement(...ads);
}

else if (matchDomain(['challenges.fr', 'sciencesetavenir.fr'])) {
  if (window.location.pathname.endsWith('.amp')) {
    amp_unhide_access_hide('="paywall.access OR cha.access"', '="NOT (paywall.access OR cha.access)"');
  } else {
    let amorce = document.querySelector('div.amorce.manual');
    hideDOMElement(amorce);
    let content = document.querySelectorAll('.user-paying-content');
    for (let elem of content) {
      elem.classList.remove('user-paying-content');
      elem.removeAttribute('hidden');
    }
    let paywall = document.querySelector('.temp-paywall');
    removeDOMElement(paywall);
    let ads = document.querySelectorAll('div[class^="pub-container"], div[id^="moneytag-"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('charliehebdo.fr')) {
  window.setTimeout(function () {
    let paywalled_content = document.querySelector('div.ch-paywalled-content');
    if (paywalled_content)
      paywalled_content.removeAttribute('style');
    let poool_widget = document.querySelector('div#poool-widget');
    removeDOMElement(poool_widget);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('cieletespace.fr')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.article-content__subscribe');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article-content');
    if (article)
      article.firstChild.before(googleWebcacheLink(url));
  }
}

else if (matchDomain('connaissancedesarts.com')) {
  let ads = document.querySelectorAll('div.ad-container');
  hideDOMElement(...ads);
}

else if (matchDomain('elle.fr')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_access_hide('="poool.access OR cmi_premium.access"');
  } else {
    let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let hidden_image of hidden_images)
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    let subscription_bar = document.querySelector('.tc-subscription-bar');
    removeDOMElement(subscription_bar);
  }
}

else if (matchDomain('letemps.ch')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.post-subscribe');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.post__content');
    if (article)
      article.firstChild.before(googleWebcacheLink(url));
  }
  let ads = document.querySelectorAll('div.topad');
  hideDOMElement(...ads);
}

else if (matchDomain('sudinfo.be')) {
  let paywall = document.querySelector('div.r-blurred');
  if (paywall) {
    let paywall_header = document.querySelector('.r-paywall--header');
    let intro = document.querySelector('div.r-not-blurred');
    removeDOMElement(paywall, paywall_header, intro);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody.replace(/&nbsp;/g, '').replace(/\[.*\]/, '');
        let content = document.querySelector('article');
        if (json_text && content) {
          let par = document.createElement('p');
          par.innerText = '\r\n' + json_text;
          content.appendChild(par);
        }
      }
    }
  }
  let ads = document.querySelectorAll('div[id^="article_"], r-pub, div#rossel-leader-top');
  hideDOMElement(...ads);
}

else if (matchDomain(fr_groupe_ebra_domains)) {
  if (!window.location.pathname.startsWith('/amp/')) {
    let paywall = document.querySelector('div.preview');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  } else {
    amp_unhide_access_hide('="access"', '="NOT access"', 'amp-ad, amp-embed');
  }
}

else if (matchDomain(fr_groupe_la_depeche_domains)) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div.paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall) {
      removeDOMElement(paywall);
      if (amphtml)
        window.location.href = amphtml.href;
      else {
        let json_script = getArticleJsonScript();
        if (json_script) {
          let json = JSON.parse(json_script.text);
          if (json) {
            let json_text = parseHtmlEntities(json.articleBody);
            let content = document.querySelector('div.article-full__body-content');
            if (json_text && content) {
              content.innerHTML = '';
              let article_new = document.createElement('p');
              article_new.innerText = json_text;
              content.appendChild(article_new);
              content.removeAttribute('style');
              content.removeAttribute('data-state');
            }
          }
        }
      }
    }
  }
}

else if (matchDomain(fr_groupe_nice_matin_domains)) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_access_hide('="access"', '="NOT access"', 'amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div#article-teaser');
    if (paywall)
      paywall.removeAttribute('id');
  }
  let ads = document.querySelectorAll('div[class^="ad-slot-"]');
  hideDOMElement(...ads);
}

else if (matchDomain('humanite.fr')) {
  if (window.location.search.startsWith('?amp')) {
    let qiota_script = document.querySelector('amp-script[src^="https://www.qiota.com/"]');
    if (qiota_script) {
      let amphtml_fill_content = qiota_script.querySelector('div.i-amphtml-fill-content');
      if (amphtml_fill_content)
        amphtml_fill_content.removeAttribute('class');
      let i_amphtml_sizer = qiota_script.querySelector('i-amphtml-sizer');
      removeDOMElement(i_amphtml_sizer);
    }
  } else {
    let banner = document.querySelector('div.qiota');
    removeDOMElement(banner);
  }
}

else if (matchDomain('journaldunet.com')) {
  let reg_wall = document.querySelector('.reg_wall');
  removeDOMElement(reg_wall);
  let entry_reg_wall = document.querySelector('.entry_reg_wall');
  if (entry_reg_wall) {
    entry_reg_wall.removeAttribute('style');
  }
}

else if (matchDomain('la-croix.com')) {
  let url = window.location.href;
  if (!url.includes('la-croix.com/amp/')) {
    let ads = document.querySelectorAll('div[class^="ads-wrapper-"]');
    hideDOMElement(...ads);
  } else {
    let paywall_block = document.querySelector('#paywall_block');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    hideDOMElement(paywall_block, ...amp_ads);
  }
}

else if (matchDomain('lanouvellerepublique.fr')) {
  window.localStorage.clear();
  let alert_didacticiel = document.querySelector('div.alert-didacticiel');
  let loading = document.querySelectorAll('span.loading');
  removeDOMElement(alert_didacticiel, ...loading);
}

else if (matchDomain('lecourrierdesstrateges.fr')) {
  let paywall = document.querySelector('div.jpw-truncate-btn');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let content = document.querySelector('div.content-inner');
        if (json_text && content) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          content.parentNode.replaceChild(content_new, content);
          let hidden_images = document.querySelectorAll('img[src][srcset]');
          for (let elem of hidden_images)
            elem.removeAttribute('srcset');
          let entry_content = document.querySelector('div.entry-content[style]');
          if (entry_content)
            entry_content.removeAttribute('style');
        }
      }
    }
  }
}

else if (matchDomain('ledevoir.com')) {
  setCookie('pw6', '', 'ledevoir.com', '/', 0);
  let counter = document.querySelector('.paywall-breakpoint-wrapper');
  removeDOMElement(counter);
}

else if (matchDomain('legrandcontinent.eu')) {
  let paywall = document.querySelector('body.paywall, body.pw, body.softwall');
  if (paywall)
    paywall.classList.remove('paywall', 'pw', 'softwall');
  let banners = document.querySelectorAll('div#fix-pw, div.disposableBanner');
  removeDOMElement(...banners);
}

else if (matchDomain(['lejdd.fr', 'parismatch.com', 'public.fr'])) {
  let poool_banners = document.querySelectorAll('#poool-container, #poool-widget-content, #poool-widget');
  let forbidden = document.querySelector('.forbidden');
  let ads = document.querySelectorAll('div[class^="lmn-"]');
  hideDOMElement(...poool_banners, forbidden, ...ads);
  let bottom_hide = document.querySelector('.cnt[data-poool-mode="hide"]');
  if (bottom_hide) {
    bottom_hide.removeAttribute('data-poool-mode');
    bottom_hide.removeAttribute('style');
  }
}

else if (matchDomain('lemagit.fr')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let banners = document.querySelectorAll('p#firstP, div#inlineRegistrationWrapper');
    removeDOMElement(...banners);
  }
}

else if (matchDomain('leparisien.fr')) {
  let paywall = document.querySelector('div.paywall');
  if (window.location.pathname.startsWith('/amp/')) {
    if (paywall) {
      let paywall_sticky = document.querySelector('div.paywall-sticky');
      removeDOMElement(paywall, paywall_sticky);
      let section_hidden = document.querySelectorAll('section[hidden]');
      for (let elem of section_hidden)
        elem.removeAttribute('hidden');
      let mask = document.querySelector('.amp-premium-first-content');
      if (mask)
        mask.classList.remove('amp-premium-first-content');
    }
  } else {
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('lesechos.fr')) {
  if (window.location.pathname.startsWith('/amp/')) {
    ampToHtml();
  } else {
    window.setTimeout(function () {
      let abo_banner = document.querySelector('div[class*="pgxf3b-2"]');
      let ad_blocks = document.querySelectorAll('[class*="jzxvkd"]');
      hideDOMElement(...ad_blocks);
      if (abo_banner) {
        removeDOMElement(abo_banner);
        let url = window.location.href;
        let html = document.documentElement.outerHTML;
        try {
          let split1 = html.split(/window\.__REACT_QUERY_STATE__\s?=/)[1];
          let state = split1.split('</script>')[0].trim().replace(/;$/, '');
          let data = JSON.parse(state);
          let data_article = data.queries[1].state;
          let url_loaded = data_article.data.path;
          if (url_loaded && (!url_loaded.slice(-7).match(/\d+/) || !url.includes(url_loaded.slice(-7))))
            refreshCurrentTab();
          else {
            let article = data_article.data.stripes[0].mainContent[0].data.description.replace(/allowfullscreen='(true)?'/g, '');
            let paywallNode = document.querySelector('.post-paywall');
            if (paywallNode) {
              let contentNode = document.createElement('div');
              let parser = new DOMParser();
              let article_html = parser.parseFromString('<div>' + article + '</div>', 'text/html');
              let article_par = article_html.querySelector('div');
              if (article_par) {
                contentNode.appendChild(article_par);
                contentNode.className = paywallNode.className;
                paywallNode.before(contentNode);
                removeDOMElement(paywallNode);
                let paywallLastChildNode = document.querySelector('.post-paywall  > :last-child');
                if (paywallLastChildNode) {
                  paywallLastChildNode.setAttribute('style', 'height: auto !important; overflow: hidden !important; max-height: none !important;');
                }
              }
            }
            let styleElem = document.head.appendChild(document.createElement('style'));
            styleElem.innerHTML = ".post-paywall::after {height: auto !important;}";
          }
        } catch (err) {
          console.log(err);
        }
      }
    }, 500);
  }
}

else if (matchDomain('lesinrocks.com')) {
  if (window.location.search.match(/(\?|&)amp/)) {
    let size_defined = document.querySelector('amp-script.i-amphtml-layout-size-defined');
    if (size_defined)
      size_defined.style = 'overflow:visible !important;';
    let overlays = document.querySelectorAll('section.learn_more, div.sidebar, div.menu-footer, div.tooltip_bib, footer.content-info');
    removeDOMElement(...overlays);
  }
}

else if (matchDomain('letelegramme.fr')) {
  let paywall = document.querySelectorAll('div.tlg-paywalled');
  for (let elem of paywall)
    elem.classList.remove('tlg-paywalled');
  let ads = document.querySelectorAll('div[id^="pub_"]');
  hideDOMElement(...ads);
}

else if (matchDomain(be_roularta_domains)) {
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
  if (!window.navigator.userAgent.toLowerCase().includes('chrome') && window.location.href.match(/\/((\w)+(\-)+){3,}/)) {
    let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-lazy-src]');
    for (let elem of lazy_images) {
      elem.src = elem.getAttribute('data-lazy-src');
    }
  }
  let ads = document.querySelectorAll('div.rmgAd');
  hideDOMElement(...ads);
}

else if (matchDomain('lexpress.fr')) {
  let ads = document.querySelectorAll('div[class^="block_pub"], div.bottom-bar-full, div.tead, div.ban-bottom, div.placeholder--ban-atf');
  hideDOMElement(...ads);
}

else if (matchDomain('loeildelaphotographie.com')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
  }
  let premium_pic_boxes = document.querySelectorAll('.premium-pic-box');
  let banners = document.querySelectorAll('.membership-promo-container, .login_form_litle');
  removeDOMElement(...premium_pic_boxes, ...banners);
  let blurred_images = document.querySelectorAll('img[style*="blur"]');
  for (let blurred_image of blurred_images)
    blurred_image.removeAttribute('style');
}

else if (matchDomain('marianne.net')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    let article_source = document.querySelector('div.article-body[data-content-src]');
    if (article_source) {
      let article_text = decode_utf8(atob(article_source.getAttribute('data-content-src')));
      let parser = new DOMParser();
      let html = parser.parseFromString('<div>' + article_text + '</div>', 'text/html');
      let article = html.querySelector('div');
      article_source.innerHTML = '';
      article_source.appendChild(article);
      article_source.removeAttribute('data-content-src');
    }
    removeDOMElement(paywall);
  }
}

else if (matchDomain('science-et-vie.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    let pars = document.querySelectorAll('.qiota_reserve > p, .qiota_reserve > h2');
    let pars_text = [];
    for (let par of pars) {
      if (pars_text.includes(par.innerText))
        removeDOMElement(par);
      else
        pars_text.push(par.innerText);
    }
    let sizer = document.querySelector('div.article-content > amp-script > i-amphtml-sizer');
    removeDOMElement(sizer);
    let replaced_content = document.querySelector('div.i-amphtml-replaced-content');
    if (replaced_content)
      replaced_content.removeAttribute('class');
  }
}

else if (matchDomain(['sudouest.fr', 'charentelibre.fr', 'larepubliquedespyrenees.fr'])) {
  let paywall = document.querySelectorAll('.visible-not-premium');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let visible_premium = document.querySelectorAll('div.visible-premium');
    for (let elem of visible_premium)
      elem.classList.remove('visible-premium');
  }
  window.setTimeout(function () {
    let footer_premium = document.querySelector('.footer-premium');
    let ads = document.querySelectorAll('div.pub, div.ph-easy-subscription');
    hideDOMElement(footer_premium, ...ads);
  }, 500);
}

else if (matchDomain('lamontagne.fr') || document.querySelector('ul.list-inline > li > a[href="https://www.centrefrance.com/"]')) {// Groupe Centre France
  let paywall = document.querySelector('div#poool-widget');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let content = document.querySelector('div.entry-content');
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
      element.style = 'display:none !important;';
  }
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

function refreshCurrentTab() {
  window.location.reload(true);
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

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('link[rel="canonical"]');
    window.location.href = canonical.href;
  }, 500);
}

})();
