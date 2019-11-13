import {
  component, useEffect, useMemo,
} from 'haunted';
import CodeMirror from 'codemirror';
import codemirrorCss from 'codemirror/lib/codemirror.css';
import themeCss from 'codemirror/theme/material-palenight.css';

const importLanguage = (language) => {
  switch (language) {
    case 'http':
      return import('codemirror/mode/http/http');
    case 'javascript':
      return import('codemirror/mode/javascript/javascript');
    case 'dart':
      return import('codemirror/mode/dart/dart');
    default:
      throw new Error(`language ${language} not supported`);
  }
};

const useCss = (root, css) => {
  useEffect(() => {
    const cssStyleSheet = new CSSStyleSheet();
    cssStyleSheet.insertRule(`@media { ${css} }`);
    // eslint-disable-next-line no-param-reassign
    root.adoptedStyleSheets = root.adoptedStyleSheets.concat(cssStyleSheet);
  }, []);
};

/**
 * @param host {HTMLElement}
 * @return CodeMirror.Editor
 * */
const useCodemirror = host => useMemo(() => CodeMirror(host, {
  theme: 'material-palenight',
  lineNumbers: true,
  smartIndent: true,
  lineWiseCopyCut: true,
  lineWrapping: true,
}), []);

const CodeBlock = ({
  code = '',
  language = 'javascript',
  readonly = false,
  onLoad = () => null,
  onChange = () => null,
  shadowRoot,
}) => {
  useCss(shadowRoot, codemirrorCss);
  useCss(shadowRoot, themeCss);
  const host = useMemo(() => document.createElement('div'), []);
  const codemirror = useCodemirror(host);
  useEffect(() => {
    codemirror.on('change', onChange);
  }, [onChange]);
  useEffect(() => {
    codemirror.setValue(code);
    onLoad();
  }, [code]);
  useEffect(async () => {
    await importLanguage(language);
    codemirror.setOption('mode', language);
  }, [language]);
  useEffect(() => {
    codemirror.setOption('readOnly', readonly);
  }, [readonly]);
  return host;
};

CodeBlock.observedAttributes = ['code', 'language', 'readonly', 'onLoad', 'onChange'];

export default component(CodeBlock, {
  useShadowDOM: true,
});
