import {
  component, useState, useRef, useCallback, useEffect,
} from 'haunted';
import styled from 'masquerades';
import { html } from 'lit-html';
import { define } from '../html';
import parseHttp from '../http/http';
import CodeBlock from './CodeBlock/CodeBlock';
import toJavascriptFetch from '../http/converters/toJavascriptFetch';
import toDartHttp from '../http/converters/toDartHttp';

const languagesMapping = {
  javascript: toJavascriptFetch,
  dart: toDartHttp,
};

const convertTo = (language, code) => languagesMapping[language](parseHttp(code));

define(CodeBlock, {
  name: 'code-block',
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
    
    .toolbar,
    .footer {
      font-family: Hack, monospace !important;
      color: white;
      display: block;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
      margin: auto auto;
    }

    .footer {
      margin-top: 20px;
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

    button {
      float: right;
    }
  
    .code-container {
      display: block;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
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
    text-transform: uppercase;
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
POST https://jsonplaceholder.typicode.com/posts HTTP/1.1
Authorization: Bearer ${btoa(`admin:pwd-${Math.random()}-end`)}
Content-Type: application/json

{
  "id": 1,
  "title": "Lorem Ipsum",
  "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, neque et placerat elementum, nisl ipsum gravida sapien, quis auctor quam lorem sit amet dolor."
}
`.trimStart();
const exampleParsed = toJavascriptFetch(parseHttp(exampleHttp));

export default define(component(() => {
  const input = useRef(exampleHttp);
  const onInputChange = useCallback((e) => {
    input.current = e.getValue();
  }, [input]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(exampleParsed);
  const [language, setLanguage] = useState('javascript');
  const onConvert = useCallback(() => {
    setCode(convertTo(language, input.current));
  }, [setCode, language]);
  useEffect(() => {
    if (code) {
      setLoading(true);
    }
  }, [code]);
  const onCodeLoadComplete = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  const onLanguageChange = useCallback((e) => {
    setLanguage(e.target.value);
    setCode(convertTo(e.target.value, input.current));
  }, [language, setCode, input]);
  return html`
    <div is="app-div">
        <h1>HTTP-TO</h1>
        <div class="subtitle">Convert HTTP request to other languages</div>      
        <div class="code-container">
             <code-block
                language="http"
                .code=${input.current} 
                .onChange=${onInputChange}
            ></code-block>
        </div>
        <div class="toolbar">
            <select @change=${onLanguageChange}>
                ${Object.keys(languagesMapping).map(lan => html`
                        <option 
                            .value=${lan} 
                            ?selected=${lan === language}
                        >${lan}</option>
                `)}
            </select>
            <button is="fancy-button" 
                @click=${onConvert} 
                ?loading=${loading}
                ?disabled=${loading}
             >Convert</button>    
        </div>
         <div class="code-container">
            <code-block
                .code=${code} 
                .language=${language}
                readonly="true"
                .onLoad=${onCodeLoadComplete}
            ></code-block>
        </div>
        <div class="footer">
            find on <a href="https://github.com/alfredosalzillo/http-to">github</a>
        </div>
    </div>
  `;
}));
