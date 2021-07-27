export const matchSymbolRegex = /^.*\?symbol=([^&]{1,}).*$/;

export function parseSymbol(url: string): string{
  return url.replace(matchSymbolRegex, "$1") || "Unable to parse symbol";
}