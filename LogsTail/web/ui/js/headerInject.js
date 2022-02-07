//<script src="ui/js/jquery.min.js"></script>

/*

Other available values to build paths, etc. that are obtained from the server and set in the PluginFramework JS object

PluginFramework.PluginBaseEndpointName = '#{pluginFramework.basePluginEndpointName}';
PluginFramework.PluginEndpointRoot = '#{pluginFramework.basePluginEndpointName}/#{pluginFramework.basePluginEndpointName}';
PluginFramework.PluginFolderName = '#{pluginFramework.pluginFolderName}';
PluginFramework.CurrentPluginUniqueName = '#{pluginFramework.uniqueName}';
PluginFramework.CsrfToken = Ext.util.Cookies.get('CSRF-TOKEN');

 */


var jQueryClone = jQuery;
var statusClass = '';
var CsrfToken = Ext.util.Cookies.get('CSRF-TOKEN');
var authRequirements = null;
var lastTimeStamp = null;


function goLogsTail() {
	window.location = SailPoint.CONTEXT_PATH + "/plugins/pluginPage.jsf?pn=LogsTail";	
}


jQuery(document).ready(function(){
	
	var menuItem = 	'<li class="dropdown">' +
		'	<a href="javascript:goLogsTail()" tabindex="0" role="menuitem" data-snippet-debug="off">' +
		'		<i id="LogsTailPluginIcon" role="presenation" class="fa fa-file-text fa-lg ' + statusClass + '"></i>' +
		'	</a>' +
		'</li>';

	jQuery("ul.navbar-right li:first").before(menuItem);
	
});
