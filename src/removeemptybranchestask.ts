import BranchTask from './branchtask'
import Release from './release'

export default class RemoveEmptyBranchesTask extends BranchTask {
  constructor(line: string, releases: Release[]) {
    super(line, '---', releases)
  }

  execute(): boolean {
    return true
  }
}
