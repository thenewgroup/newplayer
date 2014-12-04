'use strict';

angular
	.module(
		'npQuestion',
		[ ]
	);

angular
	.module('npQuestion')

	/** @ngInject */
	.controller( 'npQuestionController',
		function( $log, $scope, ManifestService, $sce )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npQuestion::data', cmpData );

			this.id = cmpData.id;
			this.content = $sce.trustAsHtml( cmpData.content );
			$scope.questionType = cmpData.type;

			this.evaluate = function() {
				var feedback = cmpData.feedback;
				// set by ng-model of npAnswer's input's
				var answer = ManifestService.getComponent( this.answer );
				if ( feedback.immediate )
				{
					if ( answer.data.correct )
					{
						this.feedback = feedback.correct;
					} else {
						this.feedback = feedback.incorrect;
					}
				}
			};
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npQuestion::component loaded!');
		}
	);

