const PACKAGE_VERSION = require("../package.json").version;

console.log(`export const PACKAGE_VERSION: string = "${PACKAGE_VERSION}";`);

console.log(`export default { PACKAGE_VERSION };`);

console.error("package.json version:", PACKAGE_VERSION);
