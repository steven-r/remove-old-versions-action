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
    "beta": keep=3"
    "fix-.*": keep=2"
    "feat-.*": keep=3"
    "@del": keep=0" # Remove all releases without a coresponding branch
```

* `token`
Please provide a valid github private access token. This will be in general `${{ github.TOKEN }}`.

* `dry-run`
You can set `dry-run` to `true`, to prevent the actual action to be performed. 

As this action can do serious harm to your repositories, the default for `dry-run` is `true`. You have to set it explicitly to `false` to really perform the actions.
