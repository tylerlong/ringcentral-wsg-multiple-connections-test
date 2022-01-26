import RingCentral from '@rc-ex/core';
import WebSocketExtension from '@rc-ex/ws';

const rc = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});

const wsExtension = new WebSocketExtension();

const main = async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });
  await rc.installExtension(wsExtension);
  const extInfo = await rc.restapi().account().extension().get();
  console.log(extInfo.extensionNumber);
  await rc.revoke();
};

main();
