import { styled } from '../../../styles'
import { Txt } from '../../UIkit'
import { PageLayout } from '../../UIkit/PageLayout'
import DownloadButton from './blocks/DownloadButton/DownloadButton'
import AssetsSection from './sections/AssetsSection/AssetsSection'
import Colors from './sections/Colors/Colors'
import Hero from './sections/Hero/Hero'
import SubBrandsSection from './sections/SubBrandsSection/SubBrandsSection'

const Title = styled('h2', {
  fontSize: '3.5rem',
  fontFamily: '$fourfold',
  fontWeight: '$primary',
  lineHeight: '1',
  color: '$gray700',
  marginBottom: '$4',
})

const Branding = styled('div', {
  paddingTop: '16px',
})

const StyleGuidelines = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '48px',
  borderRadius: '$4',
  border: '4px solid #A9ADB1',
  marginBottom: '160px',
})

const SectionWrapper = styled('div', {
  marginBottom: '160px',
})

export default function BrandindPage() {
  return (
    <PageLayout>
      <Branding>
        <Hero />
        <StyleGuidelines >
          <Txt h2 css={{ fontFamily: '$fourfold', color: '$gray700' }}>Style Guidelines</Txt>
          <DownloadButton downloadHref="#" bigIcon>Download</DownloadButton>
        </StyleGuidelines>
        <SectionWrapper>
          <Title>Colors</Title>
          <Colors />
        </SectionWrapper>
        <SectionWrapper>
          <Title>Assets</Title>
          <AssetsSection />
        </SectionWrapper>
        <SectionWrapper>
          <Title>Sub Brands Assets</Title>
          <SubBrandsSection />
        </SectionWrapper>
      </Branding>
    </PageLayout>
  )
}
