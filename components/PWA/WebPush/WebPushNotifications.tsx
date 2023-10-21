'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {
  saveWebPushSubscription
} from "@/lib/pwa"
import { MouseEventHandler, useEffect, useState } from "react"

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

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
    }
  }, [])

  useEffect(() => {
    console.log(" typeof window ", typeof window)
    console.log(" window.workbox ", window.workbox)
    console.log("serviceWorker in navigator ", "serviceWorker" in navigator)
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setOpen(false);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const subscribeButtonOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      console.error("No SW registration available.");
      return;
    }
    event.preventDefault();
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    saveWebPushSubscription(JSON.stringify(sub), programId, window.navigator.userAgent!)

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
            {/* <AlertDialogAction className="mx-20"> */}
            <button className='h-[55px] bg-primary text-primary-foreground rounded-md text-sm font-medium ' onClick={subscribeButtonOnClick}>
              Ativar Notificações
            </button>
            {/* </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}