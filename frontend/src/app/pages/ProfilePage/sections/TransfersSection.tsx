import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Params } from '../../../utils/router/Params'

function TransfersSection() {
  const { address: currentAddress } = useAccount()
  const { profileAddress } = useParams<Params>()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentAddress !== profileAddress) {
      navigate('/')
    }
  }, [])

  return <div>TransfersSection</div>
}

export default TransfersSection
