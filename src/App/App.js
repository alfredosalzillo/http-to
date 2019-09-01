import {
  component, useState, useRef, useCallback, useEffect
} from 'haunted';
import styled from 'masquerades';
import { html } from 'lit-html';
import { define } from '../html';
import parseHttp, { toJavascriptFetch, toDartHttp } from '../http/http';
import CarbonCode from './CarbonCode/CarbonCode';

const languagesMapping = {
  javascript: toJavascriptFetch,
  dart: toDartHttp,
};

const convertTo = (language, code) => languagesMapping[language](parseHttp(code));

define(CarbonCode, {
  name: 'carbon-code',
});

define(styled.div`
    :global(body) {
      background-color: #646464;
      width: 100vw;
      height: 100vh;
      margin: 0;
    }

    display: block;
    max-width: 800px;
    margin: auto;
    padding: 1rem;

    .top,
    .bottom,
    .center,
    .footer {
      font-family: Hack, monospace !important;
      color: white;
      display: block;
      margin: auto;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
    }

    .footer {
      text-align: center;
      font-size: 12px;

      & a {
        text-decoration: none;
        color: #caddf5;
      }
    }

    h1, .subtitle {
      color: white;
      font-family: Hack, monospace !important;
      text-align: center;
      width: 100%;
    }

    .subtitle {
      padding: 20px;
      font-weight: bold;
    }

    select {
      background: #282a36;
      padding: 0.5rem 1rem;
      font-size: 14px;
      line-height: 133%;
      font-family: Hack, monospace !important;
      border: none;
      color: white;
      text-transform: lowercase;
      appearance: none;
      border-radius: 3px;
    }

    textarea {
      resize: none;
      display: block;
      background-color: #282a36;
      color: white;
      border: none;
      border-radius: 5px;
      width: calc(100% - 40px);
      min-height: 200px;
      padding: 20px;
      margin: auto;
      font-size: 14px;
      line-height: 133%;
      font-variant-ligatures: contextual;
      font-feature-settings: "calt";
      user-select: none;
      font-family: Hack, monospace !important;
    }

    textarea:focus, select:focus {
      outline: 0;
    }

    button {
      float: right;
    }
`, {
  name: 'app-div',
  extends: 'div',
});

define(styled.button`
    background: #282a36;
    padding: 0.5rem 1rem;
    font-size: 14px;
    line-height: 133%;
    font-family: Hack, monospace !important;
    border: none;
    color: white;
    text-transform: lowercase;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    border-radius: 3px;

    &:disabled {
      border-radius: 3px;
      background-color: #505254;
    }
`, {
  name: 'fancy-button',
  extends: 'button',
});

const exampleHttp = `
POST https://jsonplaceholder.typicode.com/posts/1
Content-Type: application/json

{
  "title": "foo",
  "body": "bar",
  "id": 1
}
`;
const exampleParsed = toJavascriptFetch(parseHttp(exampleHttp));

export default define(component(() => {
  const text = useRef(exampleHttp);
  const onTextareaInput = useCallback((e) => {
    text.current = e.target.value;
  }, [text]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(exampleParsed);
  const language = useRef('javascript');
  const onConvert = useCallback(() => {
    setCode(convertTo(language.current, text.current));
  }, [setCode, setLoading, language]);
  useEffect(() => {
    if (code) {
      setLoading(true);
    }
  }, [code]);
  const onCodeLoadComplete = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  const onSelectChange = useCallback((e) => {
    language.current = e.target.value;
  }, [language]);
  return html`
    <div is="app-div">
        <h1>HTTP-TO</h1>
        <div class="subtitle">Convert HTTP request to other languages</div>      
        <div class="center">
            <textarea @input=${onTextareaInput}>${text.current}</textarea>
        </div>
        <div class="bottom">
            <select @change=${onSelectChange}>
                ${Object.keys(languagesMapping).map(lan => html`<option .value=${lan} ?selected=${lan === language}>${lan}</option>`)}
            </select>
            <button is="fancy-button" 
                @click=${onConvert} 
                ?loading=${loading}
                ?disabled=${loading}
             >Convert</button>    
        </div>
        <div class="output-code">
            <carbon-code 
                .code=${code} 
                .language=${language.current}
                .onLoad=${onCodeLoadComplete}
            ></carbon-code>
        </div>
        <div class="footer">
            find on <a href="https://github.com/alfredosalzillo/http-to">github</a>
        </div>
    </div>
  `;
}));
