'use client'

import { useEffect, useState } from 'react'

type EmailSenderProps = {
  sessionId: string
}

export default function EmailSender({ sessionId }: EmailSenderProps) {
  const [emailStatus, setEmailStatus] = useState<'sending' | 'success' | 'error' | null>(null)

  useEffect(() => {
    const sendEmails = async () => {
      try {
        setEmailStatus('sending')
        console.log('📧 Sending emails for session:', sessionId)

        const response = await fetch('/api/send-order-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const result = await response.json()

        if (response.ok) {
          console.log('✅ Emails sent successfully:', result)
          setEmailStatus('success')
        } else {
          console.error('❌ Failed to send emails:', result)
          setEmailStatus('error')
        }
      } catch (error) {
        console.error('❌ Error sending emails:', error)
        setEmailStatus('error')
      }
    }

    // Only send emails once when component mounts
    if (sessionId) {
      sendEmails()
    }
  }, [sessionId])

  // Don't render anything visible to the user
  // This component works silently in the background
  return null
}