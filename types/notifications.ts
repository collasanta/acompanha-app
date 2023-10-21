export interface WebPushNotificationDataType {
    id: string;
    subscription: {
      keys: {
        auth: string;
        p256dh: string;
      };
      endpoint: string;
    };
    clientId: string;
    programId: string;
    device: string;
    createdAt: string;
    client: {
      name: string;
    };
    program: {
      professional: {
        name: string;
      };
    };
  }