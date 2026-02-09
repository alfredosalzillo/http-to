"use client";

import { useCallback } from "react";
import {
  Alert,
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Toolbar,
} from "@mui/material";
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box flex={1}>
          {error && <Alert severity="error">{error.message}</Alert>}
        </Box>
        <Box
          flex={1}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value="Javascript" disabled>
              <MenuItem value="Javascript">Javascript</MenuItem>
            </Select>
          </FormControl>
          <CopyButton variant="outlined" value={value} />
        </Box>
      </Toolbar>
      <Stack gap={1} flexDirection="row">
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderStyle: "solid",
            borderRadius: 2,
            overflow: "hidden",
            height: 300,
            boxShadow: 1,
            transition: "border-color 0.2s",
            "&:focus-within": {
              borderColor: "primary.main",
            },
          }}
        >
          <CodeBlock
            editable
            initialValue={raw}
            onChange={update}
            language={http()}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            border: 1,
            borderColor: "divider",
            borderStyle: "solid",
            borderRadius: 2,
            overflow: "hidden",
            height: 300,
            boxShadow: 1,
          }}
        >
          <CodeBlock value={value} language={javascript()} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Converter;
