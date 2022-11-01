import React, { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const [entranceFee, setentranceFee] = useState("0")

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  useEffect(() => {
    if (isWeb3Enabled) {
      // Reads lottery entrance fee
      async function updateUi() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setentranceFee(entranceFeeFromCall)
      }
      updateUi()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      {lotteryAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterLottery()
            }}
          >
            Enter Lottery
          </button>
          Lottery entrance fee is{" "}
          {ethers.utils.formatUnits(entranceFee, "ether")} ETH
        </div>
      ) : (
        <div>No Lottery Address Detected</div>
      )}
    </div>
  )
}

export default LotteryEntrance
