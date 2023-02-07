export function cn(...classNames: any[]) {
  return classNames.filter(Boolean).join(" ");
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function isMobile() {
  return "orientation" in window;
}
