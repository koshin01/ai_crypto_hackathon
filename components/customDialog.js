import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, useContext } from 'react'

import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";

import IsOpenContext from "@/contexts/isOpenContext";

import CommentBoard from '@/components/commentBoard';

export default function CustomDialog({ title, questionNum}) {

    const { isOpen, setIsOpen } = useContext(IsOpenContext);

    const [comment, setComment] = useState()

    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    const { mutateAsync: setCommentForQuestionNumber, isLoading } = useContractWrite(contract, "setCommentForQuestionNumber")

    // コメント数を取得（定数名はdata で固定）
    const { data } = useContractRead(contract, "commentCountByQuestion", [questionNum])

    const call = async (comment_number, _comment) => {
        try {
            const data = await setCommentForQuestionNumber({ args: [comment_number, _comment] });
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    const sendComment = () => {
        call(questionNum, comment)
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 mt-7">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="comment ..."
                                        />
                                        <button 
                                            onClick={() => sendComment()}
                                            className="inline-flex justify-center p-2 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                                            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                        </button>
                                    </div>  
                                    {[...Array(7)].map((_, i) => <CommentBoard questionNum = {questionNum} commentCount = {i}/> )}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            閉じる
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
