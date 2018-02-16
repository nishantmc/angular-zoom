const del = require('del');
del(['dist/!(*.umd.js|*.esm.js|*.d.ts|*.umd.js.map|*.esm.js.map)']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

const fs = require('fs');
let resizable = fs.readFileSync('package.json').toString();
fs.writeFileSync('dist/package.json', resizable);

resizable = fs.readFileSync('README.md').toString();
fs.writeFileSync('dist/README.md', resizable);

const packageJson = JSON.parse(fs.readFileSync('./dist/package.json').toString());
delete packageJson.devDependencies;
delete packageJson.scripts;
fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
