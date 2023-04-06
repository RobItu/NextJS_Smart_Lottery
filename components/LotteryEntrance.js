import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { use, useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
const EventEmitter = require("events")
import Moralis from "moralis"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumPlayer] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayerfromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerfromCall = await getRecentWinner()
        setNumPlayer(numPlayerfromCall)
        setEntranceFee(entranceFeeFromCall)
        setRecentWinner(recentWinnerfromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    useEffect(() => {
        const displayWinner = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(
                "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
                abi,
                provider
            )

            contract.on("WinnerPicked", (recentWiner) => {
                updateUI()
            })
        }

        displayWinner()
    }, [recentWinner])

    return (
        <div>
            Enter the lottery!
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
                    Number of Players: {numPlayer}
                    Recent Winner: {recentWinner}
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}
