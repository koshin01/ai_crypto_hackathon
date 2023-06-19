import Hero from "@/components/hero"

import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";

export default function Home() {

  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  // コントラクトに保存されている質問文を全て取得（定数名はdata で固定）
  const { data, isLoading } = useContractRead(contract, "getAllQuestions", [])

  return (
    <Hero questionContext={data}/>
  )
}
