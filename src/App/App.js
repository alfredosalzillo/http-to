import {
  component, useState, useRef,
} from 'haunted';
import styled from 'masquerades';
import { html } from 'lit-html';
import { define } from '../html';
import parseHttp, { toJavascriptFetch } from '../http/http';
import CarbonCode from './CarbonCode/CarbonCode';
import { useCallback, useEffect } from 'haunted/lib/haunted';

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
    .output-cod {
      display: block;
      margin: auto;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
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
  &:disabled {
    border-radius: 5px;
    background-color: grey;
  }
`, {
  name: 'fancy-button',
  extends: 'button',
});

export default define(component(() => {
  const text = useRef('');
  const onTextareaInput = useCallback((e) => {
    text.current = e.target.value;
  }, [text]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const onConvert = useCallback(() => {
    setCode(toJavascriptFetch(parseHttp(text.current)));
  }, [setCode, setLoading]);
  useEffect(() => {
    if (code) {
      setLoading(true);
    }
  }, [code]);
  const onCodeLoadComplete = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  return html`
    <div is="app-div">
        <h1>HTTP-TO</h1>
        <div class="subtitle">Convert HTTP request to other languages</div>      
        <div class="center">
            <textarea @input=${onTextareaInput}>${text.current}</textarea>
        </div>
        <div class="bottom">
            <select>
                <option value="javascript">Javascript</option>
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
                language="javascript"
                .onLoad=${onCodeLoadComplete}
            ></carbon-code>
        </div>
    </div>
  `;
}));
