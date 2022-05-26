import Release from './release'

export default abstract class Task {
  readonly line: string
  releases: Release[]

  constructor(line: string, releases: Release[]) {
    this.line = line
    this.releases = releases
  }

  abstract execute(): boolean
  abstract parse(what: string): boolean
}
