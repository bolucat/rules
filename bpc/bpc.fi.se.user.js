// ==UserScript==
// @name            Bypass Paywalls Clean - fi/se
// @version         3.3.9.4
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fi.se.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.fi.se.user.js
// @homepageURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/blob/main/LICENSE
// @match           *://*.etc.se/*
// @match           *://*.hs.fi/*
// @match           *://*.nyteknik.se/*
// @match           *://*.suomensotilas.fi/*
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;

if (matchDomain('etc.se')) {
  let paywall = document.querySelector('div.paywalled');
  if (paywall) {
    paywall.removeAttribute('class');
    let gradient = document.querySelector('div.bg-gradient-white');
    if (gradient)
      gradient.removeAttribute('class');
    let footer = document.querySelector('footer');
    removeDOMElement(footer.parentNode);
  }
  let ads = document.querySelectorAll('div[class$="-ad"]');
  hideDOMElement(...ads);
  let video_iframes = document.querySelectorAll('div.embed-block > iframe[width][height]');
  for (let elem of video_iframes) {
    if (elem.width > 1000) {
      let ratio = elem.width / (mobile ? 320 : 640);
      elem.width = elem.width / ratio;
      elem.height = elem.height / ratio;
    }
  }
}

else if (matchDomain('hs.fi')) {// dynamic.hs.fi only
  let url = window.location.href;
  if (!url.includes('https://dynamic.hs.fi')) {
    let iframe = document.querySelector('iframe[src^="https://dynamic.hs.fi/a/"]');
    if (iframe && url.includes('.html')) {
      window.setTimeout(function () {
        window.location.href = iframe.src;
      }, 500);
    }
  } else {
    let paywall = document.querySelector('.paywall-container, .paywall-wrapper');
    if (paywall) {
      let scripts = document.querySelectorAll('script');
      let json_script;
      for (let script of scripts) {
        if (script.innerText.includes('window.__NUXT__=')) {
          json_script = script;
          break;
        }
      }
      let json_text;
      if (json_script.text.includes('paywallComponents:['))
        json_text = json_script.text.replace(/\r\n/g, '').split('amlData:[')[1].split('metaData')[0].split('paywallComponents:[')[1].slice(0, -4);
      let main = document.querySelector('main');
      if (main && json_text) {
        let pars = json_text.split('{type:');
        let type, value, slides, src, elem, img, caption, caption_text, par_html, par_text;
        let parser = new DOMParser();
        for (let par of pars) {
          elem = '';
          type = par.split(',')[0];
          if (['a', 'i'].includes(type)) { // text
            value = par.split('value:')[1].split('}')[0].replace(/(^"|"$)/g, '');
            if (!value.includes('<p>'))
              value = '<p>' + value + '</p>';
            par_html = parser.parseFromString(value, 'text/html');
            elem = par_html.querySelector('p');
          } else if (['D', 'f', 'j', 'k', 'n'].includes(type)) { // quote
            if (par.includes('text:') && par.includes(',position:')) {
              value = par.split('text:')[1].split(',position:')[0].replace(/(^"|"$)/g, '');
              elem = document.createElement('p');
              elem.innerText = value;
              elem.setAttribute('style', 'font-style: italic;');
            }
          } else if (['l', 'm', 'o', 'u'].includes(type)) { // authors
            if (!par.includes('text:'))
              continue;
            value = par.split('text:')[1].split(/,(role|type)/)[0].replace(/(^"|"$)/g, '');
            if (value.length > 1) {
              elem = document.createElement('p');
              elem.innerText = value;
            }
          } else if (['e', 'h', 'y'].includes(type)) { // image
            if (!par.includes('src:'))
              continue;
            src = par.split('src:"')[1].split('",')[0];
            if (!src.startsWith('http'))
              src = 'https://arkku.mediadelivery.fi/img/468/' + src;
            elem = document.createElement('p');
            img = document.createElement('img');
            img.setAttribute('src', src);
            img.setAttribute('style', 'width:468px !important');
            elem.appendChild(img);
            if (par.includes('caption:')) {
              caption = document.createElement('figcaption');
              caption_text = par.split('caption:')[1].split('",')[0];
              if (caption_text.length)
                caption_text = caption_text.slice(1, caption_text.length - 1);
              caption.innerText = caption_text;
              elem.appendChild(caption);
            }
          } else if (['p', 'r'].includes(type)) { // slides
            slides = par.split('src:');
            elem = document.createElement('p');
            for (let slide of slides) {
              if (slide.includes('.jpg')) {
                src = slide.split(',')[0].replace(/"/g, '');
                if (!src.startsWith('http'))
                  src = 'https://arkku.mediadelivery.fi/img/468/' + src;
                img = document.createElement('img');
                img.setAttribute('src', src);
                img.setAttribute('style', 'width:468px !important');
                elem.appendChild(img);
                caption = document.createElement('figcaption');
                caption_text = slide.includes('text:') ? slide.split('text:')[1].split(',"text-style"')[0] : slide.split('caption:')[1].split('",')[0];
                if (caption_text.length)
                  caption_text = caption_text.slice(1, caption_text.length - 1);
                par_html = parser.parseFromString('<div>' + caption_text + '</div>', 'text/html');
                elem.appendChild(par_html.querySelector('div'));
              }
            }
          } else
            false;//console.log('type: ' + type + ' par: ' + par);
          if (elem) {
            elem.setAttribute('class', 'article-body px-16 mb-24');
            main.appendChild(elem);
          }
        }
        main.appendChild(document.createElement('br'));
      }
      removeDOMElement(paywall);
    }
  }
}

else if (matchDomain('nyteknik.se')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.paywallTeaser');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article h2');
    if (article)
      article.firstChild.before(googleWebcacheLink(url));
  }
}

else if (matchDomain('suomensotilas.fi')) {
  let obscured = document.querySelector('div.epfl-pw-obscured');
  if (obscured)
    obscured.classList.remove('epfl-pw-obscured');
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

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', 'archive.is'], 'https://{domain}?run=1&url={url}', url, text_fail);
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

})();
