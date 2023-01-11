import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import React from "react"

interface IDialog {
  isOpen: boolean
  onClose: () => void
  header?: React.ReactNode
  body?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
}
const Dialog: React.FC<IDialog> = ({
  isOpen,
  onClose,
  header,
  body,
  footer,
  showCloseButton = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {header && <ModalHeader>{header}</ModalHeader>}
        {showCloseButton && <ModalCloseButton />}
        {body && <ModalBody>{body}</ModalBody>}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}

export default Dialog
