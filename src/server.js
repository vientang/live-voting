import Server from 'socket.io';

// create a Socket.io server and a regular HTTP server, bound to port 8090
export default function startServer() {
	const io = new Server().attach(8090);

	// if app grows, instead of emitting the entire state, 
	// consider emitting relevant subset, sending diffs instead of snapshots...
	store.subscribe(() => io.emit('state', store.getState().toJS()));

	// listen for 'connection' events on our Socket.io server
	// and emit the current state right away
	io.on('connection', (socket) => {
		socket.emit('state', store.getState().toJS());
		socket.on('action', store.dispatch.bind(store));
	});
}