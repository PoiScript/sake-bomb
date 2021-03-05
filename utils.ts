export const clsx = (...args: (string | false)[]): string =>
  args.filter(Boolean).join(" ");

export const log = (...args: any) =>
  import.meta.env.DEV && console.log(...args);

export const groupEnd = () => import.meta.env.DEV && console.groupEnd();

export const groupCollapsed = (...args: any) =>
  import.meta.env.DEV && console.groupCollapsed(...args);
