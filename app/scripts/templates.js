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
    "<div np-answer-checkbox ng-if=\"npQuestion.type === 'checkbox'\" class=\"row np-cmp-wrapper {{component.type}} checkbox answer-wrapper\" ng-controller=\"npAnswerController as npAnswer\" ng-click=\"update($event)\">\n" +
    "    <div class=\"col-xs-1 npAnswer-checkbox np-cmp-main answer-checkbox\" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}\">\n" +
    "        <div class=\"checkbox-box\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox-x\">\n" +
    "            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.121px\" height=\"22.121px\" viewBox=\"796.393 809.141 22.121 22.121\" style=\"enable-background:new 796.393 809.141 22.121 22.121;\" xml:space=\"preserve\">\n" +
    "                <g>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"797.453\" y1=\"830.201\" x2=\"817.453\" y2=\"810.201\"/>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"817.453\" y1=\"830.201\" x2=\"797.453\" y2=\"810.201\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-9 answer-content-wrapper\">\n" +
    "        <span class=\"npAnswer-label  body-copy\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon answer-text-input\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control answer-text-input\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npMatch\" class=\"np-cmp-wrapper {{component.type}} matchbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <div class=\"slide-wrapper reveal-slide rsContent\">\n" +
    "        <label>\n" +
    "            <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "        </label>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsAnswer/npAsAnswer.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "<div np-as-answer-checkbox ng-if=\"npQuestion.type === 'checkbox'\" class=\"row np-cmp-wrapper {{component.type}} checkbox answer-wrapper\" ng-controller=\"npAnswerController as npAnswer\" ng-init=\"npAnswer.setQuestion(component.idx, npQuestion);\" ng-click=\"update($event)\">\n" +
    "    <div class=\"col-xs-1 npAnswer-checkbox np-cmp-main answer-checkbox\" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}\">\n" +
    "        <div class=\"checkbox-box\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox-x\">\n" +
    "            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.121px\" height=\"22.121px\" viewBox=\"796.393 809.141 22.121 22.121\" style=\"enable-background:new 796.393 809.141 22.121 22.121;\" xml:space=\"preserve\">\n" +
    "                <g>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"797.453\" y1=\"830.201\" x2=\"817.453\" y2=\"810.201\"/>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"817.453\" y1=\"830.201\" x2=\"797.453\" y2=\"810.201\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-9 answer-content-wrapper\">\n" +
    "        <span class=\"npAnswer-label  body-copy\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon answer-text-input\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control answer-text-input\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npMatch\" class=\"np-cmp-wrapper {{component.type}} matchbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <div class=\"slide-wrapper reveal-slide rsContent\">\n" +
    "        <label>\n" +
    "            <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "        </label>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsQuestion/npAsQuestion.html',
    "<div class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npAsQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "    <!--<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">-->\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <p class=\"h5 quiz-label\">question:</p>\n" +
    "    <div class=\"npQuestion-content question-text h4\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "    <p class=\"h5 quiz-label\">answers:</p>\n" +
    "    <div np-component class=\"response-item\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-6 question-submit-wrapper\">\n" +
    "            <button type=\"submit\" class=\"btn-submit btn\" ng-click=\"npQuestion.evaluate()\">\n" +
    "                <span>Submit</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <div question-feedback-build >\n" +
    "                <div  class=\"question-feedback\">\n" +
    "                    <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                        <div class=\"positive-feedback-icon absolute-vertical-center\">\n" +
    "                            <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                 width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                 enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"negative-feedback-icon absolute-vertical-center\">\n" +
    "                            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                    <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                    <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                    <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                    <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                    <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                    <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                    <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                    <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                        <!--<div class=\"question-feedback-label\">Feedback area</div>-->\n" +
    "                    </div\n" +
    "                </div\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsResult/npAsResult.html',
    "<div class=\"np-cmp-wrapper {{component.type}} np-result row\" ng-controller=\"npAsResultController as npResult\">\n" +
    "    <div class=\"summary np-result-summary \">\n" +
    "        <div class=\"np-result-container\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"12\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"results-wrapper-correct\">\n" +
    "            <div class=\"results-summary-text-wrapper col-xs-12\">\n" +
    "                <div class=\"results-summary-text\">{{npResult.summaryText}}</div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"results-summary-amount-wrapper row\">-->\n" +
    "                <!--<div class=\"results-summary-label-text col-xs-6\">{{npResult.summaryLabelText}}</div>-->\n" +
    "                <!--<div class=\"results-summary-pecentage col-xs-6\">{{npResult.summaryPecentage}}<div class=\"results-summary-pecentage-character\">%</div></div>-->\n" +
    "            <!--</div>-->\n" +
    "            <div ng-show=\"npResult.achievementText\">{{npResult.achievementText}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"results-wrapper-incorrect\">\n" +
    "            <div class=\"results-summary-text-wrapper col-xs-12\">\n" +
    "                <div class=\"results-summary-text\">{{npResult.summaryText}}</div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"results-summary-amount-wrapper row\">-->\n" +
    "                <!--<div class=\"results-summary-label-text col-xs-6\">{{npResult.summaryLabelText}}</div>-->\n" +
    "                <!--<div class=\"results-summary-pecentage col-xs-6\">{{npResult.summaryPecentage}}<div class=\"results-summary-pecentage-character\">%</div></div>-->\n" +
    "            <!--</div>-->\n" +
    "            <div ng-show=\"npResult.achievementText\">{{npResult.achievementText}}</div>\n" +
    "        </div>\n" +
    "<!-- <div class=\"results-wrapper-incorrect\">\n" +
    "            <div class=\"results-summary-amount-wrapper row\">\n" +
    "                <div class=\"results-summary-label-text col-xs-6\">{{npResult.summaryLabelText}}</div>\n" +
    "                <div class=\"results-summary-pecentage col-xs-6\">{{npResult.summaryPecentage}}<div class=\"results-summary-pecentage-character\">%</div></div>\n" +
    "            </div>\n" +
    "            <div class=\"results-summary-text-wrapper col-xs-12\">\n" +
    "                <div class=\"results-summary-text\">{{npResult.summaryText}}</div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"npResult.achievementText\">{{npResult.achievementText}}</div>\n" +
    "        </div>-->\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npAudio/npAudio.html',
    "<!--<div class=\"{{component.type}}\" ng-controller=\"npAudioController as npAudio\" id=\"{{npAudio.id}}\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    \n" +
    "    <videogular vg-theme=\"npAudio.config.theme.url\">\n" +
    "            <vg-video vg-src=\"npAudio.config.sources\" vg-native-controls=\"true\"></vg-video>\n" +
    "    </videogular>\n" +
    "    \n" +
    "    <audio\n" +
    "        width=\"100%\"\n" +
    "        preload=\"auto\"\n" +
    "        mediaelement>\n" +
    "        \n" +
    "                        <source type=\"video/{{npAudio.types[0]}}\" src=\"{{npAudio.baseURL}}.{{npAudio.types[0]}}\" />\n" +
    "                        <source ng-repeat=\"type in npAudio.types\" type=\"video/{{type}}\" src=\"{{npAudio.baseURL}}.{{type}}\" />\n" +
    "        \n" +
    "        <object width=\"100%\"  type=\"application/x-shockwave-flash\" data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\" />\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{npAudio.baseURL}}.mp3\" />\n" +
    "             Image as a last resort \n" +
    "            <img src=\"myvideo.jpg\" width=\"320\" height=\"240\" title=\"No video playback capabilities\" />\n" +
    "        </object>\n" +
    "    </audio>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>-->\n" +
    "\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "\n" +
    "<np-audio component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "\n" +
    "  <audio\n" +
    "    width=\"{{component.data.width}}\"\n" +
    "    preload=\"{{component.data.preload}}\"\n" +
    "    ng-src=\"{{component.data.src}}\"\n" +
    "    controls=\"controls\"\n" +
    "    mediaelelement>\n" +
    "\n" +
    "    <source ng-repeat=\"source in npAudio.sources\" type=\"audio/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "\n" +
    "    <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\"\n" +
    "            data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "      <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\"/>\n" +
    "      <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp3\"/>\n" +
    "      <!--<param name=\"allowfullscreen\" value=\"false\"/>-->\n" +
    "    </object>\n" +
    "  </audio>\n" +
    "\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</np-audio>\n" +
    "\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "\n" +
    "<!--<np-video component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
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
    "</np-video>-->\n"
  );


  $templateCache.put('scripts/component/npButton/npButton.html',
    "<!--<div class=\"{{component.type}} {{npButton.type}} np-cmp-main btn\"  ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go()\">-->\n" +
    "<!--<button class=\"{{component.type}} {{npButton.type}} {{buttonTypeClass}} np-cmp-main btn\" ng-if=\"npButton.data.type == 'btn-next'\" ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go($event)\">-->\n" +
    "<button class=\"{{component.type}} {{npButton.type}} {{buttonTypeClass}} np-cmp-main btn\" ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go($event)\">\n" +
    "    <span class=\"debug\">\n" +
    "        <span class=\"h3\">{{component.type}} -- <small>{{component.idx}}</small></span>\n" +
    "    </span>\n" +
    "    <span ng-bind-html=\"npButton.content\"></span>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</button>\n" +
    "<!--</div>-->"
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


  $templateCache.put('scripts/component/npDragAndDropMatch/npDragAndDropMatch.html',
    "<div class=\"{{component.type}} npDragAndDropMatch\" ng-controller=\"npDragAndDropMatchController as npDragAndDropMatch\" id=\"{{npDragAndDropMatch.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button ng-repeat=\"draggableButton in npDragAndDropMatch.draggableButtons\" data-reference=\"{{$index}}\"  id=\"id{{$index}}\" ng-click=\"npDragAndDropMatch.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\"  x=\"0\" y=\"0\" width=\"99%\" height=\"99%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent body-copy-strong\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-two\">-->\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hitAreaWrapper\">                    \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropMatch.draggableButtons\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <div class=\"hit-area-background\"></div>\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "\n" +
    "<!--                                    <div question-feedback-build class=\"row\">\n" +
    "                                        <div  class=\"col-sm-7 question-feedback\">\n" +
    "                                            <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                                                <div class=\"positive-feedback-icon\">\n" +
    "                                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                                         width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                                         enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                                            <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                            <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                                            <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                                            <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                                            <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                                        </linearGradient>\n" +
    "                                                        <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                                        <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                                                    </svg>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                                                <div class=\"question-feedback-label\">Feedback area</div>\n" +
    "                                            </div\n" +
    "                                        </div>\n" +
    "                                        <div  class=\"col-sm-5\">\n" +
    "                                        </div>\n" +
    "                                    </div>-->\n" +
    "                                    <div class=\"button-content\">\n" +
    "                                        <img class=\"hitAreaImage\" ng-src=\"{{draggableButton.matchingImage}}\" alt=\"{{hitArea.alt}}\" />\n" +
    "                                        <div class=\"hitAreaContent body-copy\" ng-bind-html=\"draggableButton.matchingContent\" ></div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"button-completion-content vertical-centered\">\n" +
    "                                        <div class=\"row \" >\n" +
    "                                            <!--<div class=\" col-xs-2\" >-->\n" +
    "                                                <div class=\"positive-feedback-image\">\n" +
    "                                                <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                                     width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                                     enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                                        <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                        <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                                        <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                                        <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                                        <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                        <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                                    </linearGradient>\n" +
    "                                                    <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                                    <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                                                </svg>\n" +
    "                                            </div>\n" +
    "                                            <!--<div class=\"\" >-->\n" +
    "                                                <div class=\"positive-feedback-content body-copy \" ng-bind-html=\"positiveFeedback\"></div>\n" +
    "                                            <!--</div>-->\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npDragAndDropPrioritize/npDragAndDropPrioritize.html',
    "<div class=\"{{component.type}} npDragAndDropPrioritize\" ng-controller=\"npDragAndDropPrioritizeController as npDragAndDropPrioritize\" id=\"{{npDragAndDropPrioritize.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button-prioritize ng-repeat=\"draggableButton in npDragAndDropPrioritize.draggableButtons\" data-reference=\"{{$index}}\"  id=\"id{{$index}}\" ng-click=\"npDragAndDropPrioritize.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hitAreaWrapper\">                    \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropPrioritize.draggableButtons\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "                                    <div class=\"button-prioritize-content\">\n" +
    "                                        <div class=\"hit-area-prioritize-content hit-area-number\">{{$index + 1}}</div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"button-completion-prioritize-content\">\n" +
    "                                        <div class=\"centered-prioritize-content\" >\n" +
    "                                            <div class=\"positive-feedback-image \"></div>\n" +
    "                                            <div class=\"positive-feedback-content h4\" ng-bind-html=\"positiveFeedback\"></div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                        <div class=\"hit-area-background\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npDragAndDropSelect/npDragAndDropSelect.html',
    "<div class=\"{{component.type}} npDragAndDropSelect\" ng-controller=\"npDragAndDropSelectController as npDragAndDropSelect\" id=\"{{npDragAndDropSelect.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button-select ng-repeat=\"draggableButton in npDragAndDropSelect.draggableButtons\" data-reference=\"{{$index}}\" id=\"id{{$index}}\" ng-click=\"npDragAndDropSelect.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent subhead-copy\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-two\">-->\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hit-area-wrapper\">        \n" +
    "                    <div id=\"select-hit-area-background\"></div>            \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropSelect.draggableButtons\" data-match=\"{{draggableButton.select}}\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                    <defs>\n" +
    "                                    </defs>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "                                    <div class=\"select-button-completion-content\">\n" +
    "                                        <div class=\"row\" >\n" +
    "                                            <img class=\"feedback-draggable-button-image\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                            <div class=\"feedback-draggable-button-content body-copy\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "            <div np-drag-and-drop-select-evaluate class=\"row\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <div class=\"select-button-wrapper\">\n" +
    "                        <button class=\"btn-submit btn\" is-clickable=\"true\" ng-click=\"evaluate()\">\n" +
    "                            <span>SUBMIT</span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <div class=\"select-response-wrapper\">\n" +
    "                        <div class=\"select-response-correct row\">\n" +
    "                            <div class=\"select-response-background\"></div>\n" +
    "                            <div class=\"col-xs-1 left-column-select\">              \n" +
    "                                <div class=\"response-icon-wrapper\">             \n" +
    "                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"58.368 58.368 22.8 22.801\" enable-background=\"new 58.368 58.368 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"425.3076\" y1=\"46.0552\" x2=\"423.378\" y2=\"48.4836\" gradientTransform=\"matrix(6.1102 0.342 -0.342 6.1102 -2507.3147 -365.3418)\">\n" +
    "                                            <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                            <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                            <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                            <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                        </linearGradient>\n" +
    "                                        <polygon fill=\"url(#SVGID_1_)\" points=\"77.768,65.868 75.168,63.568 67.667,72.369 63.167,68.568 60.867,71.168 67.968,77.168 \"/>\n" +
    "                                        <path fill=\"#9A7D46\" d=\"M69.768,81.168c-6.3,0-11.4-5.1-11.4-11.4c0-6.3,5.1-11.4,11.4-11.4s11.4,5.101,11.4,11.4 C81.168,76.069,76.067,81.168,69.768,81.168z M69.768,59.368c-5.7,0-10.4,4.7-10.4,10.4c0,5.7,4.7,10.4,10.4,10.4  c5.7,0,10.4-4.7,10.4-10.4C80.168,64.068,75.468,59.368,69.768,59.368z\"/>\n" +
    "                                    </svg>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-11 right-column-select body-copy select-response-feedback select-correct-feedback\" ng-bind-html=\"npDragAndDropSelect.positiveFeedback\" >\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"select-response-incorrect row\">\n" +
    "                            <div class=\"select-response-background\"></div>\n" +
    "                            <div class=\"col-xs-1 left-column-select\">\n" +
    "                                <div class=\"response-icon-wrapper\">\n" +
    "                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"0 0 22.8 22.801\" style=\"enable-background:new 0 0 22.8 22.801;\" xml:space=\"preserve\">\n" +
    "                                        <path style=\"fill:#9A7D46;\" d=\"M11.4,22.801C5.101,22.801,0,17.7,0,11.4S5.101,0,11.4,0S22.8,5.101,22.8,11.4  S17.7,22.801,11.4,22.801z M11.4,1C5.7,1,1,5.7,1,11.4s4.7,10.4,10.4,10.4S21.8,17.101,21.8,11.4S17.101,1,11.4,1z\"/>\n" +
    "                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"274.4922\" y1=\"-249.2896\" x2=\"261.4488\" y2=\"-262.713\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                            <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                            <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                            <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                            <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                            <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                            <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                            <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                            <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                            <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                            <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                        </linearGradient>\n" +
    "                                        <polygon style=\"fill:url(#SVGID_1_);\" points=\"6,19.4 11.4,14.101 16.7,19.4 19.2,16.9 13.9,11.601 19.2,6.301 16.7,3.7 11.4,9 6.101,3.7 3.601,6.301 8.9,11.601 3.5,16.9 \"/>\n" +
    "                                    </svg>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-11 right-column-select body-copy select-response-feedback select-incorrect-feedback\" ng-bind-html=\"npDragAndDropSelect.negativeFeedback\" >\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npFeature/npFeature.html',
    "<div new-player-page-top class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npFeatureController as npFeature\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npFlashCards/npFlashCards.html',
    "<div np-flash-cards id=\"{{npFlashCards.id}} \" class=\"{{component.type}} np-cmp-wrapper np-flash-card\" ng-controller=\"npFlashCardsController as npFlashCards\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- \n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--::::::::::::  flash-card  ::::::::::::::::-->\n" +
    "    <div id=\"flash-cards\" class=\"row\">\n" +
    "        <div np-swipe-angular-draggable  class=\"col-sm-12\">\n" +
    "            <div id=\"flash-cards-swipe-container\">\n" +
    "                <div flash-card class=\"flash-cards-object \" ng-repeat=\"flashCardComponent in npFlashCards.flashCardComponents\">\n" +
    "                    <div class=\"flash-card-front-wrapper\">\n" +
    "                        <div class=\"flash-card-background\"></div>\n" +
    "                        <div class=\"body-copy flash-card-content-front\" ng-bind-html=\"flashCardComponent.contentFront\"></div>\n" +
    "                        <div class=\"flash-card-border\"></div>\n" +
    "                        <div class=\"flash-card-overlay\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"flash-card-back-wrapper\">\n" +
    "                        <div class=\"flash-card-background\"></div>\n" +
    "                        <div class=\"flash-card-content-back\" ng-bind-html=\"flashCardComponent.contentBack\"></div>\n" +
    "                        <!--<p class=\"flash-card-content-back\" ng-bind-html=\"flashCardComponent.contentBack\"></p>-->\n" +
    "                    </div>\n" +
    "                    <div class=\"flash-card-button\" ng-click=\"npFlashCards.update(flashCardComponent)\">\n" +
    "                        <svg version=\"1.0\"  class='button-holder' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"25px\" height=\"19.7px\" viewBox=\"343.2 692.6 25 19.7\" xml:space=\"preserve\">\n" +
    "                            <g id=\"refresh-icon\">\n" +
    "                                <path id=\"refresh-icon-shape\" d=\"M362.8,695.6l-2.3,2.301c-1.2-1.2-2.9-2-4.8-2c-3.8,0-6.8,3.1-6.8,6.8l0,0h2.699  l-4.199,4.2l-4.2-4.2h2.6l0,0c0-5.601,4.5-10.101,10.101-10.101C358.4,692.6,360.9,693.7,362.8,695.6z M368.2,702.3l-4.2-4.2  l-4.2,4.2h2.7l0,0c0,3.8-3.1,6.8-6.8,6.8c-1.9,0-3.601-0.8-4.8-2L348.6,709.4c1.801,1.8,4.301,2.899,7.101,2.899  c5.6,0,10.1-4.5,10.1-10.1l0,0h2.4V702.3z\"/>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div> \n" +
    "    </div> \n" +
    "</div> \n" +
    "<!--::::::::::::  flash-card  ::::::::::::::::-->\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
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
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "  <div class=\"np-cmp-main\" ng-if=\"!!npHTML.link\">\n" +
    "    <a ng-click=\"npHTML.handleLink(); $event.stopPropagation();\" ng-bind-html=\"npHTML.content\"></a>\n" +
    "  </div>\n" +
    "  <div ng-bind-html=\"npHTML.content\" class=\"np-cmp-main\" ng-if=\"!npHTML.link\"></div>\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
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
    "                <div hotspot-button-build ng-repeat=\"hotspotButton in npHotspot.hotspotButtons\">\n" +
    "                    <div class=\"{{hotspotButton.class}} hotspotButton\" ng-click=\"npHotspot.update(hotspotButton)\">\n" +
    "                        <!--<img class=\"hotspotButtonImage\" ng-src=\"{{hotspotButton.image}}\" alt=\"{{npHotspot.alt}}\" />-->\n" +
    "                        <div class=\"hotspotButtonImage\" ></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-5\">\n" +
    "            <div class=\"content-area\">\n" +
    "                <div class=\"content-background\">\n" +
    "                    <svg  class=\"content-background-svg\"  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <g id=\"Layer_2\">\n" +
    "                            <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                                <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                                <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                                <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                                <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                            </linearGradient>\n" +
    "                            <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        </g>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "                <div class=\"npHotspot-feedback body-copy\" ng-bind-html=\"npHotspot.feedback\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
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


  $templateCache.put('scripts/component/npList/npList.html',
    "<div class=\"{{component.type}} np-cmp-wrapper\" ng-controller=\"npListController as npList\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <div class=\"row media list-row\">\n" +
    "        <div class=\"column-1 col-md-4\">\n" +
    "            <div class=\"media-left media-middle\">\n" +
    "                <div np-component class=\"media-object list-object\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"column-2 col-md-8\">\n" +
    "            <div class=\"media-body\">\n" +
    "                <div ng-bind-html=\"npList.heading\" class=\"media-heading subhead-copy\"></div>\n" +
    "                <div ng-bind-html=\"npList.content\" class=\"np-cmp-main body-copy\" ng-if=\"!npList.link\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npMatch/npMatch.html',
    "<section id=\"np_matchgame\" class=\"col-xs-12\"> \n" +
    "    <form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npMatchController as npMatch\" ng-submit=\"npMatch.evaluate()\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "        <!--<h5 class=\"text-uppercase\">question:</h5>-->\n" +
    "        <div class=\"npMatch-content\" ng-bind-html=\"npMatch.content\"></div>\n" +
    "        <!--<h5 class=\"text-uppercase\">answers:</h5>-->\n" +
    "        <div np-component ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <button type=\"submit\" class=\"col-xs-offset-6 btn-primary\">Submit</button>        \n" +
    "            <button id=\"next_button\" class=\"btn-default\" ng-click=\"npMatch.nextPage($event)\" ng-show=\"npMatch.canContinue\">Next</button>\n" +
    "        </div>\n" +
    "    <!--    <div class=\"btn btn-default\">\n" +
    "            <input type=\"submit\" />\n" +
    "        </div>-->\n" +
    "        <!-- <div class=\"npMatch-feedback question-feedback col-xs-offset-5\" ng-bind-html=\"npMatch.feedback\"></div> -->\n" +
    "        <div question-feedback-build class=\"row\">\n" +
    "            <div  class=\"col-xs-12 col-md-4 col-md-offset-4 question-feedback\">\n" +
    "                <div class=\"question-feedback-wrapper\">\n" +
    "                    <div class=\"negative-feedback-icon\" ng-class=\"{'bad-feedback' : npMatch.feedbackBad}\">\n" +
    "                        <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                            <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                            <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </linearGradient>\n" +
    "                            <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                    <div class=\"question-feedback-label\" ng-bind-html=\"npMatch.feedback\">Feedback area</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</section>"
  );


  $templateCache.put('scripts/component/npMatchRow/npMatchRow.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"np-cmp-wrapper {{component.type}} rsDefault visibleNearby\" royalslider data-match=\"true\">\n" +
    "    <div np-component ng-repeat=\"component in components | orderBy:random\" idx=\"{{component.idx}}\"  class=\"matching-game-row\"></div>\n" +
    "</div>\n"
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
    "    <main ng-if=\"currentPage\" class=\"np-cmp-main\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "        <div ng-bind-html=\"npPage.title\" class=\"headline npPage-title\">{{npPage.title}}</div>\n" +
    "        <div ng-bind-html=\"npPage.subTitle\" class=\"npPage-subTitle\">{{npPage.subTitle}}</div>\n" +
    "        <div ng-bind-html=\"npPage.instructional\" class=\"npPage-instructional\">{{npPage.instructional}}</div>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </main>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npQuestion/npQuestion.html',
    "<div class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "    <!--<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">-->\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <p class=\"h5 quiz-label\">question:</p>\n" +
    "            <div class=\"npQuestion-content question-text h4\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "            <p class=\"h5 quiz-label\">answers:</p>\n" +
    "            <div np-component class=\"response-item\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <div class=\"npQuestion-content question-image\">\n" +
    "                <img class=\"img-responsive\" ng-src=\"{{npQuestion.questionImage}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-3 question-submit-wrapper\">\n" +
    "            <button type=\"submit\" class=\"btn-submit btn\" ng-click=\"npQuestion.evaluate()\">\n" +
    "                <span>Submit</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div question-feedback-build >\n" +
    "                <div  class=\"question-feedback\">\n" +
    "                    <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                        <div class=\"positive-feedback-icon absolute-vertical-center\">\n" +
    "                            <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                 width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                 enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"negative-feedback-icon absolute-vertical-center\">\n" +
    "                            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                    <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                    <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                    <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                    <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                    <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                    <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                    <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                    <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                        <div class=\"question-feedback-label\">Feedback area</div>\n" +
    "                    </div\n" +
    "                </div\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"col-sm-6\">\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-6\">\n" +
    "                </div>-->\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npQuiz/npQuiz.html',
    "<form class=\"np-cmp-wrapper {{component.type}} npQuiz\" ng-controller=\"npQuizController as npQuiz\"\n" +
    "      ng-submit=\"npQuiz.evaluate()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"npQuiz-content h4\" ng-bind-html=\"npQuiz.content\"></div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "    <div class=\"npQuiz-feedback\" ng-if=\"npQuiz.feedback\" ng-bind-html=\"npQuiz.feedback\"></div>\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npReveal/npReveal.html',
    "<div npReveal np-reveal-build id=\"{{npReveal.id}}\" class=\"{{component.type}} np-cmp-wrapper np-reveal\" ng-controller=\"npRevealController as npReveal\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- \n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::--> \n" +
    "    <div class=\"reveal-navigation col-md-12\">\n" +
    "        <div class=\" reveal-button-container center-block\">\n" +
    "            <div revealButton class=\"reveal-button\" ng-repeat=\"revealItem in npReveal.revealItems\" ng-click=\"npReveal.update(revealItem)\">\n" +
    "                <div class=\"reveal-button-wrap\">\n" +
    "                    <img class=\"reveal-button-image img-responsive\" ng-src=\"{{revealItem.buttonImage}}\" alt=\"{{revealItem.buttonAlt}}\" />\n" +
    "                </div>\n" +
    "                <div class=\"button-screen\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::-->\n" +
    "\n" +
    "    <!--::::::::::::  reveal  ::::::::::::::::-->\n" +
    "    <div class=\"col-md-12 reveal-objects-wrapper\">\n" +
    "        <div class=\"reveal-object\" ng-repeat=\"revealItemComponent in npReveal.revealItemComponents\">\n" +
    "            <div class=\"reveal-wrapper\">\n" +
    "                <div class=\"reveal-item-wrapper\">\n" +
    "                    <img ng-if=\"revealItemComponent.components[0].type == 'npImage'\" class=\"reveal-item reveal-image img-responsive\" ng-src=\"{{revealItemComponent.components[0].data.src}}\" alt=\"{{component.alt}}\" />\n" +
    "                    <video controls ng-if=\"revealItemComponent.components[0].type == 'npVideo'\" class=\"reveal-item reveal-video\" poster=\"{{revealItemComponent.components[0].data.poster}}\">\n" +
    "                        <source ng-src=\"{{revealItemComponent.components[0].data.baseURL+'.mp4'}}\"/>\n" +
    "                    </video>\n" +
    "                </div>\n" +
    "                <div class=\"reveal-content-wrapper\">\n" +
    "                    <div class=\"reveal-background\"></div>\n" +
    "                    <div class=\"reveal-content-text\">\n" +
    "                        <p class=\"subhead-copy\" ng-bind-html=\"revealItemComponent.heading\"></p>\n" +
    "                        <p class=\"body-copy reveal-text-body\" ng-bind-html=\"revealItemComponent.content\"></p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div> \n" +
    "    </div> \n" +
    "    <!--::::::::::::  reveal  ::::::::::::::::-->\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npTrivia/npTrivia.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npTriviaController as npTrivia\" ng-submit=\"npTrivia.evaluate()\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <!--    <div class=\"row\">\n" +
    "            <div class=\"npTrivia-content h4 col-xs-12\" ng-bind-html=\"npTrivia.content\"></div>\n" +
    "        </div>-->\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-2 np-spinner\">\n" +
    "            <div class=\"np-spinner-wrapper\">\n" +
    "                <np-price-is-right-spinner class=\"np-spinner-content\" spinTime=\"2000\" ng-hide=\"!npTrivia.pageId\" data-difficulty=\"{{npTrivia.difficulty}}\">\n" +
    "                    <div>0</div>\n" +
    "                    <div>100</div>\n" +
    "                    <div>200</div>\n" +
    "                    <div>300</div>\n" +
    "                    <div>400</div>\n" +
    "                    <div>500</div>\n" +
    "                    <div>600</div>\n" +
    "                    <div>700</div>\n" +
    "                    <div>800</div>\n" +
    "                    <div>0</div>\n" +
    "                    <div>100</div>\n" +
    "                    <div>200</div>\n" +
    "                    <div>300</div>\n" +
    "                    <div>400</div>\n" +
    "                    <div>500</div>\n" +
    "                    <div>600</div>\n" +
    "                    <div>700</div>\n" +
    "                    <div>800</div>\n" +
    "                    <div>900</div>\n" +
    "                    <div>1000</div>\n" +
    "                </np-price-is-right-spinner>\n" +
    "                <div class=\"np-gold-border\">\n" +
    "                    <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                    <style type=\"text/css\">\n" +
    "                        <![CDATA[\n" +
    "                        .st0{fill:url(#SVGID_1_);}\n" +
    "                        .st1{display:inline;}\n" +
    "                        .st2{display:none;}\n" +
    "                        ]]>\n" +
    "                    </style>\n" +
    "                    <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                    <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                    <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                    <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                    <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                    </g>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "                <div class=\"np-gold-pointer\">\n" +
    "                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"66.096px\" height=\"126.685px\" viewBox=\"308.824 1129.275 66.096 126.685\" style=\"enable-background:new 308.824 1129.275 66.096 126.685;\" xml:space=\"preserve\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"118.5967\" y1=\"-46.6729\" x2=\"105.6811\" y2=\"-62.1192\" gradientTransform=\"matrix(6.12 0 0 -6.12 -324.0952 866.6157)\">\n" +
    "                    <stop  offset=\"0.2306\" style=\"stop-color:#CAA04E\"/>\n" +
    "                    <stop  offset=\"0.3901\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                    <stop  offset=\"0.4768\" style=\"stop-color:#E1C27C\"/>\n" +
    "                    <stop  offset=\"0.5692\" style=\"stop-color:#CAA04E\"/>\n" +
    "                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <polygon style=\"fill:url(#SVGID_1_);\" points=\"374.92,1129.275 374.92,1255.96 308.824,1191.7 \"/>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--<div class=\"col-xs-10 np_row\" np-component ng-if=\"subCmp\" ng-repeat=\"component in npTrivia.seenComponents\" idx=\"{{component.idx}}\" ng-hide=\"npTrivia.pageId !== component.data.id\"></div>-->\n" +
    "        <div class=\"col-xs-10 np_row trivia-question-wrapper\">\n" +
    "            <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "            <div class=\"npTrivia-feedback\" ng-if=\"npTrivia.feedback\" ng-bind-html=\"npTrivia.feedback\"></div>\n" +
    "        </div> \n" +
    "    </div>\n" +
    "</form>\n"
  );


  $templateCache.put('scripts/component/npVideo/npVideo.html',
    "<np-video component=\"component\" id=\"{{component.data.id}}\" class=\"{{component.type}}\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--<video class=\"videoWidth\" height=\"{{component.data.height}}\" width=\"{{component.data.width}}\" poster=\"{{component.data.poster}}\" preload=\"{{component.data.preload}}\" ng-src=\"{{component.data.src}}\" controls=\"controls\" mediaelelement>-->\n" +
    "    <video ng-src=\"{{component.data.src}}\" class=\"videoWidth\" controls=\"controls\" >\n" +
    "        <source ng-repeat=\"source in npVideo.sources\" type=\"video/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "<!--        <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\" data=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\"/>\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp4\"/>\n" +
    "            <param name=\"allowfullscreen\" value=\"false\"/>\n" +
    "        </object>-->\n" +
    "    </video>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
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
