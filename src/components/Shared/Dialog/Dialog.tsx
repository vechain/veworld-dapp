import {
  HTMLChakraProps,
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
  headerStyle?: HTMLChakraProps<"header">
  body?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  closeButtonStyle?: HTMLChakraProps<"button">
}
const Dialog: React.FC<IDialog> = ({
  isOpen,
  onClose,
  header,
  headerStyle = {},
  body,
  footer,
  showCloseButton = true,
  closeButtonStyle = {},
}) => {
  return (
    <Modal trapFocus={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {header && <ModalHeader {...headerStyle}>{header}</ModalHeader>}
        {showCloseButton && <ModalCloseButton {...closeButtonStyle} />}
        {body && <ModalBody>{body}</ModalBody>}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}

export default Dialog
