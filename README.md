[![build-test](https://github.com/steven-r/remove-old-versions-action/actions/workflows/test.yml/badge.svg)](https://github.com/steven-r/remove-old-versions-action/actions/workflows/test.yml)

# Action to cleanup old releases based on rules

You can use this action to clean releases based on branches and parameters like number of versions to keep or downloads
# Use this template

You can use this action by referencing to `steven-r/remove-old-releases@latest`
THen you have to provide to parameters:

* `rules`
You can pass several rules (one per line) and they describe, for which branches which keep order is executed:

```
uses: steven-r/remove-old-releases@1
with:
  rules: |
    "@main: keep= 4, download=100"
    "beta": keep=3
    "fix-.*": keep=2
    "feat-.*": keep=3
    "@del": keep=0 # Remove all releases without a coresponding branch
```

For details, you might see the parameter settings below 


## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
