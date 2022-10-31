import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import './styles.css'

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
        className='__swiper'
        style={{
          '--swiper-navigation-color': 'var(--colors-gray300)',
          '--swiper-navigation-size': '20px'
        }}
      >
        {imageURLS.map((url) => (
          <SwiperSlide className='__swiper-slide' key={url}>
            <img src={url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
