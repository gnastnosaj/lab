/// <reference lib="webworker" />

import * as Less from 'less/lib/less';
import * as createFileManager from 'less/lib/less-browser/file-manager';
import * as PluginLoader from 'less/lib/less-browser/plugin-loader';
import * as setLogListener from 'less/lib/less-browser/log-listener';
import * as setErrorReporting from 'less/lib/less-browser/error-reporting';
import * as setImageFunctions from 'less/lib/less-browser/image-size';

const window = {
  location: {
    href: ''
  }
};

const less = Less();
less.options = {
};

less.FileManager = createFileManager({}, less.logger);
let fileCache = {};
less.FileManager.prototype.clearFileCache = () => {
  fileCache = {};
};
less.FileManager.prototype.loadFile = function(filename, currentDirectory, options) {
  if (currentDirectory && !this.isPathAbsolute(filename)) {
    filename = currentDirectory + filename;
  }
  filename = options.ext ? this.tryAppendExtension(filename, options.ext) : filename;
  options = options || {};
  const hrefParts = this.extractUrlParts(filename, window.location.href);
  const href = hrefParts.url;

  return new Promise((resolve, reject) => {
    if (options.useFileCache && fileCache[href]) {
      try {
        const lessText = fileCache[href];
        return resolve({ contents: lessText, filename: href, webInfo: { lastModified: new Date() } });
      } catch (e) {
        return reject({ filename: href, message: 'Error loading file ' + href + ' error was ' + e.message });
      }
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          fileCache[href] = xhr.responseText;
          resolve({ contents: xhr.responseText, filename: href, webInfo: { lastModified: xhr.getResponseHeader('Last-Modified') } });
        } else {
          reject({ type: 'File', message: '\'' + href + '\' wasn\'t found (' + xhr.status + ')', href });
        }
      }
    };
    xhr.open('GET', href, true);
    xhr.setRequestHeader('Accept', options.mime || 'text/x-less, text/css; q=0.9, */*; q=0.5');
    xhr.send();
  });
};
less.environment.addFileManager(new less.FileManager());

less.PluginLoader = PluginLoader;

setLogListener(less, less.options);
setErrorReporting(window, less, less.options);
setImageFunctions(less.environment);

addEventListener('message', ({ data }) => {
  less.render(`@import "theme/${data}.less";`, {
    javascriptEnabled: true,
    math: 0
  }).then(output => {
    postMessage(output);
  }).catch(error => {
    postMessage({ error: error.message });
  });
});
