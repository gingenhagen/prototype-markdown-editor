var bundlePath = './build/bundle.js';

if(typeof process !== 'undefined' && process.env.ENVIRONMENT === 'DEV') {
  bundlePath = 'http://localhost:8080/build/bundle.js';
}

var bundleScriptEl = document.createElement('script');
bundleScriptEl.src = bundlePath;
document.currentScript.parentNode.insertBefore(bundleScriptEl, document.currentScript);
