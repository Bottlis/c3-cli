// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.MyCompany_TextPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.MyCompany_TextPlugin.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// Initialise object properties
		this.font = "Arial";
		this.text = "";
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function()
	{
		// Read properties set in C3
		this.font = this.properties[0];
		this.text = this.properties[1];
	};
	
	instanceProto.draw = function(ctx)
	{
		// TODO (see C2's Text plugin for example code)
	};
	
	instanceProto.drawGL = function(glw)
	{
		// TODO (see C2's Text plugin for example code)
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {
			"font": this.font,
			"text": this.text
		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.font = o["font"];
		this.text = o["text"];
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsLargeNumber = function (number)
	{
		return number > 100;
	};
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Alert = function ()
	{
		alert("Hello world");
	};
	
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Double = function (ret, number)
	{
		ret.set_float(number * 2);
	};
	
	pluginProto.exps = new Exps();

}());