// @ts-check
const path = require('path');
const ts = require('typescript');
const fs = require('fs');

module.exports.getImportsForFile = function getImportsForFile(file, srcRoot) {
    const fileInfo = ts.preProcessFile(fs.readFileSync(file).toString());
    return fileInfo.importedFiles
        .map(importedFile => importedFile.fileName)
        .filter(fileName => !/^lodash/.test(fileName)) // remove lodash
        .filter(x => !/@/.test(x)) // remove clay modules
        .filter(x => !/.js/.test(x)) // remove js imports
        .filter(x => !/.svg/.test(x)) // remove svg imports
        .filter(x => !/.png/.test(x)) // remove png imports
        .filter(x => !/.css/.test(x)) // remove css imports
        .filter(x => !/.gif/.test(x)) // remove gif imports
        .filter(x => /\//.test(x)) // remove node modules (the import must contain '/')
        .map(fileName => {
            if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
                return path.join(path.dirname(file), fileName);
            }
            // if (/^vs/.test(fileName)) {
            //     return path.join(srcRoot, fileName);
            // }`
            return fileName;
        }).map(fileName => {
            if (fs.existsSync(`${fileName}.ts`)) {
                return `${fileName}.ts`;
            }
            if (fs.existsSync(`${fileName}/index.ts`)) {
                return `${fileName}/index.ts`;
            }
            if (fs.existsSync(`${fileName}.js`)) {
                return `${fileName}.js`;
            }
            if (fs.existsSync(`${fileName}.d.ts`)) {
                return `${fileName}.d.ts`;
            }
            if (fs.existsSync(`${fileName}.tsx`)) {
                return `${fileName}.tsx`;
            }
            if (fs.existsSync(`${fileName}/index.tsx`)) {
                return `${fileName}/index.tsx`;
            }

            throw new Error(`Unresolved import ${fileName} in ${file}`);
        });
};
