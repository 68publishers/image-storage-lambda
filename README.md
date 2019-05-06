## Requirements

Base requirements for developing are:

- `node.js` in version `~8.10.0`
- `npm`

For building a zip archive that will be compatible with AWS Lambda are also required:

- `Linux` operating system with `x64` architecture (because of `sharp` package, list of possible operating systems are [here](https://sharp.dimens.io/en/stable/install/#linux))
- `node-gyp`

## Installation

```bash
git clone https://gitlab.com/tg666/image-storage-lambda
cd image-storage-lambda
npm install
```

## Try resize image on local

Firstly you must create configuration files `env-config` and `aws-config`

```bash
cp config/env-config.dist config/env-config && cp config/aws-config.dist config/aws-config
```

and define values for all keys in both files. Then you can try resize some image:

```bash
npm run resize path/to/document/MODIFIER/document.extension
```

## ZIP archive build

*You must build archive on x64 Linux as mentioned [above](#requirements)*

```bash
npm run build
```

Archive will be stored as `./output/lambda.zip`.
