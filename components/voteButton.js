import { useState, useEffect, useContext } from "react"

import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";

import IsChangebleContext from "@/contexts/isChangebleContext"

export default function VoteButton({ index }) {

    const { isChangeable, setIsChangeable } = useContext(IsChangebleContext);

    const [voteCount, setVoteCount] = useState()

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    const { data } = useContractRead(contract, "voteCountForQuestionNumber", [index])

    const { mutateAsync: submitVoteForQuestionNumber, isLoading } = useContractWrite(contract, "submitVoteForQuestionNumber")

    const call = async (num) => {
        try {
            const data = await submitVoteForQuestionNumber({ args: [num] });
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    useEffect(() => {
        setVoteCount(parseInt(data))
    }, [data])

    const change = (num) => {
        setIsChangeable(num)
        
    }

    const vote = (num) => {
        call(num);
    }

    return (
        <div className = "flex space-x-2">
            {voteCount % 3 == 0 && voteCount !== 0 && (
                <button
                    className="py-3 px-5 h-full rounded-md border-2 border-gray-500 hover:border-gray-600 text-gray-700 font-semibold"
                    onClick={() => change(index)}>
                    Change
                </button>
            )}
            <button
                className="py-3 px-5 h-full rounded-md border-2 border-gray-500 hover:border-gray-600 text-gray-700 font-semibold"
                onClick={() => vote(index)}>
                Vote <span className = "text-green-600">{voteCount}</span>
            </button>

        </div>

    )
}