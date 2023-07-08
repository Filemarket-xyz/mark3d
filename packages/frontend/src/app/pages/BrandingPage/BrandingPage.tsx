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
  '@md': {
    fontSize: '3rem',
  },
  '@sm': {
    fontSize: '2.5rem',
  },
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
  '@md': {
    padding: '35px',
    marginBottom: '80px',
  },
  '@sm': {
    flexDirection: 'column',
    padding: '24px',
    rowGap: '24px',
    a: {
      minWidth: '100%',
    },
  },
})

const StyleGuidelinesText = styled(Txt, {
  fontFamily: '$fourfold',
  fontSize: '$h2',
  fontWeight: '$primary',
  lineHeight: '1',
  color: '$gray700',
  '@sm': {
    fontSize: '$h3',
  },
})

const SectionWrapper = styled('div', {
  marginBottom: '160px',
  '@md': {
    marginBottom: '80px',
  },
})

export default function BrandindPage() {
  return (
    <PageLayout>
      <Branding>
        <Hero />
        <StyleGuidelines >
          <StyleGuidelinesText>Style Guidelines</StyleGuidelinesText>
          <DownloadButton downloadHref="#" bigIcon bigBtn>Download</DownloadButton>
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
