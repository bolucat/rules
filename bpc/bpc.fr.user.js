// ==UserScript==
// @name            Bypass Paywalls Clean - fr
// @version         3.4.3.1
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fr.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fr.user.js
// @homepageURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
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
// @match           *://*.lesoir.be/*
// @match           *://*.letemps.ch/*
// @match           *://*.levif.be/*
// @match           *://*.loeildelaphotographie.com/*
// @match           *://*.marianne.net/*
// @match           *://*.monacomatin.mc/*
// @match           *://*.parismatch.com/*
// @match           *://*.science-et-vie.com/*
// @match           *://*.sudinfo.be/*
// @grant           GM.xmlHttpRequest
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

var be_groupe_ipm_domains = ['dhnet.be', 'lalibre.be', 'lavenir.net'];
var be_roularta_domains = ['femmesdaujourdhui.be', 'flair.be', 'levif.be'];
var fr_be_groupe_rossel = ['aisnenouvelle.fr', 'courrier-picard.fr', 'lardennais.fr', 'lavoixdunord.fr', 'lesoir.be', 'lest-eclair.fr', 'liberation-champagne.fr', 'lunion.fr', 'nordlittoral.fr', 'paris-normandie.fr', 'sudinfo.be'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr'];
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
    let og_url = document.querySelector('head > meta[name="og:url"][content]');
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
  getGoogleWebcache(url, 'div.article-content__subscribe', '', 'div.article-content');
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
  getGoogleWebcache(url, 'div.post-subscribe', '', 'div.post__content');
  window.setTimeout(function () {
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
  }, 1000);
}

else if (matchDomain(fr_be_groupe_rossel)) {
  let url = window.location.href;
  let paywall = document.querySelector('div.qiota_reserve, r-panel.r-paywall--header, r-panel.r-panel--paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article');
    if (article)
      article.firstChild.before(archiveLink(url));
  }
  let ads = document.querySelectorAll('div[id^="article_"], r-pub, div#rossel-leader-top');
  hideDOMElement(...ads);
}

else if (matchDomain(fr_groupe_ebra_domains)) {
  if (!window.location.pathname.startsWith('/amp/')) {
    amp_redirect('div#paywall-dynamic');
    let ads = document.querySelectorAll('div.wrapperPub');
    hideDOMElement(...ads);
  } else {
    amp_unhide_access_hide('="access"', '="NOT access"', 'amp-ad, amp-embed');
  }
}

else if (matchDomain(fr_groupe_la_depeche_domains)) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div.paywall');
    let amphtml = document.querySelector('head > link[rel="amphtml"]');
    if (paywall) {
      removeDOMElement(paywall);
      if (amphtml)
        amp_redirect_not_loop(amphtml);
      else {
        let json_script = getArticleJsonScript();
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text);
            if (json) {
              if (json[0])
                json = json[0];
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
          } catch (err) {
            console.log(err);
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
  let ads = document.querySelectorAll('div[class^="ad-slot-"], div#poool-widget-content, div[class*="Rhoo"]');
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
    let ads = document.querySelectorAll('div[class^="ads-wrapper-"], div#poool-widget');
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

else if (matchDomain('lefigaro.fr')) {
  let url = window.location.href;
  let paywall = document.querySelector('div#fig-premium-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.fig-content-body');
    if (article)
      article.firstChild.before(archiveLink(url));
  }
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

else if (matchDomain('lemonde.fr')) {
  let url = window.location.href;
  let paywall = document.querySelector('section.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article');
    if (article)
      article.firstChild.before(archiveLink(url));
    let hide = document.querySelector('section.article__content--restricted-media');
    if (hide)
      hide.classList.remove('article__content--restricted-media');
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
    amp_redirect('div.paywall');
  }
}

else if (matchDomain('lepoint.fr')) {
  function lepoint_main() {
    function decryptVariable(a) {
      var t = ["point", "les", "payants", "top"],
      n = ["le", "avec", "articles", "c"],
      o = (function () {
        var o = [];
        for (var e = 0; e < 4; e++)
          o.push(n[e]), o.push(t[e]);
        return o
      })(),
      e = {
        stringify: function (o) {
          var e = {
            ct: o.ciphertext.toString(CryptoJS.enc.Base64)
          };
          return o.iv && (e.iv = o.iv.toString()),
          o.salt && (e.s = o.salt.toString()),
          JSON.stringify(e)
        },
        parse: function (o) {
          var e = JSON.parse(o),
          t = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(e.ct)
          });
          return e.iv && (t.iv = CryptoJS.enc.Hex.parse(e.iv)),
          e.s && (t.salt = CryptoJS.enc.Hex.parse(e.s)),
          t
        }
      };
      return JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(a), o.join(" "), {
          format: e
        }).toString(CryptoJS.enc.Utf8))
    }
    let article = document.querySelector('div#contenu');
    if (article && window.variable_article_poool)
      article.innerHTML = decryptVariable(window.variable_article_poool);
  }
  if (!matchDomain(['journal.lepoint.fr'])) {
    let paywall = document.querySelectorAll('aside.paywall');
    if (paywall.length) {
      removeDOMElement(...paywall);
      insert_script(lepoint_main);
    }
    window.setTimeout(function () {
      let ads = document.querySelectorAll('div[id*="WRAP_"], div#StickyPaywall, div#paywall-sticky, div.slotpub, div.sticky-block');
      hideDOMElement(...ads);
    }, 500);
  } else {
    let url = window.location.href;
    let paywall = document.querySelectorAll('div.accnt-cmp');
    if (paywall.length) {
      removeDOMElement(...paywall);
      let article = document.querySelector('article > section');
      if (article)
        article.firstChild.before(archiveLink(url));
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

function header_nofix(header, msg = 'BPC > no fix') {
  if (header && !document.querySelector('div#bpc_nofix')) {
    let nofix_div = document.createElement('div');
    nofix_div.id = 'bpc_nofix';
    nofix_div.style = 'margin: 20px; font-size: 20px; font-weight: bold; color: red;';
    nofix_div.innerText = msg;
    header.before(nofix_div);
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

function insert_script(func, insertAfterDom) {
  let bpc_script = document.querySelector('script#bpc_script');
  if (!bpc_script) {
    let script = document.createElement('script');
    script.setAttribute('id', 'bpc_script');
    script.appendChild(document.createTextNode('(' + func + ')();'));
    let insertAfter = insertAfterDom ? insertAfterDom : (document.body || document.head || document.documentElement);
    insertAfter.appendChild(script);
  }
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

function getGoogleWebcache(url, paywall_sel, paywall_action = '', article_sel, article_new_sel = article_sel) {
  let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split('?')[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
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
    let article = document.querySelector(article_sel);
    if (article) {
      GM.xmlHttpRequest({
        method: "GET",
        url: url_cache,
        onload: function (response) {
          let parser = new DOMParser();
          let doc = parser.parseFromString(response.responseText, 'text/html');
          let article_new = doc.querySelector(article_new_sel);
          if (article.parentNode && article_new)
            article.parentNode.replaceChild(article_new, article);
        }
      });
    }
  }
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', 'archive.is'], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function googleWebcacheLink(url, text_fail = 'BPC > Full article text:\r\n') {
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

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('head > link[rel="canonical"]');
    window.location.href = canonical.href;
  }, 500);
}

})();
