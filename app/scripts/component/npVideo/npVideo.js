'use strict';

angular
	.module(
		'npVideo', []
		/*, [ 'com.2fdevs.videogular' ] */
	);

/** @ngInject */
function npMediaElementDirective( $log )
{
	$log.debug('\nmediaelementDirective::Init\n');
	var Directive = function()
	{
		this.restrict = 'A';
		this.link = function( scope, element, attrs, controller ) {
			attrs.$observe('src', function() {
				$log.debug('mediaelementDirective::element', element);
				jQuery(element).mediaelementplayer();
			});
		};
	};
	return new Directive();
}

angular
	.module('npVideo')

	/** @ngInject */
	.controller( 'npVideoController',
		function( $log, $scope, $sce, $element )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npVideo::data', cmpData, $element );

			this.id = cmpData.id;
			this.poster = cmpData.poster;

			// video source elements need to be static BEFORE mediaElement is initiated
			// binding the attributes to the model was not working
			// alternatively, fire the mediaelement after the source attributes are bound?
			this.baseURL = cmpData.baseURL;
			var types = cmpData.types;
			if ( angular.isArray( types ) && types.length > 0 )
			{
				$log.debug( 'npVideo::data:types', types );
				for ( var typeIdx = types.length-1; typeIdx >= 0; typeIdx-- )
				{
					var type = types[typeIdx];
					$log.debug( 'npVideo::data:types:type', typeIdx, type );
					$element.find('video').prepend(
						'<source type="video/' + type + '" src="' + this.baseURL + '.' + type + '" />'
					);
				}
			}
		}
	)

	.directive( 'mediaelement', npMediaElementDirective )

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npVideo::component loaded!');
		}
	);

