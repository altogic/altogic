/**
 * Given the absolute path to the pages folder, an absolute file path for a
 * page and the page extensions, this function will return the page path
 * relative to the pages folder. It doesn't consider index tail. Example:
 *  - `/Users/rick/my-project/pages/foo/bar/baz.js` -> `/foo/bar/baz`
 *
 * @param pagesDir Absolute path to the pages folder.
 * @param filepath Absolute path to the page.
 * @param extensions Extensions allowed for the page.
 */
export declare function absolutePathToPage(pagesDir: string, pagePath: string, extensions: string[]): string;
