import { html } from 'lit-html';

const defined = new Map();
export const define = (Constructor, {
  name = `app-${String.fromCharCode(...[...(Date.now().toString() + Map.length)].map(n => Number(n) + 97))}`,
  ...options
} = {}) => {
  if (defined.has(Constructor)) {
    return defined.get(Constructor);
  }
  customElements.define(name, Constructor, options);
  defined.set(Constructor, name);
  return name;
};

const isHTMLElement = (Constructor) => {
  if (!Constructor) {
    return false;
  }
  if (Constructor === HTMLElement) {
    return true;
  }
  return isHTMLElement(Constructor.prototype);
};

// Pre parse strings and HTMLElement before pass to lit-html
export default (strings, ...values) => {
  const parsedStrings = strings.map((string, i) => {
    const value = values[i];
    if (isHTMLElement(value)) {
      return [string, define(value)].join('');
    }
    if (typeof value === 'string') {
      return [string, value].join('');
    }
    return string;
  }).reduce((acc, string, i) => {
    const value = values[i - 1];
    if (typeof value === 'string' || isHTMLElement(value)) {
      const [last, ...rest] = acc.reverse();
      return [...rest.reverse(), [last, string].join('')];
    }
    return [...acc, string];
  }, []);
  const parsedValues = values.filter(value => !(isHTMLElement(value) || typeof value === 'string'));
  return html(parsedStrings, ...parsedValues);
};
