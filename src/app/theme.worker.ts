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
less.options = {};

less.FileManager = createFileManager({}, less.logger);
let fileCache = {};
less.FileManager.prototype.clearFileCache = () => {
  fileCache = {};
};
less.FileManager.prototype.loadFile = function(filename, currentDirectory, options, environment) {
  if (currentDirectory && !this.isPathAbsolute(filename)) {
    filename = currentDirectory + filename;
  }

  filename = options.ext ? this.tryAppendExtension(filename, options.ext) : filename;

  options = options || {};

  const hrefParts = this.extractUrlParts(filename, window.location.href);
  const href = hrefParts.url;
  const self = this;

  return new Promise((resolve, reject) => {
    if (options.useFileCache && fileCache[href]) {
      try {
        const lessText = fileCache[href];
        return resolve({ contents: lessText, filename: href, webInfo: { lastModified: new Date() } });
      } catch (e) {
        return reject({ filename: href, message: 'Error loading file ' + href + ' error was ' + e.message });
      }
    }

    self.doXHR(href, options.mime, (data, lastModified) => {
      fileCache[href] = data;

      resolve({ contents: data, filename: href, webInfo: { lastModified } });
    }, (status, url) => {
      reject({ type: 'File', message: '\'' + url + '\' wasn\'t found (' + status + ')', href });
    });
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
