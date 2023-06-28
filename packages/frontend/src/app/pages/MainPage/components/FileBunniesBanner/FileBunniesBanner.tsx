import React from 'react'
import { useNavigate } from 'react-router-dom'

import ChervyakImg from '../../img/FileBunniesBanner/Chervyak.svg'
import StarImg from '../../img/FileBunniesBanner/Star.svg'
import { ContainerBunnies, FileBunniesBannerStyled, MainBanner, MainBannerBlock } from './FileBunniesBanner.styled'

const FileBunniesBanner = () => {
  const navigate = useNavigate()

  return (
    <FileBunniesBannerStyled onClick={() => { navigate('/market') }}>
      <img src={ChervyakImg} className={'chervyak'} />
      <ContainerBunnies>
        <MainBannerBlock>
          <MainBanner />
          <img src={StarImg} className={'star'} />
        </MainBannerBlock>
      </ContainerBunnies>
    </FileBunniesBannerStyled>
  )
}

export default FileBunniesBanner
