import {
  component, useEffect, useRef, useCallback, useState,
} from 'haunted';
import html, { define } from '../html';
import parseHttp, { toJavascriptFetch } from '../http';

export default define(component(() => {
  const [text, setText] = useState('')
  const [converted, setConverted] = useState('');
  const convert = () => setConverted(toJavascriptFetch(parseHttp(text)));
  return html`
    <div style="width: 100%; height: 100%;">
        <select>
            <option selected value="javascript-fetch">Javascript Fetch</option>
        </select>
        <br>
        <textarea @input=${(e) => setText(e.target.value)}>${text}</textarea>
        <br>
        <button @click=${convert}>Convert</button>
        <br>
        <pre>${converted}</pre>
    </div>
  `;
}));
