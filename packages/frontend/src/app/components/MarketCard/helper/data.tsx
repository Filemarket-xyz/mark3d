import GlbImg from './img/3D.svg'
import AnotherImg from './img/Another.svg'
import CodeImg from './img/Code.svg'
import DocumentImg from './img/Document.svg'
import MusicImg from './img/Music.svg'
import PictureImg from './img/Picture.svg'
import RarImg from './img/Rar.svg'
import VideoImg from './img/Video.svg'

export type type = 'document' | 'music' | 'rar' | 'picture' | '3D' | 'video' | 'code' | 'another'

export const typeOptions: Record<type, string[]> = {
  '3D': [],
  another: [],
  code: [],
  document: [],
  music: [],
  picture: [],
  rar: [],
  video: []
}

export const typeImg: Record<type, string> = {
  '3D': GlbImg,
  another: AnotherImg,
  code: CodeImg,
  document: DocumentImg,
  music: MusicImg,
  picture: PictureImg,
  rar: RarImg,
  video: VideoImg
}
