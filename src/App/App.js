import {
  component, useState, useRef
} from 'haunted';
import html, { define } from '../html';
import parseHttp, { toJavascriptFetch } from '../http';
import styled from "masquerades";

const StyledApp = define(styled.div`
    :global(body) {
        background-color: #646464;
        width: 100vw;
        height: 100vh;
        margin: 0;
    }

    display: block;
    width: 100%;
    margin: auto;

    .top,
    .bottom,
    .output-cod {
      display: block;
      width: 90%;
      margin: auto;
      padding: 10px;
    }

    textarea {
      display: block;
      background-color: white;
      border: 3px solid #fff;
      border-radius: 20px;
      width: 90%;
      height: 300px;
      padding: 20px;
      margin: auto;
    }
    textarea:focus {
      outline: 0;
    }
  
    button {
      float: right;
    }
`, {
  extends: 'div',
});

const StyledButton = define(styled.button`
  background: #f1c40f;
  color: #fff;
  border: 3px solid #fff;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font: 24px "Margarine", sans-serif;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: 0.2s ease-in-out;
  letter-spacing: 2px;
  &:disabled {
    border-radius: 15px;
    background-color: grey;
  }
`, {
  extends: 'button',
});

export default define(component(() => {
  const text = useRef('');
  const [converted, setConverted] = useState('');
  const convert = () => setConverted(toJavascriptFetch(parseHttp(text.current)));
  return html`
    <div is="${StyledApp}">
        <div class="top">
            <select>
                <option selected value="javascript">Javascript</option>
            </select>
        </div>            
        <div>
            <textarea @input=${(e) => text.current = e.target.value}>${text.current}</textarea>
        </div>
        <div class="bottom">
            <button is="${StyledButton}" @click=${convert}>Convert</button>    
        </div>
        <div class="output-code">
        <iframe
          src="https://carbon.now.sh/embed/?bg=rgba(64%252C64%252C64%252C0)&t=dracula&l=javascript&fl=1&fm=Hack&fs=14px&es=2x&wm=false&code=${encodeURI(converted).replace(/&/ig, '%26')})"
          width="100%"
          height="500px"
          style="border: 0; overflow: hidden;"
          sandbox="allow-scripts allow-same-origin">
        </iframe>
        </div>
    </div>
  `;
}));
