import React from "react"
import { ConnectButton } from "web3uikit"

const Header = () => {
  return (
    <div>
      Testnet Lottery!
      <ConnectButton moralisAuth={false} />
    </div>
  )
}

export default Header
