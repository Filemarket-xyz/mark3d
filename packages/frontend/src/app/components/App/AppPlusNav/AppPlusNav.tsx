import { FC, useState } from 'react'

import Logo from '../../../../assets/icons/Plus.svg'
import { styled } from '../../../../styles'
import { Button, NavLink, Popover, PopoverContent, PopoverTrigger } from '../../../UIkit'
import { paths } from './paths'

const Spacer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: '$3'
})

export const AppPlusNav: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button icon secondary small>
          <img src={Logo} alt="plus" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Spacer>
          {paths.map(path => (
            <NavLink
              to={path.to}
              key={path.to}
              onPress={() => setIsOpen(false)}
            >
              {path.label}
            </NavLink>
          ))}
        </Spacer>
      </PopoverContent>
    </Popover>
  )
}
