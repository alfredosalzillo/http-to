import { stringify } from './utils';

const dartBody = ({ contentType, value, text }) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: json.encode(${stringify(value)})`;
    default:
      return `body: '${text}'`;
  }
};
const toDartHttp = ({
  method,
  uri,
  headers,
  body,
}) => `
import 'dart:convert';
import 'package:http/http.dart' as http;

http.${method.toLowerCase()}('${uri.raw}',
  headers: ${stringify(Object.fromEntries(headers.map(({ name, value }) => [name, value.trimStart()])))}${
  body.text && ','
}
  ${body.text && `${dartBody(body)}`}
);
`
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');

export default toDartHttp;
