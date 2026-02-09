"use client";

import type React from "react";
import { type FC, useEffect, useImperativeHandle, useRef } from "react";
import type { Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";

const customTheme = EditorView.theme(
  {
    "&": {
      borderRadius: "0px",
      padding: "8px 4px",
      overflow: "auto",
      height: "300px",
    },
    ".cm-editor": {},
  },
  {
    dark: true,
  },
);

const setup = [basicSetup, customTheme, oneDark, EditorView.lineWrapping];

const useAutoUpdateRef = <T,>(value: T | undefined) => {
  const ref = useRef<T | undefined>(value);
  useImperativeHandle(ref, () => value, [value]);
  return ref;
};

export type CodeBlockController = {
  readonly value: string;
  updateValue(newValue: string): void;
};
const createController = (
  editor: () => EditorView | null | undefined,
): CodeBlockController => ({
  get value() {
    const currentEditor = editor();
    if (!currentEditor) return "";
    return currentEditor.state.doc.toJSON().join("\n");
  },
  updateValue(newValue: string) {
    const currentEditor = editor();
    if (!currentEditor) return;
    currentEditor.dispatch({
      changes: {
        from: 0,
        to: currentEditor.state.doc.length,
        insert: newValue,
      },
    });
  },
});

export type ChangeHandler = (newValue: string) => void;
type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export type CodeBlockProps = {
  ref?: React.Ref<CodeBlockController>;
  language: Extension;
  initialValue?: string;
  editable?: boolean;
  value?: string;
  onChange?: ChangeHandler;
} & Omit<DivProps, "onChange">;

const CodeBlock: FC<CodeBlockProps> = ({
  ref,
  language,
  initialValue,
  editable,
  value,
  onChange,
  ...props
}) => {
  const root = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>(null);
  const changeRef = useAutoUpdateRef(onChange);
  useEffect(() => {
    if (editor.current) return;
    if (!root.current) return;
    editor.current = new EditorView({
      extensions: [
        setup,
        language,
        EditorView.editable.of(editable ?? false),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            changeRef.current?.(update.state.doc.toJSON().join("\n"));
          }
        }),
      ],
      parent: root.current,
      doc: initialValue ?? "",
    });
  }, [initialValue, editable, language, changeRef]);
  useEffect(() => {
    if (value === undefined) return;
    if (!editor.current) return;
    editor.current.dispatch({
      changes: {
        from: 0,
        to: editor.current.state.doc.length,
        insert: value,
      },
    });
  }, [value]);
  useImperativeHandle<CodeBlockController, CodeBlockController>(ref, () =>
    createController(() => editor.current),
  );
  return <div {...props} ref={root} />;
};

export default CodeBlock;
