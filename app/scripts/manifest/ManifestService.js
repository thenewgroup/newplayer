'use strict';
/** @ngInject */
function ManifestService($log,$timeout,$http,$q,$state,$rootScope,APIService)
{
	$log.debug('ManifestService: Init');

	var data;
	var manifestId;
	var lang;
	var pageId;

	return {
		getData:       getData,

		getManifestId: getManifestId,
		setManifestId: setManifestId,

		getLang:       getLang,
		setLang:       setLang,

		getPageId:     getPageId,
		setPageId:     setPageId,

		getPage:       getPage
	};

	function getData( manifestId )
	{
		if ( !data || manifestId != this.getManifestId() )
		{
			this.setManifestId( manifestId );
			$log.debug('ManifestService: getData:', manifestId);
			return APIService.getData( manifestId ).then(function(res){
				$log.debug('ManifestService: setData:', res);
				data = res;
			});
		} else {
			return data;
		}
	}

	function getManifestId()
	{
		return this.manifestId;
	}
	function setManifestId(manifestId)
	{
		this.manifestId = manifestId;
	}

	function getLang()
	{
		if (!this.lang)
		{
			// determine lang from data
			this.setLang( 'en-US' );
		}
		return this.lang;
	}
	function setLang(lang)
	{
		this.lang = lang;
	}

	function getPageId()
	{
		if (!this.pageId)
		{
			// determine default pageId from data
			this.setPageId( 'page1' );
		}
		return this.pageId;
	}
	function setPageId(pageId)
	{
		this.pageId = pageId;
	}

	function getPage( lang, pageId )
	{
		return
	}

}
