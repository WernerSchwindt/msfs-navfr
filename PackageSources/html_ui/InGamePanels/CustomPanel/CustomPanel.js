class IngamePanelCustomPanel extends TemplateElement {
    constructor() {
        super(...arguments);
		
        this.started = false;
        this.ingameUi = null;
		this.interval = null;
		this.lat = null;
		this.lon = null;
		
		this.initialize();
    }

    connectedCallback() 
	{
        super.connectedCallback();

        var self = this;
        this.ingameUi = this.querySelector('ingame-ui');

        this.iframeElement = document.getElementById("CustomPanelIframe");

        this.m_MainDisplay = document.querySelector("#MainDisplay");
        this.m_MainDisplay.classList.add("hidden");

        this.m_Footer = document.querySelector("#Footer");
        this.m_Footer.classList.add("hidden");
		
		self.interval = setInterval(function() {
			this.lat = SimVar.GetSimVarValue("GPS POSITION LAT", "Degrees");
			this.lon = SimVar.GetSimVarValue("GPS POSITION LON", "Degrees");
			
			if(this.lat && this.lon)
			{
				if(self.iframeElement)
				{
					self.iframeElement.contentWindow.postMessage([this.lon, this.lat] , "https://server.eldercodes.net");
				}
			}
			
		}, 1000);

        if (this.ingameUi) 
		{
            this.ingameUi.addEventListener("panelActive", (e) => {
				
                if (self.iframeElement) 
				{
                    self.iframeElement.src = 'https://server.eldercodes.net/navfr?sim=true';
                }
            });
            this.ingameUi.addEventListener("panelInactive", (e) => {
				
                if (self.iframeElement) 
				{
                    self.iframeElement.src = '';
                }
            });
            this.ingameUi.addEventListener("onResizeElement", () => {
            });
            this.ingameUi.addEventListener("dblclick", () => {
                if (self.m_Footer) 
				{
                    self.m_Footer.classList.remove("hidden");
                }
			});
        }
    }
	
    initialize() 
	{
        if (this.started) 
		{
            return;
        }
		
        this.started = true;
    }
	
    disconnectedCallback() 
	{
		clearInterval(self.interval);
        super.disconnectedCallback();		
    }
	
    updateImage() 
	{
    }
}

window.customElements.define("ingamepanel-custom", IngamePanelCustomPanel);
checkAutoload();