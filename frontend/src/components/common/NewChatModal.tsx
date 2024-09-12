import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";

export default function NewChatModal({ handleNewChat, setNewChatEmail }: { handleNewChat: () => void, setNewChatEmail: React.Dispatch<React.SetStateAction<string>> }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen} size="sm" radius="full" className="absolute h-10 bottom-4 right-4  bg-primary text-white  flex items-center justify-center"> + </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">New Chat</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Email"
                                    placeholder="Enter the email"
                                    variant="bordered"
                                    onChange={
                                        (e) => setNewChatEmail(e.target.value)
                                    }
                                />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => {
                                    handleNewChat()
                                    onClose()
                                }}>
                                    New Chat
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
