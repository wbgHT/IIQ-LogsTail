
/**
 * Create the module.
 */

var logsTailModule = angular.module('LogsTail', ['ui.bootstrap', 'sailpoint.i18n']);

logsTailModule.config(function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = "CSRF-TOKEN";
});



/**
 * Load log file
 */
function loadLogFile(LogsTailService, file, nlines) {
	console.log("Refreshing file....");
	$('#loader').show();
	var logsRes = LogsTailService.getLogs(file, nlines);
	
	logsRes.then(function(logsData) {
		var logs = "";
		
		logsData.forEach(function(log) {
			logs += log + "\n";
		});
		
		var resultDiv = document.getElementById('logsData');
		if (resultDiv != null) {
			resultDiv.innerHTML = hljs.highlight(logs, {language: 'accesslog'}).value;
		}
		$('#loader').hide();
	});
}

/**
 * Timer
 */
var currentFile = "";
var currentLines = 100;
var currentDelay = 0;
var timex = null;
 
function loop(LogsTailService) {
	loadLogFile(LogsTailService, currentFile, currentLines);	
}


function startTimer(LogsTailService, delay) {
	return setInterval(function () {loop(LogsTailService);}, delay);
}

function stopTimer() {
	clearInterval(timex);	
}
 

/**********************************************************************************************
 * 										Controllers
 **********************************************************************************************/

logsTailModule.controller('LogsTailController', function(LogsTailService, $q, $uibModal, $translate) {

    var me = this;
    
    $('#loader').hide();
    
    // Setup handlers
    $('#intervalCombobox').change(function () {
	    stopTimer();
	    
	    var val = $('#intervalCombobox option:selected')[0].value;
	    if(val != "0") {
			currentDelay = parseInt(val) * 1000;
			timex = startTimer(LogsTailService, currentDelay);
		}
	}).change();
	  
	$('#linesCombobox').change(function () {
	    var val = $('#linesCombobox option:selected')[0].value;
		currentLines = parseInt(val);
		loadLogFile(LogsTailService, currentFile, currentLines);
	}).change();  
	
	var context = document.querySelector(".context");
	var instance = new Mark(context);

	$("input[name='keyword']").on('input', function() {
	    var keyword = $("input[name='keyword']").val();
		var options = { 'element': 'span', 'className': 'mark'};
	    instance.unmark({
	      done: function() {
			regexp
			if($('#regexp').is(':checked')) {
				instance.markRegExp(keyword, options);
			} else {
				instance.mark(keyword, options);	
			}
	      }
	    });
	});
	  
	  
    // Start timer
    //timex = startTimer(LogsTailService, 5000);
    
    // Load logs files
    LogsTailService.getLogFiles().then(function(files) {
		var data = [];
		var counter = 0;
		
		files.forEach(function(e) {
			var fileName = e.split("/");
			fileName = fileName[fileName.length -1];
			data.push( {id: counter, text: fileName, data: e, a_attr: {title: e}} );
			counter += 1;	
		});

		$('#logsFilesTree')
			.on('changed.jstree', function (e, data) {
			    if(data.selected.length > 0) {
					var selected = data.instance.get_node(data.selected[0]);
					currentFile = selected.data;
					// Load the file
					loadLogFile(LogsTailService, currentFile, currentLines);
				}
			  })
		  	.jstree(
				{ 'core': 
		  			{ 
						'data' : data,
						'multiple' : false 
		  			}
	  		});
	});
	
});


/**********************************************************************************************
 * 										Services
 **********************************************************************************************/

/**
 * Service that handles functionality around logs.
 */
logsTailModule.service('LogsTailService', function($http) {

    return {
	
		/**
		 * Get log file data
		 */ 
        getLogs: function(filePath, lines) {
            var LOGSTAIL_URL = PluginHelper.getPluginRestUrl('logstail/logs');

            return $http.get(LOGSTAIL_URL, 
            			{ params: { 
							filePath: filePath, 
							lines: lines 
							}
						})
            	.then(function(response) {
                	return response.data.objects;
            	});
        },
        
        /**
         * Get log files
         */
        getLogFiles: function() {
			var LOGSTAIL_URL = PluginHelper.getPluginRestUrl('logstail/logfiles');

            return $http.get(LOGSTAIL_URL)
            	.then(function(response) {
                	return response.data.objects;
            	});
		}
    };

});

