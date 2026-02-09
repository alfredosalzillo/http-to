"use client";

import React, { useCallback } from "react";
import dedent from "dedent";
import classes from "./Convert.module.scss";
import CopyButton from "@/components/CopyButton";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import CodeBlock from "@/plugins/code-block";
import http from "@/plugins/code-block/languages/http";
import javascript from "@/plugins/code-block/languages/javascript";
import { parse } from "@/plugins/http";
import toJavascriptFetch from "@/plugins/http/converters/toJavascriptFetch";

const defaultHttp = dedent`
  POST https://jsonplaceholder.typicode.com/posts HTTP/1.1
  Authorization: Bearer YWRtaW46cHdkLTAuNTE2MjAzOTU4MTk1OTk3OC1lbmQ=
  Content-Type: application/json
  
  {
    "id": 1,
    "title": "Lorem Ipsum",
    "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, neque et placerat elementum, nisl ipsum gravida sapien, quis auctor quam lorem sit amet dolor."
  }
`;

const convert = (value: string) => toJavascriptFetch(parse(value));

type ConvertedValueState = {
  raw: string;
  value: string;
  error?: Error | null;
};
type UseConvertedValueReturn = [ConvertedValueState, (value: string) => void];
const useConvertedValue = (initialValue: string): UseConvertedValueReturn => {
  const [state, setState] = useLocalStorageState<ConvertedValueState>(
    "http-to__last_converted_value",
    () => ({
      raw: initialValue,
      value: convert(initialValue),
      error: null,
    }),
  );
  const update = useCallback((newValue: string) => {
    setState((prevState) => {
      try {
        return {
          raw: newValue,
          value: convert(newValue),
          error: null,
        };
      } catch (error) {
        return {
          ...prevState,
          error: error as Error,
        };
      }
    });
  }, []);
  return [state, update];
};
const Converter = () => {
  const [{ raw, value, error }, update] = useConvertedValue(defaultHttp);
  return (
    <div className={classes.root}>
      <CodeBlock
        editable
        initialValue={raw}
        onChange={update}
        language={http()}
        className={classes.code}
      />
      <div className={classes.actions}>
        <select>
          <option>Javascript</option>
        </select>
        {error && <div className={classes.error}>{error.message}</div>}
      </div>
      <div style={{ position: "relative" }}>
        <CodeBlock
          value={value}
          language={javascript()}
          className={classes.code}
        />
        <CopyButton value={value} className={classes.copy} />
      </div>
    </div>
  );
};

export default Converter;
