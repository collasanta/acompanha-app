'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {
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

  const base64ToUint8Array = async (base64: string) => {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  
    const rawData = window.atob(b64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeButtonOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    const sub = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: await base64ToUint8Array(
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