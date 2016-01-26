/**
 * External dependencies
 */
import titleCase from 'to-title-case';
import assign from 'lodash/object/assign';
import mapValues from 'lodash/object/mapValues';
import pick from 'lodash/object/pick';
import partial from 'lodash/function/partial';

/**
 * Internal dependencies
 */
import Helper from 'lib/themes/helpers';
import actionLabels from './action-labels';
import config from 'config';

const buttonOptions = {
	signup: {
		hasUrl: true,
		isHidden: ( site, theme, isLoggedOut ) => ! isLoggedOut
	},
	preview: {
		hasAction: true,
		hasUrl: false,
		isHidden: ( site, theme ) => theme.active
	},
	purchase: {
		hasAction: true,
		isHidden: ( site, theme, isLoggedOut ) => isLoggedOut || theme.active || theme.purchased || ! theme.price || ! config.isEnabled( 'upgrades/checkout' )
	},
	activate: {
		hasAction: true,
		isHidden: ( site, theme, isLoggedOut ) => isLoggedOut || theme.active || ( theme.price && ! theme.purchased )
	},
	customize: {
		hasAction: true,
		isHidden: ( site, theme ) => ! theme.active || ( site && ! site.isCustomizable() )
	},
	separator: {
		separator: true
	},
	details: {
		hasUrl: true
	},
	support: {
		hasUrl: true,
		// We don't know where support docs for a given theme on a self-hosted WP install are,
		// and free themes don't have support docs.
		isHidden: ( site, theme ) => ( site && site.jetpack ) || ! Helper.isPremium( theme )
	},
};

export function getButtonOptions( site, theme, isLoggedOut, actions, setSelectedTheme, togglePreview ) {
	let options = pick( buttonOptions, option => ! ( option.isHidden && option.isHidden( site, theme, isLoggedOut ) ) );
	options = mapValues( options, appendLabelAndHeader );
	options = mapValues( options, appendUrl );
	options = mapValues( options, appendAction );
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

	function appendUrl( option, name ) {
		const { hasUrl } = option;

		if ( ! hasUrl ) {
			return option;
		}

		const methodName = `get${ titleCase( name ) }Url`;
		const getUrl = Helper[ methodName ];

		return assign( {}, option, {
			getUrl: partial( getUrl, partial.placeholder, site )
		} );
	}

	function appendAction( option, name ) {
		const { hasAction } = option;

		if ( ! hasAction ) {
			return option;
		}

		let action;
		if ( name === 'preview' ) {
			action = togglePreview.bind( null, theme );
		} else if ( site ) {
			action = actions[ name ].bind( actions, theme, site, 'showcase' );
		} else {
			action = setSelectedTheme.bind( null, name, theme );
		}

		return assign( {}, option, {
			action: trackedAction( action, name )
		} );
	}

	function trackedAction( action, name ) {
		return () => {
			action();
			Helper.trackClick( 'more button', name );
		};
	}
};
