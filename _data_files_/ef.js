self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
self.addEventListener('fetch', (event) => {
if (event.request.url.endsWith('_data_files/os.txt')) {
const TOTAL_SIZE = 4.5 * 1024 * 1024 * 1024;
const CHUNK_SIZE = 1024 * 64;
const dataChunk = new Uint8Array(CHUNK_SIZE).fill(48);
const stream = new ReadableStream({
start(controller) {
let bytesSent = 0;
function push() {
if (bytesSent < TOTAL_SIZE) {
controller.enqueue(dataChunk);
bytesSent += CHUNK_SIZE;
setTimeout(push, 1); 
} else {
controller.close();
}}
push();
}});
event.respondWith(new Response(stream, {
headers: {
'Content-Type': 'text/plain',
'Content-Disposition': 'attachment; filename="os.txt"',
'Content-Length': TOTAL_SIZE.toString(),
'Cache-Control': 'no-store'
}}));
}});
