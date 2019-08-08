## Requirements

Requirements for developing are:

- `node.js` in version `~12.8.0`
- `yarn`

For building a ZIP archive that will be compatible with AWS Lambda are also required:

- `Linux` operating system with `x64` architecture (because of `sharp` package, see the [documentation](https://sharp.pixelplumbing.com/en/stable/install/#linux) for a list of supported operating systems)
- `node-gyp`

## Installation

```bash
$ git clone https://github.com/68publishers/image-storage-lambda.git
$ cd image-storage-lambda
$ yarn install
```

## Testing
Try to resize an image on local - firstly you must create configuration files `env-config` and `aws-config`:

```bash
$ cp config/env-config.dist config/env-config && cp config/aws-config.dist config/aws-config
```

and define values for all keys in both files. Then you can try resize some image:

```bash
$ yarn run resize path/to/document/<MODIFIER>/<document>.<extension>
```

## Build the ZIP archive

*You must build archive on x64 Linux as mentioned [above](#requirements).*

```bash
$ yarn run build
```

The archive will be stored as `./output/lambda.zip`. Now you can upload it to AWS Lambda.
