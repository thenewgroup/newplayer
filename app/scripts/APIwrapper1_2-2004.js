//function trace(message) {
//    if (window['console'] && window['console'].log)
//        window['console'].log(message);
//    else if (window['Console'] && window['Console'].log)
//        window['Console'].log(message);
//}

function initSCORMVersion() {
    var wrapperSCORMversion = getLMSVersion();
    if ('CSC' == wrapperSCORMversion) {
        SCORMAPI1_2();
    } else if ('1.2' == wrapperSCORMversion) {
        SCORMAPI1_2();
    } else if ('EZ2004' == wrapperSCORMversion) {
        SCORMAPI2004();
    } else if ('2004' == wrapperSCORMversion) {
        SCORMAPI2004();
    }
}

window.onbeforeunload = function() {
    var api = getAPIHandle();
    var wrapperSCORMversion = getLMSVersion();
    if ('CSC' == wrapperSCORMversion) {
        if (api == null) {
            trace("Unable to locate the LMS's API Implementation, LMSTerminate was not successful.");
        } else {
            doLMSFinish();
        }
    } else if ('1.2' == wrapperSCORMversion) {
        if (api == null) {
            trace("Unable to locate the LMS's API Implementation, LMSTerminate was not successful.");
        } else {
            doLMSFinish();
        }
    } else if ('EZ2004' == wrapperSCORMversion) {
        if (api == null) {
            trace("Unable to locate the LMS's API Implementation, LMSTerminate was not successful.");
        } else {
            LMSFinish();
        }
    } else if ('2004' == wrapperSCORMversion) {
        if (api == null) {
            trace("Unable to locate the LMS's API Implementation, LMSTerminate was not successful.");
        } else {
            LMSFinish();
        }
    }
};
function SCORMAPI2004() {
    trace('SCORMAPI2004');
    /*******************************************************************************
     **
     ** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
     ** exclusive, royalty free, license to use, modify and redistribute this
     ** software in source and binary code form, provided that i) this copyright
     ** notice and license appear on all copies of the software; and ii) Licensee does
     ** not utilize the software in a manner which is disparaging to CTC.
     **
     ** This software is provided "AS IS," without a warranty of any kind.  ALL
     ** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
     ** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
     ** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
     ** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
     ** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
     ** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
     ** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
     ** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
     ** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
     ** OF SUCH DAMAGES.
     **
     *******************************************************************************/

    /*******************************************************************************
     ** This file is part of the ADL Sample API Implementation intended to provide
     ** an elementary example of the concepts presented in the ADL Sharable
     ** Content Object Reference Model (SCORM).
     **
     ** The purpose in wrapping the calls to the API is to (1) provide a
     ** consistent means of finding the LMS API implementation within the window
     ** hierarchy and (2) to validate that the data being exchanged via the
     ** API conforms to the defined CMI data types.
     **
     ** This is just one possible example for implementing the API guidelines for
     ** runtime communication between an LMS and executable content components.
     ** There are several other possible implementations.
     **
     ** Usage: Executable course content can call the API Wrapper
     **      functions as follows:
     **
     **    javascript:
     **          var result = LMSInitialize();
     **          if (result != true)
     **          {
     **             // handle error
     **          }
     **
     **    authorware
     **          result := ReadURL("javascript:LMSInitialize()", 100)
     **
     *******************************************************************************/

    var ROOT;

    var _Debug = false;
    // set this to false to turn debugging off
    // and get rid of those annoying alert boxes.

    // Define exception/error codes
    var _NoError = 0;
    var _GeneralException = 101;
    var _GeneralInitializationFailure = 102;
    var _AlreadyInitialized = 103;
    var _ContentInstanceTerminated = 104;
    var _GeneralTerminationFailure = 111;
    var _TerminationBeforeInitialization = 112;
    var _TerminationAfterTermination = 113;
    var _ReceivedDataBeforeInitialization = 122;
    var _ReceivedDataAfterTermination = 123;
    var _StoreDataBeforeInitialization = 132;
    var _StoreDataAfterTermination = 133;
    var _CommitBeforeInitialization = 142;
    var _CommitAfterTermination = 143;
    var _GeneralArgumentError = 201;
    var _GeneralGetFailure = 301;
    var _GeneralSetFailure = 351;
    var _GeneralCommitFailure = 391;
    var _UndefinedDataModelElement = 401;
    var _UnimplementedDataModelElement = 402;
    var _DataModelElementValueNotInitialized = 403;
    var _DataModelElementIsReadOnly = 404;
    var _DataModelElementIsWriteOnly = 405;
    var _DataModelElementTypeMismatch = 406;
    var _DataModelElementValueOutOfRange = 407;
    var _NotInitialized;
    // value?
    // local variable definitions
    var apiHandle = null;
    var API = null;
    var findAPITries = 0;
    var lmsFinishCalled = false;
    var lmsInitCalled = false;

    /*******************************************************************************
     **
     ** Function: LMSInitialize()
     ** Inputs:  None
     ** Return:  CMIBoolean true if the initialization was successful, or
     **          CMIBoolean false if the initialization failed.
     **
     ** Description:
     ** Initialize communication with LMS by calling the Initialize
     ** function which will be implemented by the LMS.
     **
     *******************************************************************************/
    this.LMSInitialize = function() {
        ROOT = this;
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
            return "false";
        }
        if (lmsInitCalled == false) {
            var result = api.Initialize("");

            if (result.toString() != "true") {
                var err = ErrorHandler("LMSInitialize Error: ");
            }
            lmsInitCalled = true;
            lmsFinishCalled = false;
            if (this.top.apiHandle) {
                this.top.lmsInitCalled = lmsInitCalled;
                this.top.lmsFinishCalled = lmsFinishCalled;
            }
            return result.toString();
        } else if (_Debug) {
            F
            if (trace)
                trace("LMSInitialize already called");
        }
        return "true";
    };
    /*******************************************************************************
     **
     ** Function LMSFinish()
     ** Inputs:  None
     ** Return:  CMIBoolean true if successful
     **          CMIBoolean false if failed.
     **
     ** Description:
     ** Close communication with LMS by calling the Terminate
     ** function which will be implemented by the LMS
     **
     *******************************************************************************/
    this.LMSFinish = function() {
        var result = "false";
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
            return "false";
        } else {
            // call the Terminate this.that should be implemented by the API
            var finishCalled = lmsFinishCalled;
            lmsFinishCalled = true;
            lmsInitCalled = false;
            if (this.top.apiHandle) {
                this.top.lmsInitCalled = lmsInitCalled;
                this.top.lmsFinishCalled = lmsFinishCalled;
            }
            if (finishCalled == false) {
                result = api.Terminate("");
            } else if (_Debug) {
                if (trace)
                    trace("LMSFinish already called");
            }
        }
        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function LMSGetValue(name)
     ** Inputs:  name - string representing the cmi data model defined category or
     **             element (e.g. cmi.core.student_id)
     ** Return:  The value presently assigned by the LMS to the cmi data model
     **       element defined by the element or category identified by the name
     **       input value.
     **
     ** Description:
     ** Wraps the call to the LMS GetValue method
     **
     *******************************************************************************/
    this.LMSGetValue = function(name) {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
            return "";
        } else if (lmsFinishCalled == true) {
            if (_Debug)
                if (trace)
                    trace('Unable to perform LMSGetValue after LMSFinish already called')

            return ""
        } else {
            var value = api.GetValue(name);
            var valString = value.toString();

            if (trace)
                trace('LMSGetValue for ' + name + ' = [' + valString + ']', 16)
            return valString;
        }
    };
    /*******************************************************************************
     **
     ** Function LMSSetValue(name, value)
     ** Inputs:  name -string representing the data model defined category or element
     **          value -the value that the named element or category will be assigned
     ** Return:  CMIBoolean true if successful
     **          CMIBoolean false if failed.
     **
     ** Description:
     ** Wraps the call to the LMS SetValue function
     **
     *******************************************************************************/
    this.LMSSetValue = function(name, value) {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
            return;
        } else if (lmsFinishCalled == true) {
            if (_Debug)
                if (trace)
                    trace('Unable to perform LMSSetValue after LMSFinish already called')
        } else {
            var result = api.SetValue(name, value);
            if (trace)
                trace('LMSSetValue for ' + name + ' to [' + value + ']', 16)
            if (result.toString() != "true") {
                var err = ErrorHandler("LMSSetValue Error: ");
            }
        }
        return;
    };
    /*******************************************************************************
     **
     ** Function LMSCommit()
     ** Inputs:  None
     ** Return:  None
     **
     ** Description:
     ** Call the Commit function
     **
     *******************************************************************************/
    this.LMSCommit = function() {
        /* result was local scope in the last else block: rlarson 5/24/2001 */
        var result = "false";
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
            return "false";
        } else if (lmsFinishCalled == true) {
            if (_Debug)
                if (trace)
                    trace('Unable to perform LMSCommit after LMSFinish already called')
        } else {
            result = api.Commit("");
            if (result.toString() != "true") {
                var err = ErrorHandler("LMSCommit Error: ");
            }
        }

        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function LMSGetLastError()
     ** Inputs:  None
     ** Return:  The error code that was set by the last LMS function call
     **
     ** Description:
     ** Call the GetLastError function
     **
     *******************************************************************************/
    this.LMSGetLastError = function() {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
            //since we can't get the error code from the LMS, return a general error
            return _GeneralError;
        }

        return api.GetLastError().toString();
    };
    /*******************************************************************************
     **
     ** Function LMSGetErrorString(errorCode)
     ** Inputs:  errorCode - Error Code
     ** Return:  The textual description that corresponds to the input error code
     **
     ** Description:
     ** Call the GetErrorString function
     **
     ********************************************************************************/
    this.LMSGetErrorString = function(errorCode) {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
        }

        return api.GetErrorString(errorCode).toString();
    };
    /*******************************************************************************
     **
     ** Function LMSGetDiagnostic(errorCode)
     ** Inputs:  errorCode - Error Code(integer format), or null
     ** Return:  The vendor specific textual description that corresponds to the
     **          input error code
     **
     ** Description:
     ** Call the GetDiagnostic function
     **
     *******************************************************************************/
    this.LMSGetDiagnostic = function(errorCode) {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
        }

        return api.GetDiagnostic(errorCode).toString();
    };
    /*******************************************************************************
     **
     ** Function LMSIsInitialized()
     ** Inputs:  none
     ** Return:  true if the LMS API is currently initialized, otherwise false
     **
     ** Description:
     ** Determines if the LMS API is currently initialized or not.
     **
     *******************************************************************************/
    this.LMSIsInitialized = function() {
        // there is no direct method for determining if the LMS API is initialized
        // for example an LMSIsInitialized function defined on the API so we'll try
        // a simple LMSGetValue and trap for the LMS Not Initialized Error

        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
            return false;
        } else if (lmsFinishCalled == true) {
            return false
        } else {
            var value = api.GetValue("cmi.core.student_name");
            if (value.toString().length == 0) {
                var errCode = parseInt(api.GetLastError().toString(), 10);
                trace("error code: " + errCode)
                if (errCode == _NotInitialized)
                    return false;
            }
            return true;
        }
    };
    /*******************************************************************************
     **
     ** Function ErrorHandler()
     ** Inputs:  None
     ** Return:  The current value of the LMS Error Code
     **
     ** Description:
     ** Determines if an error was encountered by the previous API call
     ** and if so, displays a message to the user.  If the error code
     ** has associated text it is also displayed.
     **
     *******************************************************************************/
    this.ErrorHandler = function(str) {
        var api = getAPIHandle();
        if (api == null) {
            if (trace)
                trace("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
            return;
        }

        // check for errors caused by or from the LMS
        var errCode = parseInt(api.GetLastError().toString(), 10);
        if (errCode != _NoError) {
            // an error was encountered so display the error description
            var errDescription = api.GetErrorString(errCode);

            if (_Debug == true) {
                errDescription += "\n";
                errDescription += api.GetDiagnostic(null);
                // by passing null to GetDiagnostic, we get any available diagnostics
                // on the previous error.
            }

            if (trace)
                trace(str + errDescription);
        }

        return errCode;
    };
    /******************************************************************************
     **
     ** Function getAPIHandle()
     ** Inputs:  None
     ** Return:  value contained by APIHandle
     **
     ** Description:
     ** Returns the handle to API object if it was previously set,
     ** otherwise it returns null
     **
     *******************************************************************************/
    this.getAPIHandle = function() {
        if (apiHandle == null) {
            apiHandle = getAPI();
        }

        return apiHandle;
    };
    /*******************************************************************************
     **
     ** Function findAPI(win)
     ** Inputs:  win - a Window Object
     ** Return:  If an API object is found, it's returned, otherwise null is returned
     **
     ** Description:
     ** This function looks for an object named API_1484_11 in parent and opener windows
     **
     *******************************************************************************/
    this.findAPI = function(win) {
        var nParentsSearched = 0;

        while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win) && (nParentsSearched <= 100)) {
            nParentsSearched++;
            win = win.parent;
        }

        return win.API_1484_11;
    };
    /*******************************************************************************
     **
     ** Function getAPI()
     ** Inputs:  none
     ** Return:  If an API object is found, it's returned, otherwise null is returned
     **
     ** Description:
     ** This function looks for an object named API, first in the current window's
     ** frame hierarchy and then, if necessary, in the current window's opener window
     ** hierarchy (if there is an opener window).
     **
     *******************************************************************************/
    this.getAPI = function() {
        var API = null;

        if ((window.parent != null) && (window.parent != window)) {
            API = findAPI(window.parent);
        }

        if ((API == null) && (window.opener != null)) {
            API = findAPI(window.opener);
        }
        return API;
    };
}

function SCORMAPI1_2() {
    /****************************************************************************
     SCORM_12_APIWrapper.js
     2000, 2011 Advanced Distributed Learning (ADL). Some Rights Reserved.
     *****************************************************************************
     
     Advanced Distributed Learning ("ADL") grants you ("Licensee") a  non-exclusive,
     royalty free, license to use and redistribute this  software in source and binary
     code form, provided that i) this copyright  notice and license appear on all
     copies of the software; and ii) Licensee does not utilize the software in a
     manner which is disparaging to ADL.
     
     This software is provided "AS IS," without a warranty of any kind.
     ALL EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING
     ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR
     NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL AND ITS LICENSORS SHALL NOT BE LIABLE
     FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
     DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL ADL OR ITS LICENSORS
     BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL,
     CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE
     THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF
     ADL HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
     
     *****************************************************************************
     *SCORM_12_APIwrapper.js code is licensed under the Creative Commons
     Attribution-ShareAlike 3.0 Unported License.
     
     To view a copy of this license:
     
     - Visit http://creativecommons.org/licenses/by-sa/3.0/
     - Or send a letter to
     Creative Commons, 444 Castro Street,  Suite 900, Mountain View,
     California, 94041, USA.
     
     The following is a summary of the full license which is available at:
     
     - http://creativecommons.org/licenses/by-sa/3.0/legalcode
     
     *****************************************************************************
     
     Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
     
     You are free to:
     
     - Share : to copy, distribute and transmit the work
     - Remix : to adapt the work
     
     Under the following conditions:
     
     - Attribution: You must attribute the work in the manner specified by
     the author or licensor (but not in any way that suggests that they
     endorse you or your use of the work).
     
     - Share Alike: If you alter, transform, or build upon this work, you
     may distribute the resulting work only under the same or similar
     license to this one.
     
     With the understanding that:
     
     - Waiver: Any of the above conditions can be waived if you get permission
     from the copyright holder.
     
     - Public Domain: Where the work or any of its elements is in the public
     domain under applicable law, that status is in no way affected by the license.
     
     - Other Rights: In no way are any of the following rights affected by the license:
     
     * Your fair dealing or fair use rights, or other applicable copyright
     exceptions and limitations;
     
     * The author's moral rights;
     
     * Rights other persons may have either in the work itself or in how the
     work is used, such as publicity or privacy rights.
     
     - Notice: For any reuse or distribution, you must make clear to others the
     license terms of this work.
     
     ****************************************************************************/
    /*******************************************************************************
     ** Usage: Executable course content can call the API Wrapper
     **      functions as follows:
     **
     **    javascript:
     **          var result = doLMSInitialize();
     **          if (result != true)
     **          {
     **             // handle error
     **          }
     **
     **    authorware:
     **          result := ReadURL("javascript:doLMSInitialize()", 100)
     **
     **    director:
     **          result = externalEvent("javascript:doLMSInitialize()")
     **
     **
     *******************************************************************************/

    var debug = true;
    // set this to false to turn debugging off

    var output = window.console;
    // output can be set to any object that has a log(string) function
    // such as: var output = { log: function(str){alert(str);} };

    // Define exception/error codes
    var _NoError = {
        "code": "0",
        "string": "No Error",
        "diagnostic": "No Error"
    };
    var _GeneralException = {
        "code": "101",
        "string": "General Exception",
        "diagnostic": "General Exception"
    };

    var initialized = false;

    // local variable definitions
    var apiHandle = null;

    /*******************************************************************************
     **
     ** Function: doLMSInitialize()
     ** Inputs:  None
     ** Return:  true if the initialization was successful, or
     **          false if the initialization failed.
     **
     ** Description:
     ** Initialize communication with LMS by calling the LMSInitialize
     ** function which will be implemented by the LMS.
     **
     *******************************************************************************/
    this.doLMSInitialize = function() {
        if (initialized)
            return "true";

        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
            return "false";
        }

        var result = api.LMSInitialize("");
        if (result.toString() != "true") {
            var err = ErrorHandler();
            message("LMSInitialize failed with error code: " + err.code);
        } else {
            initialized = true;
        }

        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSFinish()
     ** Inputs:  None
     ** Return:  true if successful
     **          false if failed.
     **
     ** Description:
     ** Close communication with LMS by calling the LMSFinish
     ** function which will be implemented by the LMS
     **
     *******************************************************************************/
    this.doLMSFinish = function() {
        if (!initialized)
            return "true";

        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
            return "false";
        } else {
            // call the LMSFinish function that should be implemented by the API
            var result = api.LMSFinish("");
            if (result.toString() != "true") {
                var err = ErrorHandler();
                message("LMSFinish failed with error code: " + err.code);
            }
        }

        initialized = false;

        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSGetValue(name)
     ** Inputs:  name - string representing the cmi data model defined category or
     **             element (e.g. cmi.core.student_id)
     ** Return:  The value presently assigned by the LMS to the cmi data model
     **       element defined by the element or category identified by the name
     **       input value.
     **
     ** Description:
     ** Wraps the call to the LMS LMSGetValue method
     **
     *******************************************************************************/
    this.doLMSGetValue = function(name) {
        var api = getAPIHandle();
        var result = "";
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
        } else if (!initialized && !doLMSInitialize()) {
            var err = ErrorHandler();
            // get why doLMSInitialize() returned false
            message("LMSGetValue failed - Could not initialize communication with the LMS - error code: " + err.code);
        } else {
            result = api.LMSGetValue(name);

            var error = ErrorHandler();
            if (error.code != _NoError.code) {
                // an error was encountered so display the error description
                message("LMSGetValue(" + name + ") failed. \n" + error.code + ": " + error.string);
                result = "";
            }
        }
        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSSetValue(name, value)
     ** Inputs:  name -string representing the data model defined category or element
     **          value -the value that the named element or category will be assigned
     ** Return:  true if successful
     **          false if failed.
     **
     ** Description:
     ** Wraps the call to the LMS LMSSetValue function
     **
     *******************************************************************************/
    this.doLMSSetValue = function(name, value) {
        var api = getAPIHandle();
        var result = "false";
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
        } else if (!initialized && !doLMSInitialize()) {
            var err = ErrorHandler();
            // get why doLMSInitialize() returned false
            message("LMSSetValue failed - Could not initialize communication with the LMS - error code: " + err.code);
        } else {
            result = api.LMSSetValue(name, value);
            if (result.toString() != "true") {
                var err = ErrorHandler();
                message("LMSSetValue(" + name + ", " + value + ") failed. \n" + err.code + ": " + err.string);
            }
        }

        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSCommit()
     ** Inputs:  None
     ** Return:  true if successful
     **          false if failed.
     **
     ** Description:
     ** Commits the data to the LMS.
     **
     *******************************************************************************/
    this.doLMSCommit = function() {
        var api = getAPIHandle();
        var result = "false";
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
        } else if (!initialized && !doLMSInitialize()) {
            var err = ErrorHandler();
            // get why doLMSInitialize() returned false
            message("LMSCommit failed - Could not initialize communication with the LMS - error code: " + err.code);
        } else {
            result = api.LMSCommit("");
            if (result != "true") {
                var err = ErrorHandler();
                message("LMSCommit failed - error code: " + err.code);
            }
        }

        return result.toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSGetLastError()
     ** Inputs:  None
     ** Return:  The error code that was set by the last LMS function call
     **
     ** Description:
     ** Call the LMSGetLastError function
     **
     *******************************************************************************/
    this.doLMSGetLastError = function() {
        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
            //since we can't get the error code from the LMS, return a general error
            return _GeneralException.code;
            //General Exception
        }

        return api.LMSGetLastError().toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSGetErrorString(errorCode)
     ** Inputs:  errorCode - Error Code
     ** Return:  The textual description that corresponds to the input error code
     **
     ** Description:
     ** Call the LMSGetErrorString function
     **
     ********************************************************************************/
    this.doLMSGetErrorString = function(errorCode) {
        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
            return _GeneralException.string;
        }

        return api.LMSGetErrorString(errorCode).toString();
    };
    /*******************************************************************************
     **
     ** Function doLMSGetDiagnostic(errorCode)
     ** Inputs:  errorCode - Error Code(integer format), or null
     ** Return:  The vendor specific textual description that corresponds to the
     **          input error code
     **
     ** Description:
     ** Call the LMSGetDiagnostic function
     **
     *******************************************************************************/
    this.doLMSGetDiagnostic = function(errorCode) {
        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
            return "Unable to locate the LMS's API Implementation. LMSGetDiagnostic was not successful.";
        }

        return api.LMSGetDiagnostic(errorCode).toString();
    };
    /*******************************************************************************
     **
     ** Function ErrorHandler()
     ** Inputs:  None
     ** Return:  The current error
     **
     ** Description:
     ** Determines if an error was encountered by the previous API call
     ** and if so, returns the error.
     **
     ** Usage:
     ** var last_error = ErrorHandler();
     ** if (last_error.code != _NoError.code)
     ** {
     **    message("Encountered an error. Code: " + last_error.code +
     **                                "\nMessage: " + last_error.string +
     **                                "\nDiagnostics: " + last_error.diagnostic);
     ** }
     *******************************************************************************/
    this.ErrorHandler = function() {
        var error = {
            "code": _NoError.code,
            "string": _NoError.string,
            "diagnostic": _NoError.diagnostic
        };
        var api = getAPIHandle();
        if (api == null) {
            message("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
            error.code = _GeneralException.code;
            error.string = _GeneralException.string;
            error.diagnostic = "Unable to locate the LMS's API Implementation. Cannot determine LMS error code.";
            return error;
        }

        // check for errors caused by or from the LMS
        error.code = api.LMSGetLastError().toString();
        if (error.code != _NoError.code) {
            // an error was encountered so display the error description
            error.string = api.LMSGetErrorString(error.code);
            error.diagnostic = api.LMSGetDiagnostic("");
        }

        return error;
    };
    /******************************************************************************
     **
     ** Function getAPIHandle()
     ** Inputs:  None
     ** Return:  value contained by APIHandle
     **
     ** Description:
     ** Returns the handle to API object if it was previously set,
     ** otherwise it returns null
     **
     *******************************************************************************/
    this.getAPIHandle = function() {
        if (apiHandle == null) {
            apiHandle = getAPI();
        }

        return apiHandle;
    };
    /*******************************************************************************
     **
     ** Function findAPI(win)
     ** Inputs:  win - a Window Object
     ** Return:  If an API object is found, it's returned, otherwise null is returned
     **
     ** Description:
     ** This function looks for an object named API in parent and opener windows
     **
     *******************************************************************************/
    this.findAPI = function(win) {
        var findAPITries = 0;
        while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
            findAPITries++;
            // Note: 7 is an arbitrary number, but should be more than sufficient
            if (findAPITries > 7) {
                message("Error finding API -- too deeply nested.");
                return null;
            }

            win = win.parent;
        }
        return win.API;
    };
    /*******************************************************************************
     **
     ** Function getAPI()
     ** Inputs:  none
     ** Return:  If an API object is found, it's returned, otherwise null is returned
     **
     ** Description:
     ** This function looks for an object named API, first in the current window's
     ** frame hierarchy and then, if necessary, in the current window's opener window
     ** hierarchy (if there is an opener window).
     **
     *******************************************************************************/
    this.getAPI = function() {
        var theAPI = findAPI(window);
        if ((theAPI == null) && (window.opener != null) && (typeof (window.opener) != "undefined")) {
            theAPI = findAPI(window.opener);
        }
        if (theAPI == null) {
            message("Unable to find an API adapter");
        }
        return theAPI
    };
    /*******************************************************************************
     **
     ** Function message(str)
     ** Inputs:  String - message you want to send to the designated output
     ** Return:  none
     ** Depends on: boolean debug to indicate if output is wanted
     **             object output to handle the messages. must implement a function
     **             log(string)
     **
     ** Description:
     ** This function outputs messages to a specified output. You can define your own
     ** output object. It will just need to implement a log(string) function. This
     ** interface was used so that the output could be assigned the window.console object.
     *******************************************************************************/
    this.message = function(str) {
        if (debug) {
            output.log(str);
        }
    };
}