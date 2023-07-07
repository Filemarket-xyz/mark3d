import EFT_logo_color_png from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_color.png'
import EFT_logo_color from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_color.svg'
import EFT_logo_dark_png from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_dark.png'
import EFT_logo_dark from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_dark.svg'
import EFT_logo_light_png from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_light.png'
import EFT_logo_light from '../../../../../assets/img/BrandingPage/sub-brands/EFT_logo_light.svg'
import FB_logomark_color_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_color.png'
import FB_logomark_color from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_color.svg'
import FB_logomark_dark_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_dark.png'
import FB_logomark_dark from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_dark.svg'
import FB_logomark_light_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_light.png'
import FB_logomark_light from '../../../../../assets/img/BrandingPage/sub-brands/FB_logomark_light.svg'
import FB_logotype_color_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_color.png'
import FB_logotype_color from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_color.svg'
import FB_logotype_dark_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_dark.png'
import FB_logotype_dark from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_dark.svg'
import FB_logotype_light_png from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_light.png'
import FB_logotype_light from '../../../../../assets/img/BrandingPage/sub-brands/FB_logotype_light.svg'
import FW_logomark_blue_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_blue.png'
import FW_logomark_blue from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_blue.svg'
import FW_logomark_dark_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_dark.png'
import FW_logomark_dark from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_dark.svg'
import FW_logomark_light_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_light.png'
import FW_logomark_light from '../../../../../assets/img/BrandingPage/sub-brands/FW_logomark_light.svg'
import FW_logotype_blue_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_blue.png'
import FW_logotype_blue from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_blue.svg'
import FW_logotype_dark_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_dark.png'
import FW_logotype_dark from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_dark.svg'
import FW_logotype_light_png from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_light.png'
import FW_logotype_light from '../../../../../assets/img/BrandingPage/sub-brands/FW_logotype_light.svg'

interface ISubBrands {
  logo: {
    color: string
    dark: string
    light: string
  }
  logomarkFB: {
    color: string
    dark: string
    light: string
  }
  logotype: {
    color: string
    dark: string
    light: string
  }
  logomarkFW: {
    color: string
    dark: string
    light: string
  }
  logotypeFW: {
    color: string
    dark: string
    light: string
  }
}

export const SVG_SUB_BRANDS: ISubBrands = {
  logo: {
    color: EFT_logo_color,
    dark: EFT_logo_dark,
    light: EFT_logo_light,
  },
  logomarkFB: {
    color: FB_logomark_color,
    dark: FB_logomark_dark,
    light: FB_logomark_light,
  },
  logotype: {
    color: FB_logotype_color,
    dark: FB_logotype_dark,
    light: FB_logotype_light,
  },
  logomarkFW: {
    color: FW_logomark_blue,
    dark: FW_logomark_dark,
    light: FW_logomark_light,
  },
  logotypeFW: {
    color: FW_logotype_blue,
    dark: FW_logotype_dark,
    light: FW_logotype_light,
  },
}

export const PNG_SUB_BRANDS: ISubBrands = {
  logo: {
    color: EFT_logo_color_png,
    dark: EFT_logo_dark_png,
    light: EFT_logo_light_png,
  },
  logomarkFB: {
    color: FB_logomark_color_png,
    dark: FB_logomark_dark_png,
    light: FB_logomark_light_png,
  },
  logotype: {
    color: FB_logotype_color_png,
    dark: FB_logotype_dark_png,
    light: FB_logotype_light_png,
  },
  logomarkFW: {
    color: FW_logomark_blue_png,
    dark: FW_logomark_dark_png,
    light: FW_logomark_light_png,
  },
  logotypeFW: {
    color: FW_logotype_blue_png,
    dark: FW_logotype_dark_png,
    light: FW_logotype_light_png,
  },
}
