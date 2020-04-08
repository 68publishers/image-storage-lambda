# Image Storage Lambda

AWS SAM application for generating images on-the-fly based on [sharp](https://github.com/lovell/sharp).

The concept of an image processing and a configuration is based on our PHP package [68publishers/image-storage](https://github.com/68publishers/image-storage) so this SAM application can be used as an `external` image server for `image-storage`.
But the application can be used standalone without `image-storage` of course.

## Requirements

- docker
- npm
- AWS SAM CLI

Please follow an official Amazon documentation if you don't have the AWS SAM CLI installed already:

- [Installing the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Setting Up AWS Credentials](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-set-up-credentials.html)

## Build and Deploy

```bash
$ sam build
$ sam deploy --guided
```

## Application parameters

#### BasePath
Type: String

Default: empty string

A base path for cached images. For example if you set this parameter as `foo` then a root directory for all cached images will be `foo`.

#### ModifierSeparator
Type: String

Default: `,`

A separator for modifier definitions in a path. 
For example if you set this parameter as `;` then a modifier string in a path will look like this: `w:100;o:auto`.

#### ModifierAssigner
Type: String

Default: `:`

An assigner for modifier definitions in a path. 
For example if you set this parameter as `=` then a modifier string in a path will look like this: `w=100,o=auto`.

#### SignatureParameterName
Type: String

Default: `_s`

A query parameter's name used for a signature token.

#### SignatureKey
Type: String

Default: empty string

Your private signature key used for a token encryption. 
Signatures in requests are checked and validated only if this parameter is set.

#### SignatureAlgorithm
Type: String

Default: `sha256`

An algorithm used for encryption of signatures (HMAC).

#### AllowedPixelDensity
Type: CommaDelimitedList

Default: empty string

A comma separated list with allowed pixel densities - modified `pd`. 
Requests are validated against this list only if the list is not empty. For example `1,2,3`.

#### AllowedResolutions
Type: CommaDelimitedList

Default: empty string

A comma separated list with allowed pixel resolutions - modifiers `w` and `h`. 
Requests are validated against this list only if the list is not empty. 
For example `300x300,300x,x200` allows requests on images with dimensions `300x300` or with `300` width and calculated height or with `200` height and calculated width.

#### AllowedQualities
Type: CommaDelimitedList

Default: empty string

A comma separated list with allowed qualities - modifier `q`. 
Requests are validated against this list only if the list is not empty. For example: `80,90,100`.

#### EncodeQuality
Type: Number

Default: `90`

An encode quality for cached images.

#### SourceBucketPostfix
Type: String

Default: `source`

A postfix for the Source Bucket's name. Final Bucket's name is in format `{stack name}-{postfix}`.

#### CacheBucketPostfix
Type: String

Default: `cache`

A postfix for the Cache Bucket's name. Final Bucket's name is in format `{stack name}-{postfix}`.

#### NoImages
Type: CommaDelimitedList

Default: empty string

Named paths for no-images in format `name::path`. 
For example `default::noimage/noapp` is a definition for a default no-image image that is stored as `noimage/noapp`.

#### NoImagePatterns
Type: CommaDelimitedList

Default: empty string

Named patterns for no-images in format `name::pattern`. 
or example if you define `user::^userAvatar\/` and a path of a requested image will match regex then a no-image named `user` will be returned.
