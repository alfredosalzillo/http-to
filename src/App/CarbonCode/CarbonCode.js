import { html } from 'lit-html';
import { component } from 'haunted';

const carbonEmbedUrl = 'https://carbon.now.sh/embed';

const encodeCode = code => encodeURI(code).replace(/&/ig, '%26');
const CarbonCode = ({ code, language, onLoad }) => code && html`
   <iframe
    src="${carbonEmbedUrl}/?bg=rgba(64%252C64%252C64%252C0)&t=dracula&wt=none&wc=true&wa=false&ds=false&l=${language}&fl=1&fm=Hack&fs=14px&es=2x&wm=false&code=${encodeCode(code)}"
    @load=${onLoad}
    width="100%"
    .height=${code.split('\n').length * 37}
    style="border: 0; overflow: hidden;"
    sandbox="allow-scripts allow-same-origin">
  </iframe>
  `;
CarbonCode.observedAttributes = ['code', 'language', 'onLoad'];

export default component(CarbonCode);
