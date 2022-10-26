import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import './styles.css'

import { Navigation } from 'swiper'

export default function Carousel() {
  return (
    <>
      <Swiper
        loop
        navigation={true}
        modules={[Navigation]}
        className='mySwiper'
        style={{
          '--swiper-navigation-color': 'var(--colors-gray300)',
          '--swiper-navigation-size': '20px'
        }}
      >
        <SwiperSlide>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkr5DeFDSovK8qwXEboMHpVepp1IjRRcaM_6hayCYAw&s'
            alt=''
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src='https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg'
            alt=''
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src='https://www.whatsappimages.in/wp-content/uploads/2021/07/Top-HD-sad-quotes-for-whatsapp-status-in-hindi-Pics-Images-Download-Free.gif'
            alt=''
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
