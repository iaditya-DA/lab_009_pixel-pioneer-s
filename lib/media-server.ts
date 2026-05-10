import { NodeMediaServer } from 'node-media-server';

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000, // The video will be served on this port
    allow_origin: '*',
    mediaroot: './media', // Where video segments are stored temporarily
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg', // ⚠️ IMPORTANT: Path to your FFMPEG installation
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

console.log('📺 Media Server is running!');
console.log('👉 RTMP URL (Input): rtmp://localhost/live');
console.log('👉 HLS URL (Output): http://localhost:8000/live/{STREAM_KEY}/index.m3u8');