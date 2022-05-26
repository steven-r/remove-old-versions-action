import {Octokit} from '@octokit/rest'
import Release from './release'

export default abstract class Task {
  readonly line: string
  releases: Release[]
  private dryRun = true
  protected octokit?: Octokit = undefined

  constructor(line: string, releases: Release[]) {
    this.line = line
    this.releases = releases
  }

  abstract execute(): Promise<boolean>
  abstract parse(what: string): boolean
  setDryRun(dryRun: boolean): void {
    this.dryRun = dryRun
  }
  isDryRun(): boolean {
    return this.dryRun || !this.octokit
  }
  setOctokit(kit: Octokit): void {
    this.octokit = kit
  }
}
