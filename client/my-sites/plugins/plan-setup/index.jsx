/**
* External dependencies
*/
import React from 'react'

/**
* Internal dependencies
*/
import JetpackManageErrorPage from 'my-sites/jetpack-manage-error-page';
import PluginInstallation from './installation';

module.exports = React.createClass( {

	displayName: 'PlanSetup',

	getInitialState() {
		return {
			keys: {},
			status: 'not-started', // installing $plugin, configuring $plugin, finished, error
		};
	},

	renderNoManageWarning() {
		return (
			<JetpackManageErrorPage
				site={ this.props.selectedSite }
				template={ 'optInManage' }
				title={ this.translate( 'Oh no! We can\'t automatically install your new plugins.' ) }
				section={ 'plugins' }
				illustration={ '/calypso/images/jetpack/jetpack-manage.svg' } />
		);
	},

	renderNoJetpackSiteSelected() {
		return (
			<JetpackManageErrorPage
				site={ this.props.selectedSite }
				title={ this.translate( 'Oh no! You need to select a jetpack site to be able to setup your plan' ) }
				illustration={ '/calypso/images/jetpack/jetpack-manage.svg' } />
		);
	},

	runInstall() {
		let steps = PluginInstallation.start( {
			site: this.props.selectedSite,
			plugins: [ 'vaultpress' ]
		} );

		steps.on( 'data', ( step ) => {
			console.log( step );
			// Update component state
		} );
	},

	render() {
		if ( ! this.props.selectedSite || ! this.props.selectedSite.jetpack ) {
			return this.renderNoJetpackSiteSelected();
		}
		if ( ! this.props.selectedSite.canManage() ) {
			return this.renderNoManageWarning();
		}
		this.runInstall();

		return (
			<div>
				<h1>Setting up your plan…</h1>
				<p>Most of this will happen automatically, in steps, so we can notify the user what&apos;s happening</p>
				<p>Currently… { this.state.status }</p>
			</div>
		)
	}

} );
