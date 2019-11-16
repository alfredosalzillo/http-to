import { useCallback, useState } from 'haunted';

export default (key, defaultValue) => {
  const { [key]: savedValue } = localStorage;
  const [value, setValue] = useState(savedValue || defaultValue);
  const setValueAndSave = useCallback((newValue) => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  }, [key, setValue]);
  return [value, setValueAndSave];
};
