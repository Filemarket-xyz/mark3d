import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import * as css from './styles.module.css'

import { Navigation } from 'swiper'
import { IRowContent } from '../Table/utils/tableBuilder'

type Props = Pick<IRowContent, 'imageURLS'>

export default function Carousel({ imageURLS }: Props) {
  return (
    <>
      <Swiper
        loop
        navigation={true}
        modules={[Navigation]}
        className={css.__swiper}
        style={{
          '--swiper-navigation-color': 'var(--colors-gray300)',
          '--swiper-navigation-size': '20px'
        }}
      >
        {imageURLS.map((url) => (
          <SwiperSlide className='__swiper-slide' key={url}>
            <img className={css.img} src={url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
