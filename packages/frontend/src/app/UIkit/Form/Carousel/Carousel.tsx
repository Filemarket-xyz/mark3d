import React, {FC, ReactNode} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import arrowBack from '../../../../assets/icons/arrow-back-outline.svg'
import arrowNext from '../../../../assets/icons/arrow-forward-outline.svg'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Navigation } from 'swiper';
import {styled} from "../../../../styles";



const CarouselStyle = styled('div', {})

interface CarouselProps {
    content: ReactNode[]
}

const Carousel: FC<CarouselProps> = ({ content }: CarouselProps) => {
    return (
            <CarouselStyle>
                <h1 className="heading">Fake Mint</h1>
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={'auto'}
                    createElements={true}
                    coverflowEffect={{
                        stretch: 0,
                        rotate: 0,
                        depth: 100,
                        modifier: 2.5,
                    }}
                    spaceBetween={50}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }}
                    modules={[EffectCoverflow, Navigation]}
                    className="swiper_container"
                >
                    {content.map((item, index) => {
                        return <SwiperSlide key={index} style={{
                            width: '300px'
                        }}>
                            {item}
                        </SwiperSlide>
                    })}
                    <div className="slider-controler">
                        <div className="swiper-button-prev slider-arrow">
                            <img src={arrowBack}/>
                        </div>
                        <div className="swiper-button-next slider-arrow">
                            <img src={arrowNext}/>
                        </div>
                    </div>
                </Swiper>
            </CarouselStyle>
    );
}

export default Carousel;