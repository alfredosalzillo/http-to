import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export type UseLocalStorageStateOptions<S> = {
  convert: (value: string) => S;
};
const useLocalStorageState = <S>(
  key: string,
  defaultValue: S | (() => S),
  options: UseLocalStorageStateOptions<S> = {
    convert: (value) => JSON.parse(value) as S,
  },
): [S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState<S>(defaultValue);
  // biome-ignore lint/correctness/useExhaustiveDependencies: should only depend on key
  useEffect(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      setState(options.convert(savedValue));
    }
  }, [key]);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export default useLocalStorageState;
