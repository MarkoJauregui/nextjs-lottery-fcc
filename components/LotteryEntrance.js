import React, { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
  // State
  // --------------------------------------

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const [entranceFee, setEntranceFee] = useState("0")
  const [numberOfParticipants, setNumberOfParticipants] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()

  // Smart Contract Functions
  // --------------------------------------

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
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

  const { runContractFunction: getNumberOfParticipants } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumberOfParticipants",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  // Handler functions
  // --------------------------------------

  const handleSuccess = async (txEvent) => {
    await txEvent.wait(1)
    handleNewNotification(txEvent)
    updateUi()
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Completed",
      title: "Tx Notification",
      position: "topR",
    })
  }

  async function updateUi() {
    const entranceFeeFromCall = (await getEntranceFee()).toString()
    const numberOfParticipantsFromCall = (
      await getNumberOfParticipants()
    ).toString()
    const recentWinnerFromCall = await getRecentWinner()
    setEntranceFee(entranceFeeFromCall)
    setNumberOfParticipants(numberOfParticipantsFromCall)
    setRecentWinner(recentWinnerFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi()
    }
  }, [isWeb3Enabled])

  // JSX
  // --------------------------------------

  return (
    <div className="font-sans subpixel-antialiased px-4 py-4">
      {lotteryAddress ? (
        <div>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold font-3xl py-2 px-4 rounded ml-auto mt-2"
            onClick={async () => {
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-borde h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lottery</div>
            )}
          </button>
          <br />
          <h2 className="text-xl">
            Lottery entrance fee is:
            <span className="font-semibold font-3xl ml-2">
              {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </span>
          </h2>
          <h2 className="text-xl">
            Number of Participants is:
            <span className="font-semibold font-3xl ml-2">
              {numberOfParticipants}
            </span>
          </h2>
          <h2 className="text-xl">
            The most recent Winner is:
            <span className="font-semibold font-3xl ml-2">{recentWinner}</span>
          </h2>
        </div>
      ) : (
        <div>No Lottery Address Detected</div>
      )}
    </div>
  )
}

export default LotteryEntrance
