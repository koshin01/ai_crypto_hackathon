import { Fragment, useState, useEffect, useContext } from 'react'

import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";

export default function commentBoard({ questionNum, commentCount }) {

    const [currentCommnet, setCurrentCommnet] = useState([])

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    const { data } = useContractRead(contract, "indexedCommentForQuestionNumber", [questionNum, parseInt(commentCount)])

    useEffect(() => {
        setCurrentCommnet(data)
    }, [data])

    return (
        <div className="flex flex-col space-y-3">
            {currentCommnet && (
                <div className="mx-auto mt-3 font-semibold text-gray-500">📝: {currentCommnet}</div>
            )}     
        </div>
    )
}