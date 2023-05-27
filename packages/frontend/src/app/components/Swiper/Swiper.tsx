import 'swiper/css'
import 'swiper/css/navigation'

import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { styled } from '../../../styles'
import { IRowContent } from '../../pages/ExplorerPage/components/TableRow/TableRow'
import css from './styles.module.css'

type Props = Pick<IRowContent, 'imageURLS'>

const SwiperStyled = styled(Swiper, {})

export default function Carousel({ imageURLS }: Props) {
  return (
    <SwiperStyled
      loop
      navigation
      modules={[Navigation]}
      className={css.__swiper}
      css={{
        '--swiper-navigation-color': 'var(--colors-gray300)',
        '--swiper-navigation-size': '20px',
      }}
    >
      {imageURLS.map((url) => (
        <SwiperSlide key={url} className='__swiper-slide'>
          <img className={css.img} src={url} />
        </SwiperSlide>
      ))}
    </SwiperStyled>
  )
}
