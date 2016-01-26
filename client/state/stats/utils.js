
 /**
  * Internal dependencies
  */
import { isPostIdEndpoint } from 'lib/stats/endpoints';

const statTypesByModule = {
	posts: [ 'statsVisits', 'statsTopPosts' ],
	referrers: 'statsReferrers',
	clicks: 'statsClicks',
	countryviews: 'statsCountryViews',
	authors: 'statsTopAuthors',
	videoplays: 'statsVideoPlays',
	videodetails: 'statsVideo',
	searchterms: 'statsSearchTerms'
};

export function getStatsTypesByModule( module ) {
	return [].concat( statTypesByModule[module] || [] );
}

function stringifyOptions( options = {} ) {
	return Object.keys( options ).sort().map( ( key ) => {
		const value = JSON.stringify( options[ key ] );
		return key + ( value ? '=' + value : '' );
	} ).join( '&' );
}

export function getCompositeKey( action ) {
	const { statType, siteID, postID, options } = action;
	const stringifiedOptions = stringifyOptions( options );
	return `${siteID}_${ postID || 0 }_${statType}_${stringifiedOptions}`;
}

export function normalizeParams( params ) {
	let { options, siteID, postID, statType } = params;
	let _params = { options, siteID, postID, statType };
	if ( isPostIdEndpoint( statType ) && options.post ) {
		_params.postID = options.post;
	}

	return _params;
}

export function isDefined( value ) {
	return typeof value !== 'undefined';
}
