import { expect } from 'chai';
import { List, Map } from 'immutable';
import { setEntries, next, vote, restart } from '../src/core';

describe("application logic", () => {

	describe("setEntries", () => {
		
		it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later'),
        initialEntries: List.of('Trainspotting', '28 Days Later')
      }));
    });

		it('converts to immutable', () => {
		  const state = Map();
		  const entries = ['Trainspotting', '28 Days Later'];
		  const nextState = setEntries(state, entries);
		  expect(nextState).to.equal(Map({
		    entries: List.of('Trainspotting', '28 Days Later'),
		    initialEntries: List.of('Trainspotting', '28 Days Later')
		  }));
		});

	});

	describe("next", () => {

		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
					round: 1,
					pair: List.of('Trainspotting', '28 Days Later') 
				}),
				entries: List.of('Sunshine')
			}));
		});
		
		it('puts winner of the current vote back into entries', () => {
			expect(next(Map({
        vote: Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      	}))
      ).to.equal(Map({
          vote: Map({
            round: 2,
            pair: List.of('Sunshine', 'Millions')
          }),
          entries: List.of('127 Hours', 'Trainspotting')
        })
      );
    });

		it('puts both titles back in entries if vote is a tie', () => {
			expect(next(Map({
        vote: Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
        }))
      ).to.equal(Map({
          vote: Map({
            round: 2,
            pair: List.of('Sunshine', 'Millions')
          }),
          entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
        })
      );
		});

		it('marks the winner when there\'s one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 9,
						'28 Days Later': 4
					})
				}),
				entries: List()
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}));
		});
	});


	describe("vote", () => {

		it('creates a tally for the voted entry', () => {
			expect(vote(Map({
        round: 1,
        pair: List.of('Trainspotting', '28 Days Later')
      }), 'Trainspotting', 'voter1'))
      .to.equal(Map({
        round: 1,
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        }),
        votes: Map({
          voter1: 'Trainspotting'
        })
      }));
    });

		it('adds to the existing tally for the voted entry', () => {
			expect(vote(Map({
        round: 1,
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        votes: Map()
      }), 'Trainspotting', 'voter1'))
      .to.equal(Map({
        round: 1,
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        }),
        votes: Map({
          voter1: 'Trainspotting'
        })
      }));
		});

		it('nullifies previous vote for the same voter', () => {
      expect(
        vote(Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          }),
          votes: Map({
            voter1: '28 Days Later'
          })
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 1
          }),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      );
    });

    it('ignores the vote if for an invalid entry', () => {
      expect(
        vote(Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later')
        }), 'Sunshine')
      ).to.equal(
        Map({
          round: 1,
          pair: List.of('Trainspotting', '28 Days Later')
        })
      );
    });

	});

});