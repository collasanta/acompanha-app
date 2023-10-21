declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", function (event) {
  console.log("WORKER PUSH RECEIVED", { event })
  const data = event?.data!.json();
  const options = {
    body: data.body,
    icon: data.icon,
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// self.addEventListener("notificationclick", function (event) {
//   event.notification.close();
//   event.waitUntil(
//     self.clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then(function (clientList) {
//         if (clientList.length > 0) {
//           let client = clientList[0];
//           for (let i = 0; i < clientList.length; i++) {
//             if (clientList[i].focused) {
//               client = clientList[i];
//             }
//           }
//           return client.focus();
//         }
//         return self.clients.openWindow("/");
//       })
//   );
// });

export { };