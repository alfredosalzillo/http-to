import { stringify } from './utils';

const writeBody = ({ contentType, value, text }) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: json.encode(${stringify(value)})`;
    default:
      return `body: '${text}'`;
  }
};


const writeHeader = headers => headers
  .map(({ name, value }) => [name, value.trimStart()]) |> Object.fromEntries
  |> stringify;

export default ({
  method,
  uri,
  headers,
  body,
}) => `
import 'dart:convert';
import 'package:http/http.dart' as http;

http.${method.toLowerCase()}('${uri.raw}',
  headers: ${writeHeader(headers)}${body.text && ','}
  ${body.text && `${writeBody(body)}`}
);
`
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');
