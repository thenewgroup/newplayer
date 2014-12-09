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
			this.type = cmpData.type;
			this.feedback = '';

			var feedback = cmpData.feedback;

			this.changed = function()
			{
				$log.debug( 'npQuestion::answer changed' );
				if ( feedback.immediate )
				{
					this.feedback = '';
				}
			};

			this.evaluate = function()
			{
				$log.debug('npQuestion::evaluate:', this.answer);
				var correct = true;

				switch (this.type) {
					case 'radio':
						var answer = ManifestService.getComponent( this.answer );
						if ( !answer.data.correct )
						{
							correct = false;
						}
						break;
					case 'checkbox':
						var answers = ManifestService.getAll( 'npAnswer', $scope.cmpIdx );
						var idx;
						for ( idx in answers )
						{
							if ( answers[idx].data.correct )
							{
								// confirm all correct answers were checked
								if ( ! this.answer[ answers[idx].idx ] )
								{
									correct = false;
								}
							} else {
								// confirm no incorrect answers were checked
								if ( this.answer[ answers[idx].idx ] )
								{
									correct = false;
								}
							}
						}
						break;
					case 'text':
						break;
				}
				$log.debug('npQuestion::evaluate:pass', correct );

				// set by ng-model of npAnswer's input's
				if ( feedback.immediate )
				{
					if ( correct )
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

