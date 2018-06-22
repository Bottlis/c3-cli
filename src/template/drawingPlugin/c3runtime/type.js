"use strict";

{
	C3.Plugins.MyCompany_DrawingPlugin.Type = class DrawingType extends C3.SDKTypeBase
	{
		constructor(objectClass)
		{
			super(objectClass);
		}
		
		Release()
		{
			super.Release();
		}
		
		OnCreate()
		{
			this.GetImageInfo().LoadAsset(this._runtime);
		}

		LoadTextures(renderer)
		{
			return this.GetImageInfo().LoadStaticTexture(renderer, {
				linearSampling: this._runtime.IsLinearSampling()
			});
		}

		ReleaseTextures()
		{
			this.GetImageInfo().ReleaseTexture();
		}
	};
}