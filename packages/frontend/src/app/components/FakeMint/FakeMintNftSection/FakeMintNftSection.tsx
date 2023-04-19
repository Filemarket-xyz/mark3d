import React from 'react'
import { styled } from '../../../../styles'
import FakeMintNft from './FakeMintNft/FakeMintNft'
import FakeMintNftImageCommon from '../../../../assets/img/FakeMint/FakeMintCommon.png'
import FakeMintNftImageUncommon from '../../../../assets/img/FakeMint/Uncommon.png'
import FakeMintNftImageRare from '../../../../assets/img/FakeMint/Rare.png'
import FakeMintNftImageLegendary from '../../../../assets/img/FakeMint/Legendary.png'
import FakeMintNftImageMythical from '../../../../assets/img/FakeMint/Mythical.png'

import 'swiper/css'
import 'swiper/css/pagination'

import './swiper.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'

const FakeNftSectionStyle = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '22.5px',
  minHeight: '566px',
  width: '100%',
  margin: '0 120px'
})

const FakeMintNftSection = () => {
  return (
        <FakeNftSectionStyle>
            <Swiper
                slidesPerView={1}
                spaceBetween={22.5}
                loop={true}
                allowTouchMove={false}
                navigation={true}
                pagination={{
                  clickable: true
                }}
                breakpoints={{
                  900: {
                    slidesPerView: 2
                  },
                  1200: {
                    slidesPerView: 3
                  },
                  1536: {
                    slidesPerView: 4
                  },
                  1900: {
                    slidesPerView: 5
                  }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide><FakeMintNft price={'2000000000000000000'} chance={'0.33'} imageURL={FakeMintNftImageCommon} rarity={'common'}/></SwiperSlide>
                <SwiperSlide><FakeMintNft price={'13000000000000000000'} chance={'1.2'} imageURL={FakeMintNftImageUncommon} rarity={'uncommon'}/></SwiperSlide>
                <SwiperSlide><FakeMintNft price={'26000000000000000000'} chance={'2'} imageURL={FakeMintNftImageRare} rarity={'rare'}/></SwiperSlide>
                <SwiperSlide><FakeMintNft price={'52000000000000000000'} chance={'5'} imageURL={FakeMintNftImageLegendary} rarity={'legendary'}/></SwiperSlide>
                <SwiperSlide><FakeMintNft price={'104000000000000000000'} chance={'10'} imageURL={FakeMintNftImageMythical} rarity={'mythical'}/></SwiperSlide>
            </Swiper>
        </FakeNftSectionStyle>
  )
}

export default FakeMintNftSection
