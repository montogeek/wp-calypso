/**
 * External dependencies
 */
var React = require( 'react' ),
	debug = require( 'debug' )( 'calypso:components:themes:more-button' ), // eslint-disable-line no-unused-vars
	classNames = require( 'classnames' ),
	isFunction = require( 'lodash/lang/isFunction' ),
	map = require( 'lodash/collection/map' );

/**
 * Internal dependencies
 */
var PopoverMenu = require( 'components/popover/menu' ),
	PopoverMenuItem = require( 'components/popover/menu-item' ),
	isOutsideCalypso = require( 'lib/url' ).isOutsideCalypso,
	getSignupUrl = require( 'lib/themes/helpers' ).getSignupUrl;

/**
 * Component
 */
var ThemeMoreButton = React.createClass( {
	propTypes: {
		theme: React.PropTypes.shape( {
			// Theme ID (theme-slug)
			id: React.PropTypes.string.isRequired,
			// Theme name
			name: React.PropTypes.string.isRequired,
			// Theme screenshot URL
			screenshot: React.PropTypes.string,
			// Theme price (pre-formatted string) -- empty string indicates free theme
			price: React.PropTypes.string,
			// If true, the user has 'purchased' the theme
			purchased: React.PropTypes.bool,
			// If true, highlight this theme as active
			active: React.PropTypes.bool,
			author: React.PropTypes.string,
			author_uri: React.PropTypes.string,
			demo_uri: React.PropTypes.string,
			stylesheet: React.PropTypes.string
		} ),
		// Index of theme in results list
		index: React.PropTypes.number,
		// Options to populate the popover menu with
		options: React.PropTypes.objectOf(
			React.PropTypes.shape( {
				label: React.PropTypes.string,
				header: React.PropTypes.string,
				action: React.PropTypes.func,
				getUrl: React.PropTypes.func
			} )
		).isRequired,
		active: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			showPopover: false
		};
	},

	togglePopover: function() {
		this.setState( { showPopover: ! this.state.showPopover } );
		! this.state.showPopover && this.props.onClick( this.props.theme.id, this.props.index );
	},

	closePopover: function( action ) {
		this.setState( { showPopover: false } );
		isFunction( action ) && action( this.props.theme );
	},

	focus: function( event ) {
		event.target.focus();
	},

	render: function() {
		var classes = classNames(
			'theme__more-button',
			{ 'is-active': this.props.theme.active },
			{ 'is-open': this.state.showPopover }
		);

		return (
			<span className={ classes }>
				<button ref="more" onClick={ this.togglePopover }>
					<span className="noticon noticon-ellipsis" />
				</button>

				<PopoverMenu context={ this.refs && this.refs.more }
					isVisible={ this.state.showPopover }
					onClose={ this.closePopover }
					position="top left">

					{ map( this.props.options, function( option, key ) {
						if ( option.separator ) {
							return ( <hr key={ key } className="popover__hr" /> );
						}
						if ( option.getUrl ) {
							const url = option.getUrl( this.props.theme );
							return (
								<a className="theme__more-button-menu-item popover__menu-item"
									onMouseOver={ this.focus }
									key={ option.label }
									href={ url }
									target={ ( isOutsideCalypso( url ) &&
										// We don't want to open a new tab for the signup flow
										// TODO: Remove this hack once we can just hand over
										// to Calypso's signup flow with a theme selected.
										url !== getSignupUrl( this.props.theme ) )
										? '_blank' : null }>
									{ option.label }
								</a>
							);
						}
						return (
							<PopoverMenuItem key={ option.label } action={ option.action }>
								{ option.label }
							</PopoverMenuItem>
						);
					}, this ) }

				</PopoverMenu>
			</span>
		);
	}
} );

module.exports = ThemeMoreButton;
