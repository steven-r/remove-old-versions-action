import * as core from '@actions/core'
import * as github from '@actions/github'
import BranchTask from './branchtask'
import Release from './release'

interface GithubBranch {
  name: string
  // and others
}

export default class RemoveEmptyBranchesTask extends BranchTask {
  constructor(line: string, releases: Release[]) {
    super(line, '---', releases)
  }

  async execute(): Promise<boolean> {
    const gh_branches: GithubBranch[] = this.octokit?.rest.repos.listBranches({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    }) as unknown as GithubBranch[]
    const branches = gh_branches.map(b => b.name)

    const visitedBranches = new Set<string>()
    for (const release of this.releases) {
      if (visitedBranches.has(release.target_commitish)) {
        continue // has been handled
      }
      if (!branches.includes(release.target_commitish)) {
        if (this.isDryRun()) {
          core.info(`Delete branch ${release.target_commitish}`)
        } else {
          // here we go
          await this.octokit?.request(
            'DELETE /repos/{owner}/{repo}/git/refs/heads/{head_ref}',
            {
              owner: github.context.repo.owner,
              repo: github.context.repo.owner,
              read_ref: release.target_commitish
            }
          )
          core.info(`Deleted branch ${release.target_commitish}`)
        }
        visitedBranches.add(release.target_commitish)
      }
    }
    return true
  }
}
