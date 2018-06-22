// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.MyCompany_DrawingPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.MyCompany_DrawingPlugin.prototype;
		
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
		if (this.is_family)
			return;
		
		this.texture_img = this.runtime.findWaitingTexture(this.texture_file);
		
		if (!this.texture_img)
		{
			this.texture_img = new Image();
			this.texture_img.cr_src = this.texture_file;
			this.texture_img.cr_filesize = this.texture_filesize;
			this.texture_img.c2webGL_texture = null;
			this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		}
		
		// Location of image on spritesheet
		this.spriteX = this.texture_data[3];
		this.spriteY = this.texture_data[4];
		this.spriteWidth = this.texture_data[5];
		this.spriteHeight = this.texture_data[6];
		
		// WebGL texture and location of image on spritesheet in texture co-ordinates
		this.webGL_texture = null;
		this.rcTex = new cr.rect(0, 0, 0, 0);
	};
	
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		this.webGL_texture = null;
	};
	
	typeProto.onRestoreWebGLContext = function ()
	{
		// No need to create textures if no instances exist, will create on demand
		if (this.is_family || !this.instances.length)
			return;
		
		if (!this.webGL_texture)
			this.doLoadTexture();
	};
	
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
			
		this.doLoadTexture();
	};
	
	typeProto.doLoadTexture = function ()
	{
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		var tw = this.texture_img.width;
		var th = this.texture_img.height;
		this.rcTex.set(this.spriteX / tw, this.spriteY / th, (this.spriteX + this.spriteWidth) / tw, (this.spriteY + this.spriteHeight) / th);
	};
	
	typeProto.unloadTextures = function ()
	{
		// Don't release textures if any instances still exist, they are probably using them
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// Initialise object properties
		this.testProperty = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function()
	{
		// Read properties set in C3
		this.testProperty = this.properties[0];
		
		if (this.runtime.glwrap)
		{
			// Create WebGL texture if type doesn't have it yet
			this.type.loadTextures();
		}
	};
	
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		
		var type = this.type;
		var curImage = type.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		
		// Object not rotated: can draw without transformation.
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			
			ctx.drawImage(curImage, type.spriteX, type.spriteY, type.spriteWidth, type.spriteHeight,
							 myx, myy, w, h);
		}
		else
		{
			// Only pixel round the x/y position, otherwise objects don't rotate smoothly
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			
			// Angle applied; we need to transform the canvas.  Save state.
			ctx.save();
			
			var widthfactor = w > 0 ? 1 : -1;
			var heightfactor = h > 0 ? 1 : -1;
			
			// Translate to object's position, then rotate by its angle.
			ctx.translate(myx, myy);
			
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);
			
			ctx.rotate(this.angle * widthfactor * heightfactor);
			
			var drawx = 0 - (this.hotspotX * Math.abs(w))
			var drawy = 0 - (this.hotspotY * Math.abs(h));
			
			// Draw the object; canvas origin is at hot spot.
			ctx.drawImage(curImage, type.spriteX, type.spriteY, type.spriteWidth, type.spriteHeight,
										 drawx, drawy, Math.abs(w), Math.abs(h));
			
			// Restore previous state.
			ctx.restore();
		}
	};
	
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.type.webGL_texture);
		glw.setOpacity(this.opacity);
		
		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, this.type.rcTex);
		}
		else
		{
			glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, this.type.rcTex);
		}
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
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
		alert("Test property = " + this.testProperty);
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