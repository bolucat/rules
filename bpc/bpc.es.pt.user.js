// ==UserScript==
// @name            Bypass Paywalls Clean - es/pt/south america
// @version         3.3.7.3
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.es.pt.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.es.pt.user.js
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.es/*
// @match           *://*.abril.com.br/*
// @match           *://*.ara.cat/*
// @match           *://*.arabalears.cat/*
// @match           *://*.cambiocolombia.com/*
// @match           *://*.clarin.com/*
// @match           *://*.cmjornal.pt/*
// @match           *://*.diaridegirona.cat/*
// @match           *://*.diariocordoba.com/*
// @match           *://*.diariocorreo.pe/*
// @match           *://*.diariovasco.com/*
// @match           *://*.elcomercio.pe/*
// @match           *://*.elconfidencial.com/*
// @match           *://*.elcorreo.com/*
// @match           *://*.elespanol.com/*
// @match           *://*.elespectador.com/*
// @match           *://*.elobservador.com.uy/*
// @match           *://*.elpais.com/*
// @match           *://*.elperiodico.com/*
// @match           *://*.elperiodicodearagon.com/*
// @match           *://*.elperiodicoextremadura.com/*
// @match           *://*.elperiodicomediterraneo.com/*
// @match           *://*.eltiempo.com/*
// @match           *://*.eltribuno.com/*
// @match           *://*.em.com.br/*
// @match           *://*.emporda.info/*
// @match           *://*.estadao.com.br/*
// @match           *://*.expansion.com/*
// @match           *://*.gestion.pe/*
// @match           *://*.globo.com/*
// @match           *://*.larioja.com/*
// @match           *://*.lasegunda.com/*
// @match           *://*.latercera.com/*
// @match           *://*.lavoz.com.ar/*
// @match           *://*.levante-emv.com/*
// @match           *://*.losandes.com.ar/*
// @match           *://*.marca.com/*
// @match           *://*.observador.pt/*
// @match           *://*.politicaexterior.com/*
// @match           *://*.record.pt/*
// @match           *://*.regio7.cat/*
// @match           *://*.revistaoeste.com/*
// @match           *://*.sabado.pt/*
// @match           *://*.uol.com.br/*
// @match           *://webcache.googleusercontent.com/*
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

var ar_grupo_clarin_domains =['clarin.com', 'lavoz.com.ar', 'losandes.com.ar'];
var es_epiberica_domains = ['diaridegirona.cat', 'diariocordoba.com', 'diariodeibiza.es', 'diariodemallorca.es', 'eldia.es', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info', 'epe.es', 'farodevigo.es', 'informacion.es', 'laopinioncoruna.es', 'laopiniondemalaga.es', 'laopiniondemurcia.es', 'laopiniondezamora.es', 'laprovincia.es', 'levante-emv.com', 'lne.es', 'mallorcazeitung.es', 'regio7.cat'];
var es_grupo_vocento_domains = ['abc.es', 'diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'lasprovincias.es', 'laverdad.es', 'lavozdigital.es'];
var es_unidad_domains = ['elmundo.es', 'expansion.com', 'marca.com'];
var pe_grupo_elcomercio_domains = ['diariocorreo.pe', 'elcomercio.pe', 'gestion.pe'];

if (window.location.hostname.match(/\.(es|pt|cat)$/) || matchDomain(['diariocordoba.com', 'diariovasco.com', 'elconfidencial.com', 'elcorreo.com', 'elespanol.com', 'elpais.com', 'elperiodico.com', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info', 'expansion.com', 'larioja.com', 'levante-emv.com', 'marca.com', 'politicaexterior.com'])) {//spain/portugal

if (matchDomain(['ara.cat', 'arabalears.cat'])) {
  if (!window.location.pathname.endsWith('.amp.html')) {
    amp_redirect('div.paywall');
    let ads = document.querySelectorAll('div.advertising');
    hideDOMElement(...ads);
  }
}

else if (matchDomain(['cmjornal.pt', 'record.pt', 'sabado.pt'])) {
  if (!window.location.pathname.includes('/amp/')) {
    amp_redirect('.bloqueio_exclusivos, .container_assinatura, .bloco_bloqueio');
  } else {
    amp_unhide_access_hide('="subscriber"', '="NOT subscriber"', 'amp-ad, amp-embed, amp-consent, .detalheAds, .exclusivos_bar');
    let amp_links = document.querySelectorAll('a[href^="https://www-cmjornal-pt.cdn.ampproject.org/c/s/"]');
    for (let amp_link of amp_links)
      amp_link.href = amp_link.href.replace('www-cmjornal-pt.cdn.ampproject.org/c/s/', '');
  }
}

else if (matchDomain('elconfidencial.com')) {
  let premium = document.querySelector('div.newsType__content--closed');
  if (premium)
    premium.classList.remove('newsType__content--closed');
  let ads = document.querySelectorAll('div[id^="mega_"], div[id^="roba_"]');
  hideDOMElement(...ads);
}

else if (matchDomain('eldiario.es')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('^="access"');
  } else {
    let ads = document.querySelectorAll('.edi-advertising, .header-ad');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('elespanol.com')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div.full-suscriptor-container');
    removeDOMElement(paywall);
    let ads = document.querySelectorAll('[id*="superior"], [class*="adv"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain(es_unidad_domains)) {
  let premium = document.querySelector('.ue-c-article__premium');
  let url = window.location.href;
  if (!window.location.hostname.match(/^amp(-[a-z]{2})?\./)) {
    if (premium) {
      removeDOMElement(premium);
      window.location.href = url.replace('/www.', '/amp.');
    }
  } else {
    amp_unhide_access_hide('="authorized=true"', '="authorized!=true"');
    amp_unhide_subscr_section('.advertising, amp-embed, amp-ad');
  }
}

else if (matchDomain('elpais.com')) {
  if (window.location.pathname.endsWith('.amp.html') || window.location.search.match(/(\?|&)outputType=amp/)) {
    amp_unhide_access_hide('="vip"], [amp-access="success"', '="NOT vip"], [amp-access="NOT success"');
  } else {
    let banners = document.querySelectorAll('div#ctn_freemium_article, div#ctn_premium_article, div.ad');
    hideDOMElement(...banners);
  }
}

else if (matchDomain('elperiodico.com')) {
  let url = window.location.href;
  if (!url.includes('amp.elperiodico.com')) {
    let div_hidden = document.querySelector('div.closed');
    if (div_hidden)
      div_hidden.classList.remove('closed');
    else {
      let paywall = document.querySelector('.ep-masPeriodico-info-login');
      removeDOMElement(paywall);
      if (paywall)
        window.location.href = url.replace('www.', 'amp.');
    }
  } else {
    let not_logged = document.querySelector('.ep-masPeriodico-info-login');
    if (not_logged) {
      removeDOMElement(not_logged);
      amp_unhide_access_hide('^="logged"', '^="NOT logged"');
    }
    window.setTimeout(function () {
      let amp_img = document.querySelectorAll('amp-img > img');
      for (let elem of amp_img) {
        if (elem.src)
          elem.src = elem.src.replace('amp.elperiodico.com/clip/', 'estaticos-cdn.elperiodico.com/clip/');
      }
    }, 3000);
  }
}

else if (matchDomain(es_grupo_vocento_domains)) {
  let paywall_sel = '.voc-paywall, .container-wall-exclusive, .cierre-suscripcion:not([style*="display: none;"])';
  let paywall = document.querySelector(paywall_sel);
  if (!window.location.pathname.endsWith('_amp.html')) {
    if (!matchDomain(['eldiariomontanes.es'])) {
      amp_redirect(paywall_sel, '', window.location.pathname.replace('.html', '_amp.html'));
    }
    let banners = document.querySelectorAll('.voc-advertising, div.ev-em-modal, span.mega-superior, .v-adv');
    hideDOMElement(...banners);
  } else {
    amp_unhide_access_hide('="result=\'ALLOW_ACCESS\'"', '="result!=\'ALLOW_ACCESS\'"', 'amp-ad, amp-embed, .v-adv');
    removeDOMElement(paywall);
    let body_top = document.querySelector('body#top');
    if (body_top)
      body_top.removeAttribute('id');
  }
}

else if (matchDomain(es_epiberica_domains)) {
  if (window.location.href.includes('.amp.html')) {
    let truncated = document.querySelector('div.article-body--truncated');
    if (truncated)
      truncated.classList.remove('article-body--truncated');
    amp_unhide_access_hide('="NOT access"], [amp-access="FALSE"', '="access"');
  } else if (window.location.hostname === 'amp.epe.es') {
    amp_unhide_access_hide('="loggedIn"', '="NOT loggedIn"', 'amp-ad, amp-embed, amp-next-page');
  } else {
    let ads = document.querySelectorAll('div.commercial-up-full__wrapper, div.sidebar--sticky__space, div[data-bbnx-id*="cxense"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('observador.pt')) {
  if (!window.location.pathname.endsWith('/amp/')) {
    amp_redirect('body.premium-article', {rm_class: "premium-article"});
    let ads = document.querySelectorAll('div.obs-ad-placeholder');
    hideDOMElement(...ads);
  } else {
    amp_unhide_subscr_section('amp-ad, amp-consent, section > .modal');
  }
}

else if (matchDomain('politicaexterior.com')) {
  let paywall = document.querySelector('div[class^="paywall-"]');
  if (paywall) {
    let article = document.querySelector('div.entry-content-text');
    let json = document.querySelector('script[type="application/ld+json"]:not([class])');
    if (json) {
      let json_text = JSON.parse(json.text).description.replace(/&amp;nbsp;/g, '');
      let article_new = document.createElement('div');
      article_new.setAttribute('class', 'entry-content-text');
      article_new.innerText = '\r\n' + json_text;
      article.parentNode.replaceChild(article_new, article);
    }
    removeDOMElement(paywall);
  }
}

else if (window.location.hostname.endsWith('.es')) {// Sport Life Ibérica sites
  if (document.querySelector('div > ul > li > a[href="https://www.sportlife.es/"]')) {
    let paywall = document.querySelector('div.c-paywall');
    if (paywall) {
      let article = document.querySelector('div.c-mainarticle__body');
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json_text = JSON.parse(json_script.text).articleBody;
        let article_new = document.createElement('div');
        article_new.innerText = json_text;
        article.parentNode.replaceChild(article_new, article);
      }
      removeDOMElement(paywall);
    }
  }
}

} else if (window.location.hostname.match(/\.(ar|br|cl|pe|uy)$/) || matchDomain(['cambiocolombia.com', 'clarin.com', 'elespectador.com', 'eltiempo.com', 'eltribuno.com', 'globo.com', 'lasegunda.com', 'latercera.com', 'revistaoeste.com'])) {//south america

if (matchDomain('abril.com.br')) {
  if (window.location.pathname.endsWith('/amp/')) {
    let paywall = document.querySelector('.piano-modal');
    removeDOMElement(paywall);
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    hideDOMElement(...amp_ads);
  } else {
    let ads = document.querySelectorAll('div.ads, div[class^="ads-"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain(ar_grupo_clarin_domains)) {
  let ads = document.querySelectorAll('div.ad-slot, div.box-adv, div.wrapperblock, div.banner, div[id^="div-gpt-ad-flotante"]');
  hideDOMElement(...ads);
  let ads_inline = document.querySelectorAll('div > div.sticky, div > div[id^="div-gpt-ad-inread"], div > div[id^="div-gpt-ad-caja"], div > div[id^="div-gpt-ad-horizontal"]');
  for (let ad of ads_inline)
    hideDOMElement(ad.parentNode);
}

else if (matchDomain('cambiocolombia.com')) {
  if (!window.location.pathname.startsWith('/amp/')) {
    let paywall = document.querySelector('div#require-access');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = '/amp' + window.location.pathname;
    }
  } else {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else if (matchDomain(pe_grupo_elcomercio_domains)) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
    paywall.removeAttribute('style');
    let fade = document.querySelector('p.story-contents--fade');
    if (fade)
      fade.classList.remove('story-contents--fade');
  }
  let ads = document.querySelectorAll('div[class^="content_gpt"]');
  hideDOMElement(...ads);
}

else if (matchDomain('elespectador.com')) {
  if (window.location.search.match(/(\?|&)outputType=amp/)) {
    amp_unhide_subscr_section('amp-ad, amp-embed, [class^="Widget"], amp-fx-flying-carpet');
  } else {
    amp_redirect('div.exclusive_validation');
  }
}

else if (matchDomain('elobservador.com.uy')) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_access_hide('="observador.mostrarNota"');
    let amp_images = document.querySelectorAll('div.fixed-container > amp-img.null');
    for (let amp_image of amp_images) {
      let elem = document.createElement('img');
      Object.assign(elem, {
        src: amp_image.getAttribute('src'),
        alt: amp_image.getAttribute('alt'),
        title: amp_image.getAttribute('title')
      });
      amp_image.parentNode.replaceChild(elem, amp_image);
    }
  } else {
    let paywall = document.querySelector('div.mensaje_member');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = window.location.pathname + '/amp';
    }
  }
}

else if (matchDomain('eltiempo.com')) {
  let modulos = document.querySelector('div.modulos');
  if (modulos)
    modulos.classList.remove('modulos');
}

else if (matchDomain('eltribuno.com')) {
  let lazy_images = document.querySelectorAll('img.lazyload[data-src]:not([src])');
  for (let elem of lazy_images) {
    elem.src = elem.getAttribute('data-src');
    elem.classList.remove('lazyload');
  }
}

else if (matchDomain('em.com.br')) {
  if (!window.location.pathname.endsWith('/amp.html')) {
    amp_redirect('.news-blocked-content');
    let ads = document.querySelectorAll('.ads, .containerads');
    hideDOMElement(...ads);
  } else {
    amp_unhide_subscr_section('amp-ad, amp-embed, amp-fx-flying-carpet');
    let compress_text = document.querySelector('div.compress-text');
    if (compress_text)
      compress_text.classList.remove('compress-text');
  }
}

else if (matchDomain('estadao.com.br')) {
  if (window.location.pathname.match(/(\.amp$|^\/amp\/)/) || window.location.search.startsWith('?amp')) {
    amp_unhide_access_hide('="outputValue=\'hide_paywall\'"', '="outputValue=\'show_paywall\'"', 'amp-ad, amp-embed, amp-fx-flying-carpet, div[class^="pAd"], div.ads-container');
  } else {
    let paywall = document.getElementById('paywall-wrapper-iframe-estadao');
    removeDOMElement(paywall);
    let ads = document.querySelectorAll('div[class^="styles__Container-sc-"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('folha.uol.com.br')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-sticky-ad, amp-embed');
  } else {
    let signup = document.querySelector('.c-top-signup');
    removeDOMElement(signup);
  }
}

else if (matchDomain('latercera.com')) {
  let subscr_banner = document.querySelector('.empty');
  removeDOMElement(subscr_banner);
}

else if (matchDomain('lasegunda.com')) {
  let url = window.location.href;
  if (url.includes('digital.lasegunda.com/mobile')) {
    let lessreadmore = document.querySelectorAll('article.lessreadmore');
    for (let article of lessreadmore)
      article.classList.remove('lessreadmore');
    let bt_readmore = document.querySelectorAll('div[id*="bt_readmore_"]');
    removeDOMElement(...bt_readmore);
  }
}

else if (matchDomain('globo.com')) {
  if (matchDomain('valor.globo.com')) {
    if (!window.location.pathname.startsWith('/google/amp/')) {
      amp_redirect('div.paywall');
    } else {
      amp_unhide_subscr_section('amp-ad, amp-embed');
      let amp_images = document.querySelectorAll('figure > amp-img[src^="https://"]');
      for (let amp_image of amp_images) {
        let elem = document.createElement('img');
        elem.src = amp_image.getAttribute('src');
        elem.alt = amp_image.getAttribute('alt');
        elem.style = mobile ? 'width: 320px;' : 'margin: 0px 250px; display:block;';
        amp_image.parentNode.replaceChild(elem, amp_image);
      }
    }
  } else if (window.location.pathname.includes('/amp/'))
    ampToHtml();
  if (!window.location.pathname.includes('/amp/')) {
    let ads = document.querySelectorAll('div[id^="ad-container"], div.content-ads, div[class^="block__advertising"]');
    hideDOMElement(...ads);
  }
}

else if (matchDomain('revistaoeste.com')) {
  if (window.location.pathname.startsWith('/revista/')) {
    let intro = document.querySelector('div.is-locked');
    let sub_panel = document.querySelector('div.subscribe-panel');
    removeDOMElement(intro, sub_panel);
    let div_hidden = document.querySelector('div.hidden[data-url]');
    if (div_hidden)
      div_hidden.classList.remove('hidden');
  } else {
    let div_expandable = document.querySelector('div.expandable');
    if (div_expandable)
      div_expandable.classList.remove('expandable');
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

function header_nofix(header, msg = 'BPC > no fix') {
  if (header) {
    let nofix_div = document.createElement('div');
    nofix_div.setAttribute('style', 'margin: 20px; font-weight: bold; color: red;');
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
