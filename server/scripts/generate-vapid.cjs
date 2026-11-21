const webpush = require("web-push");

const keys = webpush.generateVAPIDKeys();
console.log("\n==========================================");
console.log("COPY THESE TO server/.env:");
console.log("==========================================");
console.log('VAPID_PUBLIC_KEY="' + keys.publicKey + '"');
console.log('VAPID_PRIVATE_KEY="' + keys.privateKey + '"');
console.log("==========================================\n");
