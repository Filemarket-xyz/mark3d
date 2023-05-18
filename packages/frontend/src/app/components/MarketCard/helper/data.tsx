import GlbImg from './img/3D.svg'
import AnotherImg from './img/Another.svg'
import CodeImg from './img/Code.svg'
import DocumentImg from './img/Document.svg'
import MusicImg from './img/Music.svg'
import PictureImg from './img/Picture.svg'
import RarImg from './img/Rar.svg'
import VideoImg from './img/Video.svg'

export type typeFiles = 'document' | 'music' | 'rar' | 'picture' | '3D' | 'video' | 'code' | 'another'

export const typeOptions: Record<typeFiles, string[]> = {
  '3D': ['.obj', '.3ds', '.fbx', '.dae', '.blend', '.stl', '.ply', '.max', '.glb', '.gltf'],
  another: [],
  code: ['.c', '.cpp', '.h', '.hpp', '.java', '.py', '.rb', '.html', '.css', '.js', '.php', '.sql', '.xml'],
  document: ['.doc', '.docx', '.pdf', '.txt', '.rtf', '.odt', '.wpd', '.tex', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.ods'],
  music: ['.mp3', '.wav', '.aac', '.wma', '.flac', '.m4a', '.ogg', '.ape', '.alac'],
  picture: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.psd', '.ai', '.eps'],
  rar: ['.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.xz'],
  video: ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.mpeg', '.mpg', '.3gp', '.webm']
}

export const typeImg: Record<typeFiles, string> = {
  '3D': GlbImg,
  another: AnotherImg,
  code: CodeImg,
  document: DocumentImg,
  music: MusicImg,
  picture: PictureImg,
  rar: RarImg,
  video: VideoImg
}
