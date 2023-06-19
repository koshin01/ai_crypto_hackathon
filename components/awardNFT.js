import { useState, useEffect, useContext } from "react"

import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";

export default function AwardNFT({ userAddress }) {

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    const { data } = useContractRead(contract, "isValidRewardAddress", [userAddress])

    const { mutateAsync: requestReward, isLoading } = useContractWrite(contract, "requestReward")

    const awardNFT = async () => {
        try {
            const data = await requestReward({ args: [] });
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            {data && (
                <button
                    onClick={() => awardNFT()}
                    className="w-72 py-2 text-white font-semibold rounded-lg bg-slate-950 hover:bg-slate-900"
                >
                    ⭐️ GET NFT
                </button>
            )}
        </>


    )
}