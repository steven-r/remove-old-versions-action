import Asset from './asset'

export default interface Release {
  url: string
  id: number
  tag_name: string
  target_commitish: string
  _downloads: number
  assets: Asset[]
}
