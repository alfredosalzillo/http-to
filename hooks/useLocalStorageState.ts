import { useEffect, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';

const isDefaultValueFactory = <S>(value: unknown): value is (() => S) => typeof value === 'function';

export type UseLocalStorageStateOptions<S> = {
  convert: (value: string) => S,
}
const useLocalStorageState = <S>(
  key: string,
  defaultValue: S | (() => S),
  options: UseLocalStorageStateOptions<S> = {
    convert: (value) => JSON.parse(value) as S,
  },
): [S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState<S>(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      return options.convert(savedValue);
    }
    if (isDefaultValueFactory(defaultValue)) {
      return defaultValue();
    }
    return defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export default useLocalStorageState;
