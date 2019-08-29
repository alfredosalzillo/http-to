const parseParams = uri => [...uri.matchAll(/[?&]((?<name>[^=&]*)=(?<value>[^&]*))/ig)].map(res => res.groups);
const parseUrlEncoded = string => [...string.matchAll(/[&]?((?<name>[^=&]*)=(?<value>[^&]*))/ig)].map(res => res.groups);
const parseUri = uri => ({
  type: 'uri',
  raw: uri,
  params: parseParams(uri),
  url: uri.match(/^(?<url>[^?]*)/).groups.url,
});
const parseRequest = (request) => {
  const { method, uri } = request.match(/^(?<method>[^ ]*) *(?<uri>[^ ]*)/).groups;
  return {
    method,
    uri: parseUri(uri),
    type: 'request',
  };
};
const parseHeaders = headers => headers.split('\n').map(header => ({
  ...header.match(/^(?<name>[^:]*):(?<value>.*)$/).groups,
  type: 'header',
}));
const parseBody = (body, headers) => {
  const { value: contentType = 'application/x-www-form-urlencoded' } = headers
    .find(header => header.name.toLowerCase().trim() === 'content-type') || {};
  switch (contentType.trim().toLowerCase()) {
    case 'application/json':
      return {
        type: 'body', contentType, value: JSON.parse(body), text: body,
      };
    case 'application/x-www-form-urlencoded':
    default:
      return {
        type: 'body', contentType, value: parseUrlEncoded(body), text: body,
      };
  }
};
const purify = string => string.trimStart('\n').trimEnd('\n');
const parse = (http) => {
  const [requestLine, ...others] = purify(http).split('\n');
  const [headersLines, ...bodyLines] = others.join('\n').split('\n\n');
  const request = parseRequest(requestLine);
  const headers = parseHeaders(headersLines);
  const body = parseBody(bodyLines.join('\n'), headers);
  return {
    ...request,
    headers,
    body,
  };
};

export default parse;
export const toJavascriptFetch = httpAst => (
`fetch('${httpAst.uri.raw}', {
  method: '${httpAst.method}',
  headers: ${JSON.stringify(Object.fromEntries(httpAst.headers.map(({ name, value }) => [name, value])), null, 4)},
  body: \`${httpAst.body.text}\`,
})`
);
