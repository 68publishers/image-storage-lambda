'use strict';

((Zipper, Path) => {

    Zipper.build({
        files: [
            'modules',
            'bootstrap.js',
            'index.js'
        ],
        workingDir: Path.join(__dirname, '/../'),
        outputPath: 'output/lambda.zip',
        flattenRoot: true
    });

})(require('lambda-zipper/src/zipper'), require('path'));
