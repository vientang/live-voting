import Server from 'socket.io';

// create a Socket.io server and a regular HTTP server, bound to port 8090
export default function startServer() {
	const io = new Server().attach(8090);

	store.subscribe(() => io.emit('state', store.getState().toJS()));
	// if app grows, instead of emitting the entire state, 
	// consider emitting relevant subset, sending diffs instead of snapshots...
}