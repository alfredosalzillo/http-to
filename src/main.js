import { render } from 'lit-html';
import html from './html';
import App from './App/App';

render(html`
  <${App}></${App}>
`, document.getElementById('root'));
