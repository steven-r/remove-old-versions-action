import Asset from './asset'

export default interface Release {
  id: number
  tag_name: string
  target_commitish: string
  _downloads: number
  assets: Asset[]
}

export function updateDownloadCount(release: Release): void {
  release._downloads = release.assets.reduce((cnt: number, current: Asset) => {
    cnt += current.download_count
    return cnt
  }, 0)
}
