import RingCentral from '@rc-ex/core';
import WebSocketExtension from '@rc-ex/ws';
import waitFor from 'wait-for-async';

const rc1 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});
const webSocketExtension1 = new WebSocketExtension();

const rc2 = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});
const webSocketExtension2 = new WebSocketExtension();

const main = async () => {
  await rc1.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });
  await rc1.installExtension(webSocketExtension1);
  await rc2.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });
  await rc2.installExtension(webSocketExtension2);
  let eventCount1 = 0;
  await webSocketExtension1.subscribe(
    ['/restapi/v1.0/account/~/extension/~/message-store'],
    () => {
      console.log('event from first ws connection');
      eventCount1 += 1;
    }
  );
  let eventCount2 = 0;
  await webSocketExtension2.subscribe(
    ['/restapi/v1.0/account/~/extension/~/message-store'],
    () => {
      console.log('event from second ws connection');
      eventCount2 += 1;
    }
  );
  await rc1
    .restapi()
    .account()
    .extension()
    .companyPager()
    .post({
      from: {extensionNumber: '101'},
      to: [{extensionNumber: '101'}], // send pager to oneself
      text: 'Hello world',
    });
  await waitFor({
    interval: 1000,
    condition: () => eventCount1 >= 1 && eventCount2 >= 1,
  });
  await rc1.revoke();
  await rc2.revoke();
};

main();
