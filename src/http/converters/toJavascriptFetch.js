import { stringify } from './utils';

const writeBody = ({ contentType, value, text }) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: JSON.stringify(${stringify(value)})`;
    default:
      return `body: \`${text}\``;
  }
};

const writeHeaders = headers => headers
  .map(({ name, value }) => [name, value.trimStart()]) |> Object.fromEntries
  |> stringify;

export default ({
  method,
  uri,
  headers,
  body,
}) => `
fetch('${uri.raw}', {
  method: '${method}',
  headers: ${writeHeaders(headers)},
  ${body.text && `${writeBody(body)},`}
})
`
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');
