import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import * as css from './styles.module.css'

import { Navigation } from 'swiper'
import { IRowContent } from '../Table/utils/tableBuilder'
import { styled } from '../../../styles'

type Props = Pick<IRowContent, 'imageURLS'>

const SwiperStyled = styled(Swiper, {})

export default function Carousel({ imageURLS }: Props) {
  return (
    <>
      <SwiperStyled
        loop
        navigation={true}
        modules={[Navigation]}
        className={css.__swiper}
        css={{
          '--swiper-navigation-color': 'var(--colors-gray300)',
          '--swiper-navigation-size': '20px'
        }}
      >
        {imageURLS.map((url) => (
          <SwiperSlide className='__swiper-slide' key={url}>
            <img className={css.img} src={url} />
          </SwiperSlide>
        ))}
      </SwiperStyled>
    </>
  )
}
