/**
 * External dependencies
 */
import assign from 'lodash/object/assign';
import mapValues from 'lodash/object/mapValues';
import pick from 'lodash/object/pick';

/**
 * Internal dependencies
 */
import Helper from 'lib/themes/helpers';
import actionLabels from './action-labels';
import config from 'config';

export function getButtonOptions( site, isLoggedOut, actions, setSelectedTheme, togglePreview ) {
	const buttonOptions = {
		signup: {
			getUrl: theme => Helper.getSignupUrl( theme ),
			isHidden: ! isLoggedOut
		},
		preview: {
			action: theme => togglePreview( theme ),
			hideForTheme: theme => theme.active
		},
		purchase: {
			action: theme => site
				? actions.purchase( theme, site, 'showcase' )
				: setSelectedTheme( 'purchase', theme ),
			isHidden: isLoggedOut || ! config.isEnabled( 'upgrades/checkout' ),
			hideForTheme: theme => theme.active || theme.purchased || ! theme.price
		},
		activate: {
			action: theme => site
				? actions.activate( theme, site, 'showcase' )
				: setSelectedTheme( 'activate', theme ),
			isHidden: isLoggedOut,
			hideForTheme: theme => theme.active || ( theme.price && ! theme.purchased )
		},
		customize: {
			action: theme => site
				? actions.customize( theme, site )
				: setSelectedTheme( 'customize', theme ),
			isHidden: isLoggedOut && ( site && ! site.isCustomizable() ),
			hideForTheme: theme => ! theme.active
		},
		separator: {
			separator: true
		},
		details: {
			getUrl: theme => Helper.getDetailsUrl( theme, site ),
		},
		support: {
			getUrl: theme => Helper.getSupportUrl( theme, site ),
			// We don't know where support docs for a given theme on a self-hosted WP install are,
			// and free themes don't have support docs.
			isHidden: site && site.jetpack,
			hideForTheme: theme => ! Helper.isPremium( theme )
		},
	};

	let options = pick( buttonOptions, option => ! option.isHidden );
	options = mapValues( options, appendLabelAndHeader );
	return options;

	function appendLabelAndHeader( option, name ) {
		const actionLabel = actionLabels[ name ];

		if ( ! actionLabel ) {
			return option;
		}

		const { label, header } = actionLabel;

		return assign( {}, option, {
			label, header
		} );
	};
};

export function addTracking( options ) {
	return mapValues( options, appendActionTracking );
}

function appendActionTracking( option, name ) {
	const { action } = option;

	if ( ! action ) {
		return option;
	}

	return assign( {}, option, {
		action: trackedAction( action, name )
	} );
}

function trackedAction( action, name ) {
	return t => {
		action( t );
		Helper.trackClick( 'more button', name );
	};
}
