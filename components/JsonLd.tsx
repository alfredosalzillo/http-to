import type { FC } from "react";
import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  jsonLd: WithContext<Thing>;
};

const JsonLd: FC<JsonLdProps> = ({ jsonLd }) => {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid for JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLd;
