require( 'lib/react-test-env-setup' )();
/**
 * External dependencies
 */
import { expect } from 'chai';

describe( 'state', () => {
	var createReduxStore;
	before( () => {
		createReduxStore = require( 'state' ).createReduxStore;
	} );
	describe( 'createReduxStore', () => {
		it( 'can be called without specifying initialState', () => {
			const reduxStoreNoArgs = createReduxStore().getState();
			const reduxStoreWithEmptyState = createReduxStore( {} ).getState();
			const reduxStoreWithNullState = createReduxStore( null ).getState();
			expect( reduxStoreNoArgs ).to.be.an( 'object' );
			expect( reduxStoreWithEmptyState ).to.eql( reduxStoreNoArgs );
			expect( reduxStoreWithNullState ).to.eql( reduxStoreNoArgs );
		} );
		it( 'is instantiated with initialState', () => {
			const user = { ID: 1234, display_name: 'test user', username: 'testuser' };
			const initialState = {
				currentUser: { id: 1234 },
				users: { items: { 1234: user } }
			};
			const reduxStoreWithCurrentUser = createReduxStore( initialState ).getState();
			expect( reduxStoreWithCurrentUser.currentUser ).to.eql( { id: 1234 } );
			expect( Object.keys( reduxStoreWithCurrentUser.users.items ).length ).to.eql( 1 );
			expect( reduxStoreWithCurrentUser.users.items[ 1234 ] ).to.eql( user );
		} );
	} );
} );
