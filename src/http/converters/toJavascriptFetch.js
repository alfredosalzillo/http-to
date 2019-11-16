import { stringify } from './utils';

const javascriptBody = ({ contentType, value, text }) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: JSON.stringify(${stringify(value)})`;
    default:
      return `body: \`${text}\``;
  }
};

const toJavascriptFetch = ({
  method,
  uri,
  headers,
  body,
}) => `
fetch('${uri.raw}', {
  method: '${method}',
  headers: ${stringify(Object.fromEntries(headers.map(({ name, value }) => [name, value.trimStart()])))},
  ${body.text && `${javascriptBody(body)},`}
})
`
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');

export default toJavascriptFetch;
