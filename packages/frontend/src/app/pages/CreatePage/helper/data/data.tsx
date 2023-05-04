import { ComboBoxOption } from '../../../../UIkit/Form/Combobox'

export type category = 'Graphics' | 'Photos' | 'Videos' | '3D models' | 'Music' | 'Sounds' | 'Docs' | 'Promocodes' | 'Archives'
export type license = 'CC0 “No Rights Reserved”' | 'CC BY “Attribution”' | 'CC BY-ND “Attribution-NoDerivs”' | 'CC BY-SA “Attribution-ShareAlike”' | 'CC BY-NC “Attribution-NonCommercial”' | 'CC BY-NC-SA “Attribution-NonCommercial-ShareAlike”' | 'CC BY-NC-ND “Attribution-NonCommercial-NoDerivs”'
export interface licenseInfoType {
  description: string
  src: string
}
export const categoryOptions: ComboBoxOption[] = [
  {
    title: 'Graphics',
    id: '0'
  },
  {
    title: 'Photos',
    id: '1'
  },
  {
    title: 'Videos',
    id: '2'
  },
  {
    title: '3D models',
    id: '3'
  },
  {
    title: 'Music',
    id: '4'
  },
  {
    title: 'Sounds',
    id: '5'
  },
  {
    title: 'Docs',
    id: '6'
  },
  {
    title: 'Promocodes',
    id: '7'
  },
  {
    title: 'Archives',
    id: '8'
  }
]

export const subcategory: Record<category, ComboBoxOption[]> = {
  Graphics: [
    {
      title: 'Hello',
      id: '0'
    }
  ],
  Photos: [],
  Videos: [{
    title: 'Films',
    id: '0'
  },
  {
    title: 'Clips',
    id: '1'
  },
  {
    title: 'Serias',
    id: '2'
  },
  {
    title: 'Kits',
    id: '3'
  }],
  '3D models': [],
  Music: [],
  Sounds: [],
  Docs: [],
  Promocodes: [],
  Archives: []
}

export const licenseOptions: ComboBoxOption[] = [
  {
    title: 'CC0 “No Rights Reserved”',
    id: '0'
  },
  {
    title: 'CC BY “Attribution”',
    id: '1'
  },
  {
    title: 'CC BY-ND “Attribution-NoDerivs”',
    id: '2'
  },
  {
    title: 'CC BY-SA “Attribution-ShareAlike”',
    id: '3'
  },
  {
    title: 'CC BY-NC “Attribution-NonCommercial”',
    id: '4'
  },
  {
    title: 'CC BY-NC-SA “Attribution-NonCommercial-ShareAlike”',
    id: '5'
  },

  {
    title: 'CC BY-NC-ND “Attribution-NonCommercial-NoDerivs”',
    id: '6'
  }
]

export const licenseInfo: Record<license, licenseInfoType> = {
  'CC0 “No Rights Reserved”': {
    description: 'СС0 (aka CC Zero) is a public dedication tool, which allows creators to give up their copyright and put their works into the worldwide public domain. CC0 allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, with no conditions.',
    src: ''
  },
  'CC BY “Attribution”': {
    description: 'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
    src: ''
  },
  'CC BY-ND “Attribution-NoDerivs”': {
    description: 'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
    src: ''
  },
  'CC BY-SA “Attribution-ShareAlike”': {
    description: 'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms.',
    src: ''
  },
  'CC BY-NC “Attribution-NonCommercial”': {
    description: 'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
    src: ''
  },
  'CC BY-NC-SA “Attribution-NonCommercial-ShareAlike”': {
    description: 'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
    src: ''
  },
  'CC BY-NC-ND “Attribution-NonCommercial-NoDerivs”': {
    description: 'This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, and only so long as attribution is given to the creator. The license allows for commercial use.',
    src: ''
  }
}
