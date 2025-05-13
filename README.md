# hyperswarm-chat

A simple peer-to-peer terminal chat app using [Hyperswarm](https://github.com/hyperswarm/hyperswarm) for networking and [Node.js](https://nodejs.org/).

## Features
- Peer-to-peer chat with no central server
- Unique ID for each user
- Only allows typing when at least one peer is connected

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/hyperswarm-chat.git
   cd hyperswarm-chat
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

## Usage

Open two or more terminals (can be on the same or different machines/networks):

```sh
npm start
```

- Your unique ID will be shown.
- Wait for a connection to another peer. Once connected, you can type messages.
- Messages are sent to all connected peers.
- Press `Ctrl+C` to exit.

## Development

To start in watch mode (auto-restart on changes):
```sh
npm run dev
```

## License

MIT © 2025 AndyRum
