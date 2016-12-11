import { next, vote, setEntries, INITIAL_STATE } from './core';

export default function reducer(state = INITIAL_STATE, action) {
	// figure out which function to call, and call it
	switch(action.type) {
		case 'SET_ENTRIES':
			return setEntries(state, action.entries);			
		case 'VOTE':
			return state.update('vote', voteState => vote(voteState, action.entry));
		case 'NEXT':
			return next(state);		
	}
	return state;
}