import { useState, useEffect, useContext } from "react"

import { ConnectWallet } from "@thirdweb-dev/react";

import { useContract, useContractWrite, useContractRead, useContractEvents } from "@thirdweb-dev/react";

import IsOpenContext from "@/contexts/isOpenContext"

import IsChangebleContext from "@/contexts/isChangebleContext"

import CustomDialog from "@/components/customDialog";

import VoteButton from "@/components/voteButton"

export default function Hero({ questionContext }) {

    const [context, setContext] = useState()

    const [answer, setAnswer] = useState()

    const [question, setQuestion] = useState([])

    const [commentQuestionNum, setCommentQuestionNum] = useState()

    const [questionNum, setQuestionNum] = useState()

    const [isChangeable, setIsChangeable] = useState()

    const [isOpen, setIsOpen] = useState(false)

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    // コントラクトに保存されている解答を全て取得（定数名はdata で固定）
    const { data } = useContractRead(contract, "getAllAnswers", [])

    const { mutateAsync: changeQuestion, isLoading } = useContractWrite(contract, "changeQuestion")

    // 質問文と解答を送信する
    const call = async (_number, _question, _answer) => {
        try {
            const data = await changeQuestion({ args: [_number, _question, _answer] });
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    useEffect(() => {
        init();
    }, [questionContext])

    // 質問文と解答の配列を、ひとつの配列に変換
    const init = async () => {
        if (questionContext && data) {
            let questionArray = new Array();

            await questionContext.forEach((element) => {
                questionArray.push({ "context": element })
            })

            await data.forEach((element, index) => {
                questionArray[index].answer = element
            })
            setQuestion(questionArray)
        }
    }

    const openAnswer = async (num) => {
        await setQuestionNum(num);
    }

    const comment = (num) => {
        setCommentQuestionNum(num)
        setIsOpen(true)
    }

    const sendNewQuestion = async(num) => {
        console.log(num)
        console.log(context)
        console.log(answer)
        await call(num, context, answer)
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-72 space-y-7 mt-10 mx-auto">
                <h1 className="text-3xl font-bold text-center">DAIS</h1>
                <ConnectWallet />
            </div>
            <div className="space-y-7 flex flex-col mt-10">
                {question.slice(0).map((question, index) => {
                    return (
                        <div key={index} className="mx-auto flex flex-row w-6/12">
                            <div>
                                {isChangeable === index ? (
                                    <div className="flex">
                                        <textarea
                                            value={context}
                                            onChange={(e) => setContext(e.target.value)}
                                            className="resize-none rounded-full h-6 pl-3 py-0 font-semibold text-gray-700 my-auto border-2 border-gray-200"
                                            placeholder="質問文">
                                        </textarea>
                                    </div>
                                ) : (
                                    <div className="font-semibold text-2xl">{question.context}</div>
                                )}

                                {questionNum === index ? (
                                    <span className="font-semibold text-gray-700">{question.answer}</span>
                                ) : (
                                    <>
                                        {isChangeable === index ? (
                                            <div className="flex">
                                                <textarea
                                                    value={answer}
                                                    onChange={(e) => setAnswer(e.target.value)}
                                                    className="resize-none rounded-full h-6 pl-3 py-0 font-semibold text-gray-700 my-auto border-2 border-gray-200"
                                                    placeholder="解答">
                                                </textarea>
                                                <button
                                                    onClick={() => sendNewQuestion(index)}
                                                    className="inline-flex justify-center p-2 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
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
                            <div className="flex space-x-2 ml-auto">
                                <IsChangebleContext.Provider value={{ isChangeable, setIsChangeable }}>
                                    <VoteButton index={index} />
                                </IsChangebleContext.Provider>
                                <button
                                    className="py-3 px-5 rounded-md border-2 border-gray-500 hover:border-gray-600 text-gray-700 font-semibold"
                                    onClick={() => comment(index)}>
                                    Comment
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>
                {isOpen && (
                    <CustomDialog title="この問題に提案しますか？" questionNum = {commentQuestionNum} />
                )}  
            </IsOpenContext.Provider>
        </div>
    )
}