import React from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant, Link } from '../../UIkit'
import creator from './img/creatorImg.jpg'
import collection from './img/collection.jpg'
import Badge from '../../components/Badge/Badge'
import { Hr } from '../../UIkit/Hr/Hr'
import { NFTDeal } from '../../components/NFT'

const NFTPreviewContainer = styled('div', {
  paddingTop: '$layout$navbarheight',
  width: '100%',
  // TODO height will be set by 3d previewer
  height: 800,
  background: '$gray300'
})

const NftName = styled('h1', {
  ...textVariant('h3').true,
  color: '$blue900',
  marginBottom: '$1'
})

const MintTime = styled('p', {
  ...textVariant('primary1').true,
  color: '$gray500',
  marginBottom: '$3'
})

const BadgesContainer = styled('div', {
  display: 'flex',
  gap: '$3',
  '@sm': {
    flexDirection: 'column-reverse',
    gap: '$2'
  }
})

const GridLayout = styled(PageLayout, {
  paddingTB: 48,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'max-content',
  columnGap: '$4',
  minHeight: '100%',
  gap: '48px',
  '@md': {
    gridTemplateRows: 'max-content',
    gap: '$5',
    gridTemplateColumns: '1fr'
  }
})

const GridBlock = styled('div')

const PropertyTitle = styled('h2', {
  ...textVariant('h5').true,
  color: '$gray500',
  marginBottom: '$3'
})

const P = styled('p', {
  ...textVariant('primary1').true,
  color: '$gray500',
  fontWeight: 400
})

const StyledHr = styled(Hr, {
  marginBottom: '$3'
})

const Tag = ({
  value,
  smallText,
  isGray
}: {
  value: string
  smallText?: boolean
  isGray?: boolean
}) => {
  let fz = '$primary2'
  let color
  if (smallText) {
    fz = '$primary3'
  }

  if (isGray) {
    color = '$gray400'
  }
  return (
    <Badge content={{ value }} valueStyles={{ css: { fontSize: fz, color } }} />
  )
}
const TagsContainer = styled('div', {
  display: 'flex',
  gap: '$2',
  flexWrap: 'wrap'
})

const Ul = styled('ul', {
  listStyle: 'inside'
})

const Li = styled('li', {
  color: '$gray500',
  lineHeight: '125%',
  '&::marker': {
    fontSize: '10px',
    display: 'block',
    color: '$gray500'
  }
})

const Bold = styled('span', {
  fontWeight: 600
})

export default function NFTPage() {
  return (
    <>
      <NFTPreviewContainer></NFTPreviewContainer>
      <GridLayout>
        <GridBlock>
          <NftName>VR Glasses</NftName>
          <MintTime>Minted on Sep 9, 2022</MintTime>
          <BadgesContainer>
            <Badge
              imgUrl={creator}
              content={{ title: 'Creator', value: 'Underkong' }}
            />
            <Badge
              imgUrl={collection}
              content={{ title: 'Collection', value: 'VR Glasses by Mark3d' }}
            />
          </BadgesContainer>
        </GridBlock>

        <GridBlock>
          <NFTDeal tokenFullId={{ collectionAddress: '0xe37382f84dc2c72ef7eaac6e327bba054b30628c', tokenId: '0' }}/>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Description</PropertyTitle>
          <StyledHr />
          <P>Mark3d NFT collection for 3D Internet and virtual worlds</P>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Tags</PropertyTitle>
          <StyledHr />
          <TagsContainer>
            <Tag value='VR' />
            <Tag value='Metaverse' />
            <Tag value='Web3' />
            <Tag value='Jedi' />
            <Tag value='3D Internet' />
            <Tag value='NFT' />
            <Tag value='DAO-ART' />
            <Tag value='ART' />
            <Tag value='Tag' />
          </TagsContainer>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Object Info</PropertyTitle>
          <StyledHr />
          <Ul>
            <Li>
              <Bold>formats:</Bold> .fbx, .max, .obj, .gltf, .usdz, .glb
            </Li>
            <Li>
              <Bold>extra archive size:</Bold> 600kb
            </Li>
            <Li>
              <Bold>poly count:</Bold> 50.000
            </Li>
            <Li>
              <Bold>PBR:</Bold> Specular
            </Li>
          </Ul>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Hidden files</PropertyTitle>
          <StyledHr />
          {/* TODO later create separate component for interactivity */}
          <TagsContainer css={{ marginBottom: '$3' }}>
            <Tag value='All_files/' smallText isGray />
            <Tag value='3D_files/' smallText />
            <Tag value='Proccessed_Textures/' smallText />
          </TagsContainer>
          <Ul
            css={{
              listStyle: 'none',
              '& li:not(:last-child)': {
                marginBottom: '$2'
              }
            }}
          >
            <Li>
              <Bold>object1.glb</Bold> (64 MB)
            </Li>
            <Li>
              <Bold>object2.glb</Bold> (64 MB)
            </Li>
            <Li>
              <Bold>object3.glb</Bold> (64 MB)
            </Li>
            <Li>
              <Bold>object4.glb</Bold> (64 MB)
            </Li>
          </Ul>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Links</PropertyTitle>
          <StyledHr />
          <Ul
            css={{
              listStyle: 'none',
              '& li:not(:last-child)': {
                marginBottom: '$3'
              }
            }}
          >
            <Li>
              <Link>View on Etherscan</Link>
            </Li>
            <Li>
              <Link>View metadata</Link>
            </Li>
            <Li>
              <Link>View on IPFS</Link>
            </Li>
            <Li>
              <Link>Share</Link>
            </Li>
          </Ul>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>History</PropertyTitle>
          <StyledHr />
        </GridBlock>
      </GridLayout>
    </>
  )
}
