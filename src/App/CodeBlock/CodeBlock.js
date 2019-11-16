import {
  component, html, useCallback, useEffect, useMemo,
} from 'haunted';
import CodeMirror from 'codemirror';
import codemirrorCss from 'codemirror/lib/codemirror.css';
import themeCss from 'codemirror/theme/material-palenight.css';
import 'codemirror/addon/scroll/simplescrollbars';
import scrollCss from 'codemirror/addon/scroll/simplescrollbars.css';
import style from './CodeBlook.css';
import useCss from '../hooks/useCss';

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
  scrollbarStyle: 'overlay',
}), []);

const CodeBlock = ({
  code = '',
  language = 'javascript',
  readonly = false,
  onLoad = () => null,
  onChange = () => null,
}) => {
  useCss(style);
  useCss(codemirrorCss);
  useCss(themeCss);
  useCss(scrollCss);
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
  const onCopy = useCallback(() => navigator.clipboard.writeText(code), [code]);
  return html`
    <div class="root">
        <div class="action-container">
            <button class="action" @click=${onCopy}>Copy</button>
        </div>
        ${host}
    </div>
  `;
};

CodeBlock.observedAttributes = ['code', 'language', 'readonly', 'onLoad', 'onChange'];

export default component(CodeBlock, {
  useShadowDOM: true,
});
