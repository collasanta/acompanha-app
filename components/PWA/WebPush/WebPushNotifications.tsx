'use client'

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  saveWebPushSubscription
} from "@/lib/pwa"
import { MouseEventHandler, useEffect, useState } from "react"
//@ts-ignore
import { useSubscribe, Errors } from 'react-pwa-push-notifications';
const { getSubscription } = useSubscribe({ publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });

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

// const subscribe = async (programId: string) => {
//   await unregisterServiceWorkers()
//   const swRegistration = await registerServiceWorker()
//   const permission = await window?.Notification.requestPermission()
//   console.log('permission', permission)
//   try {
//     const options = {
//       applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
//       userVisibleOnly: true,
//     }
//     const subscription = 
//     await saveWebPushSubscription(JSON.stringify(await swRegistration.pushManager.subscribe(options)), programId, window.navigator.userAgent!)
//   } catch (err) {
//     console.error('Error', err)
//   }
// }

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

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
      console.log("oi0")
      console.log( " typeof window ", typeof window )
      console.log( " window.workbox ", window.workbox )
      console.log( "serviceWorker in navigator ", "serviceWorker" in navigator )
      if (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        window.workbox !== undefined
      ) {
        // run only in browser
        console.log("oi")
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            if (
              sub &&
              !(
                sub.expirationTime &&
                Date.now() > sub.expirationTime - 5 * 60 * 1000
              )
            ) {
              setSubscription(sub);
              setIsSubscribed(true);
            }
          });
          setRegistration(reg);
        });
      }
    }, []);

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
    // TODO: you should call your API to save subscription data on the server in order to send web push notification from the server
    await saveWebPushSubscription(JSON.stringify(sub), programId, window.navigator.userAgent!)
    setSubscription(sub);
    setIsSubscribed(true);
    console.log("Web push subscribed!");
    console.log(sub);
  };

  const sendNotificationButtonOnClick: MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();
    if (!subscription) {
      console.error("Web push not subscribed");
      return;
    }

    await fetch("/api/notifications/all", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      // body: JSON.stringify({
      //   subscription,
      // }),
    });
  };

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
                {/* <AlertDialogAction> */}
                  <button className='py-4 pr-4 mr-4 border border-2 border-black' onClick={subscribeButtonOnClick}>
                    {/* // {async() => {
                  //   // subscribe()
                  //     await unregisterServiceWorkers()
                  //     const swRegistration = await registerServiceWorker()
                  //     // const permission = await window?.Notification.requestPermission()
                  //     // console.log('permission', permission)
                      
                  //     const options = {
                  //       applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
                  //       userVisibleOnly: true,
                  //     }                        
                  //     // const oldSubscription = JSON.stringify(await swRegistration.pushManager.subscribe(options))
                      
                  //     const Subscription = await getSubscription();
                  //     console.log('Subscription', Subscription)
                  //     const subscription =  await saveWebPushSubscription(JSON.stringify(Subscription), programId, window.navigator.userAgent!) 
                  //     console.log('subscription db saved', subscription)                     
                  //     setOpen(false)
                  // }}> */}
                    Ativar Notificações
                  </button>
                  <button className="mt-4 border border-2 border-black"onClick={sendNotificationButtonOnClick}>
                    Send Notification
                  </button>
                {/* </AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    </>
  )
}