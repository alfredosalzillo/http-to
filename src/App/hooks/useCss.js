import { useEffect } from 'haunted';
import useHost from './useHost';

/**
* @param css {String}
* */
export default (css) => {
  const { shadowRoot: root } = useHost();
  useEffect(() => {
    const cssStyleSheet = new CSSStyleSheet();
    cssStyleSheet.insertRule(`@media { ${css} }`);
    // eslint-disable-next-line no-param-reassign
    root.adoptedStyleSheets = root.adoptedStyleSheets.concat(cssStyleSheet);
  }, []);
};
