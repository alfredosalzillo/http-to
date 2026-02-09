const parseParams = (uri: string) =>
  [...uri.matchAll(/[?&]((?<name>[^=&]*)=(?<value>[^&]*))/gi)]
    // biome-ignore lint/style/noNonNullAssertion: allowed
    .map((res) => res.groups!);
const parseUrlEncoded = (value: string) =>
  [...value.matchAll(/[&]?((?<name>[^=&]*)=(?<value>[^&]*))/gi)].map(
    (res) => res.groups,
  );

export type UriToken = {
  type: "uri";
  raw: string;
  params: Record<string, string>[];
  url: string;
};
const parseUri = (uri: string): UriToken => ({
  type: "uri",
  raw: uri,
  params: parseParams(uri),
  // biome-ignore lint/style/noNonNullAssertion: allowed
  url: uri.match(/^(?<url>[^?]*)/)!.groups!.url!,
});

export type RequestToken = {
  method: string;
  uri: UriToken;
  version: string;
  type: "request";
};
const parseRequest = (request: string): RequestToken => {
  const {
    method,
    uri,
    version = "1.1",
    // biome-ignore lint/style/noNonNullAssertion: allowed
  } = request.match(/^(?<method>[^ ]*) *(?<uri>[^ ]*) *HTTP\/(?<version>.*)/)!
    .groups as { method: string; uri: string; version: string };
  return {
    method,
    version,
    uri: parseUri(uri),
    type: "request",
  };
};

export type HeaderToken = {
  name: string;
  value: string;
  type: "header";
};
const parseHeaders = (headers: string): HeaderToken[] =>
  headers.split("\n").map((header) => ({
    // biome-ignore lint/style/noNonNullAssertion: allowed
    ...(header.match(/^(?<name>[^:]*):(?<value>.*)$/)!.groups as {
      name: string;
      value: string;
    }),
    type: "header",
  }));

export type BodyToken = {
  contentType: string;
  type: "body";
  // biome-ignore lint/suspicious/noExplicitAny: allowed
  value: any;
  text: string;
};
const parseBody = (body: string, headers: HeaderToken[]): BodyToken => {
  const { value: contentType = "application/x-www-form-urlencoded" } =
    headers.find(
      (header) => header.name.toLowerCase().trim() === "content-type",
    ) || {};
  switch (contentType.trim().toLowerCase()) {
    case "application/json":
      return {
        contentType,
        type: "body",
        value: JSON.parse(body),
        text: body,
      };
    default:
      return {
        contentType,
        type: "body",
        value: parseUrlEncoded(body),
        text: body,
      };
  }
};
const purify = (value: string) => value.trimStart().trimEnd();

export type HttpRequestToken = {
  method: string;
  type: string;
  uri: UriToken;
  version: string;
  body: BodyToken;
  headers: HeaderToken[];
};
export const parse = (http: string): HttpRequestToken => {
  const [requestLine, ...others] = purify(http).split("\n");
  const [headersLines, ...bodyLines] = others.join("\n").split("\n\n");
  const request = parseRequest(requestLine);
  const headers = parseHeaders(headersLines);
  const body = parseBody(bodyLines.join("\n"), headers);
  return {
    ...request,
    headers,
    body,
  };
};
