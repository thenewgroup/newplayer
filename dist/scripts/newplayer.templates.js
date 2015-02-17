angular.module('newplayer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('scripts/component/blank.html',
    "<div class=\"{{component.type}}\" ngcontroller=\"{{component.type}}Controller\">\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n"
  );


  $templateCache.put('scripts/component/component.html',
    "<div>\n" +
    "\tCOMPONENT.HTML\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAnswer/npAnswer.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"npQuestion.type === 'radio'\" class=\"np-cmp-wrapper {{component.type}} radio\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <label>\n" +
    "        <input type=\"radio\" class=\"npAnswer-radio np-cmp-main \" name=\"radio\" ng-model=\"npQuestion.answer\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "        <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\" ></span>\n" +
    "\n" +
    "    </label>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"npQuestion.type === 'checkbox'\" class=\"np-cmp-wrapper {{component.type}} checkbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <label>\n" +
    "        <input type=\"checkbox\" class=\"npAnswer-checkbox np-cmp-main \" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "        <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </label>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('scripts/component/npAudio/npAudio.html',
    "<div class=\"{{component.type}}\" ng-controller=\"npAudioController as npAudio\" id=\"{{npAudio.id}}\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <!--\n" +
    "    <videogular vg-theme=\"npAudio.config.theme.url\">\n" +
    "            <vg-video vg-src=\"npAudio.config.sources\" vg-native-controls=\"true\"></vg-video>\n" +
    "    </videogular>\n" +
    "    -->\n" +
    "    <audio\n" +
    "        width=\"100%\"\n" +
    "        preload=\"auto\"\n" +
    "        mediaelement>\n" +
    "        <!--\n" +
    "                        <source type=\"video/{{npAudio.types[0]}}\" src=\"{{npAudio.baseURL}}.{{npAudio.types[0]}}\" />\n" +
    "                        <source ng-repeat=\"type in npAudio.types\" type=\"video/{{type}}\" src=\"{{npAudio.baseURL}}.{{type}}\" />\n" +
    "        -->\n" +
    "        <object width=\"100%\"  type=\"application/x-shockwave-flash\" data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\" />\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{npAudio.baseURL}}.mp3\" />\n" +
    "            <!-- Image as a last resort -->\n" +
    "            <!--<img src=\"myvideo.jpg\" width=\"320\" height=\"240\" title=\"No video playback capabilities\" />-->\n" +
    "        </object>\n" +
    "    </audio>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npButton/npButton.html',
    "<button class=\"{{component.type}} {{npButton.type}} np-cmp-main btn\"  ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <span ng-bind-html=\"npButton.content\"></span>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</button>\n"
  );


  $templateCache.put('scripts/component/npColumn/npColumn.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npColumnController as npColumn\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <div\n" +
    "        ng-if=\"subCmp\"\n" +
    "        ng-repeat=\"row in rows\"\n" +
    "        ng-class=\"\n" +
    "                            [\n" +
    "                                    ($index + 1 === npColumn.lastRow) ? 'col-{{npColumn.lastRowColumns}}' : 'col-{{npColumn.columns}}'\n" +
    "                                                                        ]\"\n" +
    "        class=\"row\">\n" +
    "        <!--index:{{$index}}, lastRow:{{npColumn.lastRow}}, lastRowColumns:{{npColumn.lastRowColumns}}-->\n" +
    "        <div\n" +
    "            ng-repeat=\"component in row\"\n" +
    "            np-component\n" +
    "            idx=\"{{component.idx}}\" data-width=\"{{npColumn.columnWidth}}%\"\n" +
    "            ng-class=\"[ ( ($index+1) % npColumn.columns === 0 ) ? 'col-last' : '',\n" +
    "\t\t\t\t( $parent.$parent.$index+1 === npColumn.lastRow ) ? 'col-sm-{{npColumn.columnSpanLast}}' : 'col-sm-{{npColumn.columnSpan}}'\n" +
    "                                                                            ]\"\n" +
    "            class=\"column\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npContent/npContent.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npContentController as npContent\" ng-show=\"currentLang\">\n" +
    "\n" +
    "\t<div ng-if=\"currentLang\" class=\"np-cmp-main\">\n" +
    "\n" +
    "\t\t<div class=\"debug\">\n" +
    "\t\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npFeature/npFeature.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npFeatureController as npFeature\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npFooter/npFooter.html',
    "<footer class=\"np-cmp-wrapper {{component.type}} navbar navbar-inverse navbar-fixed-bottom\" ng-controller=\"npFooterController as npFooter\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</footer>\n"
  );


  $templateCache.put('scripts/component/npHTML/npHTML.html',
    "<section class=\"{{component.type}} np-cmp-wrapper\" ng-controller=\"npHTMLController as npHTML\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div ng-bind-html=\"npHTML.content\" class=\"np-cmp-main\"></div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</section>\n"
  );


  $templateCache.put('scripts/component/npHeader/npHeader.html',
    "<!--I once read in a comment that 'smart developers read comments', so go ahead and pat yourself on the back.-->\n" +
    "\n" +
    "<header class=\"np-cmp-wrapper {{component.type}} navbar navbar-default navbar-fixed-top navbar-inverse\" ng-controller=\"npHeaderController as npHeader\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h2>{{component.type}} -- <small>{{component.idx}}</small></h2>\n" +
    "        </div>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "</header>\n"
  );


  $templateCache.put('scripts/component/npHotspot/npHotspot.html',
    "<div class=\"{{component.type}} npHotspot\" ng-controller=\"npHotspotController as npHotspot\" id=\"{{npHotspot.id}}\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-7 \">\n" +
    "            <div class=\"hotspotImage\">\n" +
    "                <div class=\"debug\">\n" +
    "                    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "                </div>\n" +
    "                <img class=\"{{component.type}} np-cmp-main img-responsive\" ng-controller=\"npHotspotController as npHotspot\" ng-src=\"{{npHotspot.src}}\" alt=\"{{npHotspot.alt}}\" />\n" +
    "                <div ng-repeat=\"hotspotButton in npHotspot.hotspotButtons\">\n" +
    "                    <div class=\"{{hotspotButton.class}} hotspotButton\" ng-click=\"npHotspot.update(hotspotButton)\">\n" +
    "                        <!--<img class=\"hotspotButtonImage\" ng-src=\"{{hotspotButton.image}}\" alt=\"{{npHotspot.alt}}\" />-->\n" +
    "                        <div class=\"hotspotButtonImage\" ></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-5\">\n" +
    "        <div class=\"content-area\">\n" +
    "            <div class=\"content-background\">\n" +
    "                <svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                    <style type=\"text/css\">\n" +
    "                        <![CDATA[\n" +
    "                        .st0{fill:url(#SVGID_1_);}\n" +
    "                        .st1{display:inline;}\n" +
    "                        .st2{display:none;}\n" +
    "                        ]]>\n" +
    "                    </style>\n" +
    "                    <g id=\"Layer_2\">\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <path class=\"st0\" d=\"M369.5,223.5h-371v-225h371V223.5z M1.5,220.5h365V1.5H1.5V220.5z\"/>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </div>\n" +
    "            <div class=\"npHotspot-feedback\" ng-bind-html=\"npHotspot.feedback\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npHotspotButton/npHotspotButton.html',
    "<div class=\"{{component.type}} {{npHotspotButton.type}} np-cmp-main hotspotButton\"  ng-controller=\"npHotspotButtonController as npHotspotButton\" ng-click=\"npHotspotButton.go()\">\n" +
    "\n" +
    "    <span class=\"debug\">\n" +
    "        {{component.type}} -- <small>{{component.idx}}</small>\n" +
    "    </span>\n" +
    "\n" +
    "    <img class=\"{{component.type}} np-cmp-main hotspotButtonImage\" ng-controller=\"npHotspotButtonController as npHotspotButton\" ng-src=\"{{npHotspotButton.src}}\" alt=\"{{npHotspotButton.alt}}\" />\n" +
    "\n" +
    "    <!--<span ng-bind-html=\"npHotspotButton.content\"></span>-->\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npImage/npImage.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<img\n" +
    "    class=\"{{component.type}} np-cmp-main img-responsive\"\n" +
    "    ng-controller=\"npImageController\n" +
    "                as npImage\"\n" +
    "    ng-src=\"{{npImage.src}}\"\n" +
    "    alt=\"{{npImage.alt}}\" \n" +
    "    />\n" +
    "\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
  );


  $templateCache.put('scripts/component/npMenu/npMenu.html',
    "<nav class=\"np-cmp-wrapper {{component.type}}\" ng-class=\"menuStatus\" ng-controller=\"npMenuController as npMenu\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<a class=\"hamburger fa fa-bars\" ng-click=\"menuStatus=(menuStatus==='show')?'':'show'\"></a>\n" +
    "\t<ul class=\"np-cmp-main\">\n" +
    "\t\t<li ng-repeat=\"child in npMenu.items\">\n" +
    "\t\t\t<span np-menu menuitem=\"child\"></span>\n" +
    "\t\t</li>\n" +
    "\t</ul>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</nav>\n"
  );


  $templateCache.put('scripts/component/npPage/npPage.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npPageController as npPage\" ng-show=\"currentPage\">\n" +
    "\n" +
    "\t<main ng-if=\"currentPage\" class=\"np-cmp-main\">\n" +
    "\n" +
    "\t\t<div class=\"debug\">\n" +
    "\t\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<h1 class=\"npPage-title\">{{npPage.title}}</h1>\n" +
    "\n" +
    "\t\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t</main>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npQuestion/npQuestion.html',
    "<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"npQuestion-content\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    \n" +
    "  <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n" +
    "<!--    <div class=\"btn btn-default\">\n" +
    "        <input type=\"submit\" />\n" +
    "    </div>-->\n" +
    "\n" +
    "    <div class=\"npQuestion-feedback\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npQuiz/npQuiz.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npQuizController as npQuiz\" ng-submit=\"npQuiz.evaluate()\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"npQuiz-content h4\" ng-bind-html=\"npQuiz.content\"></div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t<div class=\"npQuiz-feedback\" ng-if=\"npQuiz.feedback\" ng-bind-html=\"npQuiz.feedback\"></div>\n" +
    "\n" +
    "</form>\n" +
    "\n"
  );


  $templateCache.put('scripts/component/npVideo/npVideo.html',
    "<np-video component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "\n" +
    "  <video\n" +
    "    height=\"{{component.data.height}}\"\n" +
    "    width=\"{{component.data.width}}\"\n" +
    "    poster=\"{{component.data.poster}}\"\n" +
    "    preload=\"{{component.data.preload}}\"\n" +
    "    ng-src=\"{{component.data.src}}\"\n" +
    "    controls=\"controls\"\n" +
    "    mediaelelement>\n" +
    "\n" +
    "\n" +
    "    <source ng-repeat=\"source in npVideo.sources\" type=\"video/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "\n" +
    "    <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\"\n" +
    "            data=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\">\n" +
    "      <param name=\"movie\" value=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\"/>\n" +
    "      <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp4\"/>\n" +
    "      <param name=\"allowfullscreen\" value=\"false\"/>\n" +
    "    </object>\n" +
    "  </video>\n" +
    "\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</np-video>\n"
  );


  $templateCache.put('scripts/manifest/init.html',
    "<div id=\"manifestWrapper\" class=\"xdebug\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    Manifest - init - {{vm.manifestId}}.json\n" +
    "  </div>\n" +
    "\n" +
    "  <div ui-view=\"load\" autoscroll='true'>\n" +
    "    Manifest - initializing.\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/manifest/load.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    Manifest - load - {{vm.manifestId}}.json\n" +
    "  </div>\n" +
    "\n" +
    "  <div ui-view=\"manifest\" autoscroll='true'>\n" +
    "    <div class=\"preloader\">\n" +
    "      <i class=\"fa fa-refresh fa-spin\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/manifest/manifest.html',
    "<h1 class=\"debug\">Manifest</h1>\n" +
    "\n" +
    "<!--\n" +
    "<dl>\n" +
    "\t<dt>manifestID</dt>\n" +
    "\t<dd>{{vm.manifestId}}</dd>\n" +
    "\n" +
    "\t<dt>language</dt>\n" +
    "\t<dd>{{vm.lang}}</dd>\n" +
    "\n" +
    "\t<dt>pageId</dt>\n" +
    "\t<dd>{{vm.pageId}}</dd>\n" +
    "</dl>\n" +
    "-->\n" +
    "\n" +
    "<div np-component class=\"manifest\">\n" +
    "  <div class=\"debug\">Here's the root component:</div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"tpl-content\" ng-include src=\"load.html\"></div>\n" +
    "\n"
  );


  $templateCache.put('scripts/manifest/page.html',
    "<h1>Manifest - page</h1>\n" +
    "\n" +
    "<dl>\n" +
    "  <dt>manifestID</dt>\n" +
    "  <dd>{{vm.manifestId}}</dd>\n" +
    "\n" +
    "  <dt>language</dt>\n" +
    "  <dd>{{vm.lang}}</dd>\n" +
    "\n" +
    "  <dt>pageId</dt>\n" +
    "  <dd>{{vm.pageId}}</dd>\n" +
    "</dl>\n"
  );

}]);
