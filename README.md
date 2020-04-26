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

A comma-separated list with allowed pixel densities - modified `pd`. 
Requests are validated against this list only if the list is not empty. For example `1,2,3`.

#### AllowedResolutions
Type: CommaDelimitedList

Default: empty string

A comma-separated list with allowed pixel resolutions - modifiers `w` and `h`. 
Requests are validated against this list only if the list is not empty. 
For example `300x300,300x,x200` allows requests on images with dimensions `300x300` or with `300` width and calculated height or with `200` height and calculated width.

#### AllowedQualities
Type: CommaDelimitedList

Default: empty string

A comma-separated list with allowed qualities - modifier `q`. 
Requests are validated against this list only if the list is not empty. For example: `80,90,100`.

#### EncodeQuality
Type: Number

Default: `90`

An encode quality for cached images.

#### SourceBucketName
Type: String

Default: `image-storage-source`

A unique Source Bucket's name.

#### CacheBucketName
Type: String

Default: `image-storage-cache`

A unique Cache Bucket's name.

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

## Supported modifiers and image types

#### Modifiers

| Name | Shortcut | Type | Note | 
| --- | --- | --- | --- |
| Original | original | - | A modifier without a value, use it if you want to return the original image |
| Height | h | Integer | Can be restricted by parameter `AllowedResolutions` |
| Width | w | Integer | Can be restricted by parameter `AllowedResolutions` |
| Pixel density | pd | Integer\|Float | Can be restricted by parameter `AllowedPixelDensity` |
| Aspect ratio | ar | String | Required format is `{Int\|Float}x{Int\|Float}` and a height or a width (not both) must be also defined. For example `w:200,ar:1x2` is an equivalent of `w:200,h:400` |
| Fit | f | String | See [supported fits](#supported-fits) for the list of supported values |
| Orientation | o | Integer\|String | Allowed values are `auto, 0, 90, -90, 180, -180, 270, -270` |
| Quality | q | Integer | Can be restricted by parameter `AllowedQualities` |

#### Image types

- JPEG - `.jpeg` or `.jpg`
- Progressive JPEG - `.pjpg`
- PNG - `.png`
- GIF - `.gif`
- WEBP - `.webp`

#### Supported fits

- `contain` - Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
- `stretch` - Ignore the aspect ratio of the input and stretch to both provided dimensions.
- `fill` - Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
- `crop-*` - Preserving aspect ratio, ensure the image covers both provided dimensions by cropping to fit.
    - `crop-center`
    - `crop-left`
    - `crop-right`
    - `crop-top`
    - `crop-top-left`
    - `crop-top-right`
    - `crop-bottom`
    - `crop-bottom-left`
    - `crop-bottom-right`

## Usage

Generated images are cached in a Cache Bucket. A name of the Cache Bucket that is defined by parameter `CacheBucketName`. 
If some image is requested and the Cache Bucket contains it then the image is returned directly. 
Otherwise a Lambda function is called and it will try to access the image through the Source Bucket (a name is defined by parameter `SourceBucketName`), modify it and save it to the Cache Bucket.
The Lambda function can return an error 404 or a `no-image` image if some is provided by you.

#### What is the URL of my API?

After the application will be successfully deployed you will see the application's outputs in the console like this:

```shell
CloudFormation outputs from deployed stack
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Outputs                                                                                                                                                                                                                                            
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
...                                                                                                                                                                                                     

Key                 CacheBucketDistribution                                                                                                                                                                                                        
Description         CloudFront URL for cached images - use this URL for image requests                                                                                                                                                             
Value               https://{HASH}.cloudfront.net                                                                                                                                                                                          

...                                                                                                                                          
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Successfully created/updated stack - {STACK_NAME} in {REGION}
```

The value of key `CacheBucketDistribution` is a host URL for your application.

#### Simple example

Firstly upload any image to the Source Bucket but the name of the object (your image) must be always without a file extension!
For example if your image is called `picoftheday.jpeg` and you will drop it to the root of the Source Bucket then you must rename it just to `picoftheday`.
Your image can be placed into any directory of course.

Then you can try to request some modifications of the image:

```
https://{HASH}.cloudfront.net/original/picoftheday.jpeg - returns the original image
https://{HASH}.cloudfront.net/original/picoftheday.png - returns the original image but in a PNG format
https://{HASH}.cloudfront.net/w:200,h:100,o:90/picoftheday.jpeg - returns an image with dimensions 200x100 and rotated by 90 degrees
https://{HASH}.cloudfront.net/w:200,h:100,pd:2,q:50/picoftheday.jpeg - returns an image with dimensions 400x200 (because of pixel density) and with output quality 50%
...
https://{HASH}.cloudfront.net/picoftheday.jpeg - an error 500, the URL must always contains an modifiers
https://{HASH}.cloudfront.net/foo/original/bar.jpeg - an error 404, missing object `foo/bar` in the Source Bucket
```

#### Example with NoImages

The NoImages are images provided by you that are returned instead of the 404 response if a requested image not found. For example you can configure the parameters `NoImages` and `NoImagePatterns` with this values:

- NoImages - `default::noimage/default,user::noimage/user`
- NoImagePatterns - `user::^userAvatar\/`

Then upload any images with names `default` and `user` (without file extensions again) into a directory `noimage` in the Source Bucket. So paths to objects will be `noimage/default` and `noimage/user`

Then you can try to request some nonexistent images:

```
https://{HASH}.cloudfront.net/foo/bar/w:50/baz.jpeg - an image `noimage/default` with 50px width in JPEG format is returned 
https://{HASH}.cloudfront.net/user/foo/w:50/bar.png -  an image `noimage/user` with 50px width in PNG format is returned 
```
