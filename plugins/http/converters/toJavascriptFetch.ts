import type { BodyToken, HeaderToken, HttpRequestToken } from '../http';

import { stringify } from './utils';

const writeBody = ({ contentType, value, text }: BodyToken) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: JSON.stringify(${stringify(value)})`;
    default:
      return `body: \`${text}\``;
  }
};

const writeHeaders = (headers: HeaderToken[]) => stringify(Object
  .fromEntries(headers
    .map(({ name, value }) => [name, value.trimStart()])));

const toJavascriptFetch = ({
  method,
  uri,
  headers,
  body,
}: HttpRequestToken) => `
fetch('${uri.raw}', {
  method: '${method}',
  headers: ${writeHeaders(headers)},
  ${body.text && `${writeBody(body)},`}
})
`
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');

export default toJavascriptFetch;
