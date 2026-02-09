// eslint-disable-next-line import/prefer-default-export
export const stringify = (thigh: any) =>
  JSON.stringify(thigh, null, 4).replace(/}$/, "  }");
