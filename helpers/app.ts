export const name = "ez";
export let exeName = name;
export const version = "0.1.0";

/**
 * Initialize the executable name
 * @param name - The name of the executable
 */
export function initExeName(name: string) {
  exeName = name;
}
