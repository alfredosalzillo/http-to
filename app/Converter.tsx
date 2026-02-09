"use client";

import { useCallback } from "react";
import { Alert, Box, FormControl, MenuItem, Select } from "@mui/material";
import dedent from "dedent";
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
  const update = useCallback(
    (newValue: string) => {
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
    },
    [setState],
  );
  return [state, update];
};
const Converter = () => {
  const [{ raw, value, error }, update] = useConvertedValue(defaultHttp);
  return (
    <Box sx={{ width: "100%" }}>
      <CodeBlock
        editable
        initialValue={raw}
        onChange={update}
        language={http()}
        style={{ border: "1px solid #30363d", borderRadius: "8px", overflow: "hidden" }}
      />
      <Box
        sx={{
          display: "flex",
          py: 2,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value="Javascript" disabled>
            <MenuItem value="Javascript">Javascript</MenuItem>
          </Select>
        </FormControl>
        {error && (
          <Alert severity="error" sx={{ py: 0, px: 1 }}>
            {error.message}
          </Alert>
        )}
      </Box>
      <Box sx={{ position: "relative" }}>
        <CodeBlock
          value={value}
          language={javascript()}
          style={{ border: "1px solid #30363d", borderRadius: "8px", overflow: "hidden"  }}
        />
        <CopyButton
          value={value}
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
          }}
        />
      </Box>
    </Box>
  );
};

export default Converter;
