'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { saveWebPushSubscription } from "@/lib/pwa"
import { useEffect, useState } from "react"

const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations()
  console.log('deregistering service workers: ', registrations)
  await Promise.all(registrations.map((r) => r.unregister()))
  const registrations2 = await navigator.serviceWorker.getRegistrations()
  console.log('deregistering service workers done', registrations2)

}

const registerServiceWorker = async () => {
  console.log("registering service worker")
  const registersw = await navigator.serviceWorker.register('/sw.js')
  console.log('service worker registered', registersw)
  return registersw
}

const subscribe = async (programId: string) => {
  await unregisterServiceWorkers()
  const swRegistration = await registerServiceWorker()
  const permission = await window?.Notification.requestPermission()
  console.log('permission', permission)
  try {
    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      userVisibleOnly: true,
    }
    const subscription = await swRegistration.pushManager.subscribe(options)
    const newSubDB = await saveWebPushSubscription(JSON.stringify(subscription), programId, window.navigator.userAgent!)
  } catch (err) {
    console.error('Error', err)
  }
}

export default function Notifications({ programId }: { programId: string }) {

  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(true)

  useEffect(() => {
    const showNotifications = async () => {

      if (!(window.Notification && navigator.serviceWorker && window.PushManager)) {
        console.log("notifications not supported")
        return false
      } else if (Notification.permission === 'denied') {
        console.log("notifications denied")
        return false
      } else if (Notification.permission === 'granted') {
        console.log("notifications granted")
        return false
      } else {
        console.log("show enable notifications")
        setShowNotification(true)
      }

    }
    showNotifications()
  }, [])

  return (
    <>
      {
        showNotification && (
          <AlertDialog open={open}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bem vindo ao seu Diário.Fit 🎉</AlertDialogTitle>
                <AlertDialogDescription className="py-2">
                  Para prosseguir, ative as notificações clicando no botão abaixo👇
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>
                  <Button className='' onClick={() => {
                    subscribe(programId);
                    setOpen(false)
                  }}>
                    Ativar Notificações
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    </>
  )
}