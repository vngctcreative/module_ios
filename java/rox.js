if (typeof $response !== 'undefined' && typeof $done === 'function') {
  let b = $response.body;
  if (b) {
    try {
      JSON.parse(b);
      b = b
        .replace(/("is_vip"|"is_verified")\s*:\s*false/g, '$1:true')
        .replace(/("vip_expires_at")\s*:\s*0/g, '$1:253394586000')
        .replace(/("coin_balance")\s*:\s*\d+/g, '"coin_balance":999999999');
    } catch (e) {}
  }
  $done({ body: b });
}

(function () {
  if (typeof window === 'undefined') return;
  'use strict';
  function isTargetUrl(url) {
    try {
      return typeof url === 'string' && url.indexOf('/v1/user/info') !== -1;
    } catch {
      return false;
    }
  }

  function tryJsonReplace(text) {
    if (typeof text !== 'string' || text.length === 0) return text;
    try {
      JSON.parse(text); // check valid JSON
      return text
        .replace(/("is_vip"|"is_verified")\s*:\s*false/g, '$1:true')
        .replace(/("vip_expires_at")\s*:\s*0/g, '$1:253394586000')
        .replace(/("coin_balance")\s*:\s*\d+/g, '"coin_balance":999999999');
    } catch {
      return text;
    }
  }

  (function hookXHR() {
    if (!window.XMLHttpRequest) return;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      try {
        this._roxUrl = typeof url === 'string' ? url : '';
      } catch {
        this._roxUrl = '';
      }
      return originalOpen.call(this, method, url, async, user, pass);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('load', function () {
        try {
          const url = this._roxUrl || '';
          if (!isTargetUrl(url)) return;
          const isTextResponse =
            !this.responseType || this.responseType === '' || this.responseType === 'text';
          if (!isTextResponse) return;

          const origText = typeof this.responseText === 'string' ? this.responseText : '';
          const newText = tryJsonReplace(origText);
          if (newText === origText) return;

          try {
            Object.defineProperty(this, 'responseText', {
              configurable: true,
              enumerable: true,
              get: function () {
                return newText;
              }
            });
          } catch (e) {
            console.warn('[RoX] responseText override failed:', e);
          }
          try {
            Object.defineProperty(this, 'response', {
              configurable: true,
              enumerable: true,
              get: function () {
                return newText;
              }
            });
          } catch (e) {
            console.warn('[RoX] response override failed:', e);
          }
        } catch (err) {
          console.error('[RoX XHR Hook Error]', err);
        }
      });
      return originalSend.apply(this, args);
    };
  })();

  (function hookFetch() {
    if (!window.fetch) return;
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      const reqUrl = (function () {
        try {
          if (typeof input === 'string') return input;
          if (input && input.url) return input.url;
        } catch {}
        return '';
      })();

      if (!isTargetUrl(reqUrl)) {
        return originalFetch.apply(this, arguments);
      }

      return originalFetch.apply(this, arguments).then(async (resp) => {
        try {
          const clone = resp.clone();
          const contentType = clone.headers.get('content-type') || '';
          if (!contentType.includes('application/json') && !contentType.includes('text/')) {
            return resp;
          }
          const origText = await clone.text();
          const newText = tryJsonReplace(origText);
          if (newText === origText) return resp;

          const newResp = new Response(newText, {
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          });
          return newResp;
        } catch (e) {
          console.error('[RoX Fetch Hook Error]', e);
          return resp;
        }
      });
    };
  })();
})();
