const safedev = `set NODE_SKIP_PLATFORM_CHECK=1 && D:\\soft\\node16\\node-v16.20.0-win-x64\\node.exe D:\\gzyhapp\\qdz-proxy2.0\\qdz-tools\\node_modules\\vite\\bin\\vite.js`;

import { exec } from "node:child_process";

exec(safedev, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }
});
