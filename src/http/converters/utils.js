export const stringify = thigh => JSON
  .stringify(thigh, null, 4)
  .replace(/}$/, '  }');
