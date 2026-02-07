'use client'

import { useEffect } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden'

      // ESC key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}
