import { ThemeState } from '@/features/theme/themeSlice'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

interface ModalProps {
    children: ReactNode
    onClose: () => void
}
interface RootState {
    theme: ThemeState
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    const { background, text } = useSelector((state: RootState) => state.theme)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={` ${background} rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full`}>
                <div className="flex justify-end p-2">
                    <button
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}

export default Modal
