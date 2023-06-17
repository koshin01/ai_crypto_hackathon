import { useState, useEffect, useContext } from "react"

import { ConnectWallet } from "@thirdweb-dev/react";

import IsOpenContext from "@/contexts/isOpenContext"

import CustomDialog from "@/components/customDialog";


export default function Home() {

  const [question, setQuestion] = useState([])

  const [questionNum, setQuestionNum] = useState()

  const [isChangeable, setIsChangeable] = useState()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setQuestion([{ context: "ライオンの生息地は？", answer: "アフリカ" }, { context: "魚を英語で言うと？", answer: "fish" }, { context: "都道府県の数は？", answer: "47" }, { context: "日本の首都は？", answer: "東京" }]);
  }, [])

  const openAnswer = async (num) => {
    await setQuestionNum(num);
  }

  const suggest = () => {
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-72 space-y-7 mt-10 mx-auto">
        <h1 className="text-3xl font-bold text-center">DAiS</h1>
        <ConnectWallet />
      </div>
      <div className="space-y-7 flex flex-col mt-10">
        {question.slice(0).reverse().map((question, index) => {
          return (
            <div key={index} className="mx-auto flex flex-row w-6/12">
              <div>
                <div className="font-semibold text-2xl">{question.context}</div>
                {questionNum === index ? (
                  <span className="font-semibold text-gray-700">{question.answer}</span>
                ) : (
                  <>
                    {isChangeable === index ? (
                      <div className="flex">
                        <textarea className="resize-none rounded-full h-6 pl-3 py-0 font-semibold text-gray-700 my-auto border-2 border-gray-200"></textarea>
                        <button className="inline-flex justify-center p-2 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                          <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                      </div>
                    ) : (
                      <button className="px-24 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l rounded-full"
                        onClick={() => openAnswer(index)}
                      >👀</button>
                    )}
                  </>
                )}
              </div>
              <button
                className="py-3 px-7 rounded-md ml-auto border-2 border-gray-500 hover:border-gray-600 text-gray-700 font-semibold"
                onClick={() => suggest()}>
                Suggest
              </button>
            </div>
          );
        })}
      </div>
      <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>
        <CustomDialog title="この問題に提案しますか？" />
      </IsOpenContext.Provider>
    </div>
  )
}
