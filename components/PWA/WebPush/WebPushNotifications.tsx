'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {
  base64ToUint8Array,
  saveWebPushSubscription
} from "@/lib/pwa"
import { MouseEventHandler, useEffect, useState } from "react"

export default function Notifications({ programId }: { programId: string }) {
  const [open, setOpen] = useState<boolean>(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!(window.Notification && navigator.serviceWorker && window.PushManager)) {
      console.log("notifications not supported")
    } else if (Notification.permission === 'denied') {
      console.log("notifications denied")
    } else if (Notification.permission === 'granted') {
      console.log("notifications granted")
    } else {
      console.log("show enable notifications")
      setOpen(true)
      // Get Service Worker registration
      if (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        window.workbox !== undefined
      ) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            if (
              sub &&
              !(
                sub.expirationTime &&
                Date.now() > sub.expirationTime - 5 * 60 * 1000
              )
            ) {
              console.log("User already Subscribed");
              setOpen(false)
            }
          });
          setRegistration(reg);
        });
      }
    }
  }, [])

  const subscribeButtonOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    const sub = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    await saveWebPushSubscription(JSON.stringify(sub), programId, window.navigator.userAgent!)

    setOpen(false)
    console.log("Web push subscribed!");
    console.log(sub);
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-[50px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Bem vindo ao seu Diário.Fit 🎉</AlertDialogTitle>
            <AlertDialogDescription className="py-2">
              Para prosseguir, ative as notificações clicando no botão abaixo👇
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="mx-20">
              <button className='' onClick={subscribeButtonOnClick}>
                Ativar Notificações
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}