import { useEffect, useState } from 'react'

export const useScrollWindow = () => {
  const [scrollY, setScrollY] = useState(0)

  function logit() {
    setScrollY(window.pageYOffset)
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener('scroll', logit)
    }
    watchScroll()

    return () => {
      window.removeEventListener('scroll', logit)
    }
  })

  return scrollY
}
