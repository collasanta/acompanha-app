'use client'
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { saveWebPushSubscription } from "@/lib/pwa"
import { useEffect, useState } from "react"



const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations()
  console.log('deregistering service workers', registrations)
  await Promise.all(registrations.map((r) => r.unregister()))
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

  console.log("requesting permission")
  const permission = await window?.Notification.requestPermission()

  console.log("permission", permission)

  try {
    const options = {
      applicationServerKey: VAPID_PUBLIC_KEY,
      userVisibleOnly: true,
    }
    console.log("initiating subscripition")
    const subscription = await swRegistration.pushManager.subscribe(options)
    console.log("subscription created", subscription)
    console.log("device info", window.navigator.userAgent!)
    console.log("saving subscription in DB", subscription)
    const newSubDB = await saveWebPushSubscription(subscription, programId, window.navigator.userAgent!)
    console.log("subSavedStatus", newSubDB)
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
                  <Button onClick={async () => {
                    await subscribe(programId);
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