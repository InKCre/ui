import { resolve } from "node:path";
import { repositoryRoot } from "./lib/ui-package.js";
import { verifyLogoInputs, verifyLogoPack } from "./lib/logo-pack.js";
const root = resolve(repositoryRoot, "assets/logo");
verifyLogoInputs(root);
verifyLogoPack(root);
process.stdout.write("Logo sources and committed resources match.\n");
