import * as core from '@actions/core'
import * as github from '@actions/github'
import BranchTask from './branchtask'
import {Octokit} from '@octokit/rest'
import Release from './release'
import RemoveEmptyBranchesTask from './removeemptybranchestask'
import Task from './task'

let tasks: Task[]
let token: string
let octokit: Octokit
let repos: string
let owner: string
let allreleases: Release[]

export function parseCommand(line: string): string[] {
  const res = line.match(/^([^:]+):\s*(.*)\s*$/)
  if (!res) {
    throw new Error(`Line '${line}' cannot be parsed`)
  }
  const branch = res[1]
  const args = res[2]
  if (branch === null || args === null) {
    throw new Error(
      `Line '${line}' cannot be parsed. Either branch or args are missing`
    )
  }
  return [branch, args]
}

async function run(): Promise<void> {
  try {
    const lines: string[] = core.getMultilineInput('tasks')
    if (lines.length === 0) {
      core.error('Please provide tasks to be executed')
      return
    }
    token = core.getInput('token')
    if (!token) {
      core.error('Please provide either GITHUB_TOKEN || GH_TOKEN')
      return
    }

    octokit = new Octokit({
      auth: token
    })
    owner = github.context.repo.owner
    repos = github.context.repo.repo
    github.getOctokit(token)

    allreleases = (await octokit.request('GET /repos/{owner}/{repo}/releases', {
      owner,
      repo: repos
    })) as unknown as Release[]

    core.debug(`parsing ${lines.length} commands ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const line in lines) {
      let task: Task
      const [branch, args] = parseCommand(line)
      if (branch === '@del') {
        task = new RemoveEmptyBranchesTask(line, allreleases)
      } else {
        task = new BranchTask(line, branch, allreleases)
      }
      if (task.parse(args)) {
        tasks.push(task)
      } else {
        return
      }
      // eslint-disable-next-line github/array-foreach
      tasks.forEach(t => {
        if (!t.execute()) {
          return
        }
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
