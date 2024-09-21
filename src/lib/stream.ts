import { StreamChat } from 'stream-chat';

// Stream server client
const streamServer = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_KEY!,
    process.env.STREAM_SECRET
);

// Export stream server
export default streamServer;