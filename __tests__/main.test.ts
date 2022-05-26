//import BranchTask from '../src/branchtask'
import Release, { updateDownloadCount } from '../src/release'
import { parseCommand } from '../src/main'
import { describe, expect, test } from '@jest/globals'
import BranchTask from '../src/branchtask'


// template to start with
const _releases: Release[] = [
  { id: 1, _downloads: 0, tag_name: 'v1.0.0', target_commitish: 'main', assets: [] },
  { id: 2, _downloads: 0, tag_name: 'v1.2.0', target_commitish: 'main', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 3, _downloads: 0, tag_name: 'v1.1.1', target_commitish: 'main', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 4, _downloads: 0, tag_name: 'v2.0.0', target_commitish: 'main', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 5, _downloads: 0, tag_name: 'v2.1.0', target_commitish: 'main', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 6, _downloads: 0, tag_name: 'v1.9.0', target_commitish: 'main', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 7, _downloads: 0, tag_name: 'v1.2.0-beta.1', target_commitish: 'next', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 8, _downloads: 0, tag_name: 'v1.2.0-beta.2', target_commitish: 'next', assets: [{ name: 'a.txt', download_count: 10 }] },
  { id: 9, _downloads: 0, tag_name: 'v1.1.0-fix-demo.1', target_commitish: 'fix-demo', assets: [{ name: 'a.txt', download_count: 10 }] },
  {
    id: 10, _downloads: 0, tag_name: 'v1.1.0-oldone.1', target_commitish: 'main', assets:
      [
        { name: 'a.txt', download_count: 12 },
        { name: 'b.txt', download_count: 7 },
        { name: 'c.txt', download_count: 3 },
      ]
  },
]

describe('download count', () => {
  test('test empty assets', () => {
    let test = (r: Release) => { updateDownloadCount(r); return r._downloads }
    //var bt = new BranchTask('main: keep=3', '@main', releases);
    expect(test(_releases[0])).toBe(0);
  })

  test('regular', () => {
    let test = (r: Release) => { updateDownloadCount(r); return r._downloads }
    //var bt = new BranchTask('main: keep=3', '@main', releases);
    expect(test(_releases[1])).toBe(10);
  })

  test('multiple assets', () => {
    let test = (r: Release) => { updateDownloadCount(r); return r._downloads }
    //var bt = new BranchTask('main: keep=3', '@main', releases);
    expect(test(_releases[9])).toBe(22);
  })

  test('exception', () => {
    let test = (r: Release) => { updateDownloadCount(r); return r._downloads }
    expect(() => test({ _downloads: 0 } as unknown as Release)).toThrow(TypeError);
  })
})

describe('command line parsing', () => {
  test('main, defaults', () => {
    expect(parseCommand('@main:')).toStrictEqual(['@main', ''])
  })
  test('main, simple', () => {
    expect(parseCommand('@main: simple')).toStrictEqual(['@main', 'simple'])
  })
  test('error', () => {
    expect(() => parseCommand('@main')).toThrow('Line \'@main\' cannot be parsed')
  })
})

describe('Release action parser', () => {
  test('empty string', () => {
    let bt = new BranchTask('test:', 'test', _releases);
    expect(bt.parse(''))
    expect(bt.keep).toBe(3);
    expect(bt.downloads).toBe(0);
    expect(bt.isMain).toBe(false);
    expect(bt.branch).toBe("test");
  })

  test('keep changed', () => {
    let bt = new BranchTask('test: keep=4', 'test', _releases);
    expect(bt.parse('keep=4'))
    expect(bt.keep).toBe(4);
    expect(bt.downloads).toBe(0);
    expect(bt.isMain).toBe(false);
    expect(bt.branch).toBe("test");
  })

  test('download changed', () => {
    let bt = new BranchTask('test: download=4', 'test', _releases);
    expect(bt.parse('download=4'))
    expect(bt.keep).toBe(3);
    expect(bt.downloads).toBe(4);
    expect(bt.isMain).toBe(false);
    expect(bt.branch).toBe("test");
  })

  test('both changed', () => {
    let bt = new BranchTask('test: download=4, keep=9', 'test', _releases);
    expect(bt.parse('download=4, keep=9'))
    expect(bt.keep).toBe(9);
    expect(bt.downloads).toBe(4);
    expect(bt.isMain).toBe(false);
    expect(bt.branch).toBe("test");
  })

  test('main branch', () => {
    let bt = new BranchTask('@main: keep=4', '@main', _releases);
    expect(bt.parse('keep=4'))
    expect(bt.keep).toBe(4);
    expect(bt.downloads).toBe(0);
    expect(bt.isMain).toBe(true);
    expect(bt.branch).toBe("@main");
  })

  test('error -> wrong keyword', () => {
    let bt = new BranchTask('@main: keeper=4', '@main', _releases);
    expect(bt.parse('keeper=4')).toBe(false);
  })

  test('error -> parse-nightmare', () => {
    let bt = new BranchTask('@main: keeper===4,,,,downwhat<>4,', '@main', _releases);
    expect(bt.parse('keeper===4,,,,downwhat<>4,')).toBe(false);
  })
})