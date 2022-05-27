import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semsort from 'semver-sort'
import Release from './release'
import Task from './task'

export default class BranchTask extends Task {
  branch: string // this is actually a glob
  downloads = 0
  keep = 3
  isMain = false

  constructor(line: string, branch: string, releases: Release[]) {
    super(line, releases)
    this.branch = branch
    this.isMain = branch === '@main'
  }

  async execute(): Promise<boolean> {
    const re = this.isMain
      ? /^v\d+\.\d+\.\d+$/
      : new RegExp(`v\\d+\\.\\d+\\.\\d+-${this.branch}\\.\\d+`)
    const match = this.releases
      .filter(v => re.test(v.tag_name))
      .reduce<Map<string, Release>>(
        (map: Map<string, Release>, obj: Release) => {
          map.set(obj.tag_name, obj)
          return map
        },
        new Map<string, Release>()
      )
    const versions = semsort.asc(Array.from(match.keys()))
    const toDelete: string[] = versions.slice(0, -this.keep - 1)
    for (const v of toDelete) {
      const m = match.get(v)
      if (m && m._downloads < this.downloads) {
        toDelete.push(v)
      }
    }
    if (!this.isDryRun()) {
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const verToDelete in toDelete) {
        const m = match.get(verToDelete)
        await this.octokit?.request(
          'DELETE /repos/{owner}/{repo}/releases/{release_id}',
          {
            owner: github.context.repo.owner,
            repo: github.context.repo.owner,
            release_id: m?.id || 0
          }
        )
      }
    } else {
      core.info(`Remove ${toDelete.join('/')}`)
    }
    return true
  }

  parse(what: string): boolean {
    if (!what || what === '') {
      // empty string do not change anything
      return true
    }
    const items = what.split(',')
    for (const item of items) {
      const split = item.split('=')
      if (split.length !== 2) {
        core.error(`syntax error at ${item} in ${this.line}`)
        return false
      }
      const cmd = split[0].trim()
      const arg = Number.parseInt(split[1].trim())
      if (isNaN(arg)) {
        core.error(`cannot parse ${split[1].trim()} in ${this.line}`)
        return false
      }
      switch (cmd) {
        case 'keep':
          this.keep = arg
          break
        case 'download':
          this.downloads = arg
          break
        default:
          core.error(`unknown command  ${cmd} in ${this.line}`)
          return false
      }
    }
    return true
  }
}
