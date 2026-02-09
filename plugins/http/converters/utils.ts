export const stringify = (thigh: unknown) =>
  JSON.stringify(thigh, null, 4).replace(/}$/, "  }");
