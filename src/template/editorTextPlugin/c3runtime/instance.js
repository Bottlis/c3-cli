"use strict";

{
	// Temporary geometry objects used in rendering
	const tempRect = new C3.Rect();
	const tempQuad = new C3.Quad();
	
	C3.Plugins.MyCompany_TextPlugin.Instance = class MyTextInstance extends C3.SDKWorldInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			this._font = "Arial";
			this._text = "";
			
			// Lazy-created IWebGLText object
			this._webglText = null;
			
			if (properties)
			{
				this._font = properties[0];
				this._text = properties[1];
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		_MaybeCreateWebGLText(renderer)
		{
			// Lazy-create the WebGL text when drawn.
			if (this._webglText)
				return;		// already created
			
			// Create the WebGLText from the renderer.
			this._webglText = renderer.CreateWebGLText();
			this._webglText.SetFontSize(12);		// 12pt default size
			
			// In the runtime, make text update synchronously so it's always ready to draw.
			this._webglText.SetIsAsync(false);
		}
		
		Draw(renderer)
		{
			this._MaybeCreateWebGLText(renderer);
			
			const wi = this.GetWorldInfo();
			const layer = wi.GetLayer();
			const textZoom = layer.GetRenderScale();
			this._webglText.SetSize(wi.GetWidth(), wi.GetHeight(), textZoom);
			
			this._webglText.SetFontName(this._font);
			this._webglText.SetText(this._text);
			
			let quad = wi.GetBoundingQuad();
			const texture = this._webglText.GetTexture();
			
			if (!texture)
				return;
			
			// Pixel-snapping path for best quality. Transform the box co-ordinates in to render surface co-ordinates,
			// snap them to a device pixel, then render the texture in device co-ordinates.
			if (wi.GetAngle() === 0 && wi.GetLayer().GetAngle() === 0)
			{
				// The quad is unrotated, so we can convert it back to a rect using its top-left and bottom-right points.
				// Translate in to render surface co-ords and align it to the nearest pixel.
				const [dl, dt] = layer.LayerToDrawSurface(quad.getTlx(), quad.getTly());
				const [dr, db] = layer.LayerToDrawSurface(quad.getBrx(), quad.getBry());
				const offX = dl - Math.round(dl);
				const offY = dt - Math.round(dt);
				tempRect.set(dl, dt, dr, db);
				tempRect.offset(-offX, -offY);
				tempQuad.setFromRect(tempRect);
				
				// Switch in to device transform and render at device co-ordindates.
				this._runtime.GetCanvasManager().SetDeviceTransform(renderer);
				
				renderer.SetTexture(texture);
				renderer.Quad3(tempQuad, this._webglText.GetTexRect());
				
				// Restore layer's normal transform.
				layer._SetTransform(renderer);
			}
			else
			{
				// Normal rendering path, using world co-ordinates only.
				let offX = 0;
				let offY = 0;
				
				if (this._runtime.IsPixelRoundingEnabled())
				{
					offX = quad.getTlx() - Math.round(quad.getTlx());
					offY = quad.getTly() - Math.round(quad.getTly());
				}
				
				if (offX !== 0 || offY !== 0)
				{
					tempQuad.copy(quad);
					tempQuad.offset(-offX, -offY);
					quad = tempQuad;
				}
				
				renderer.SetTexture(texture);
				renderer.Quad3(quad, this._webglText.GetTexRect());
			}
		}
		
		SaveToJson()
		{
			return {
				"font": this._font,
				"text": this._text
			};
		}
		
		LoadFromJson(o)
		{
			this._font = o["font"];
			this._text = o["text"];
		}
	};
	
}