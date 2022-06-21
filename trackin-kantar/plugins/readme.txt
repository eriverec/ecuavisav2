SpringStreams JavaScript streaming measurement library plug-ins

This release is targeted on JavaScript-based platforms which don't fully support native javascript APIs. Some functions have to be overwritten, such as the implementation of localstorage, image loader and Dom documentation. 

How to use the plug-ins:
 
Smart TV, TAL-Framework:
	1. Please import both springstreams.js and corresponding plug-ins into the project.
	2. Create a pageContext object like this: var pageContext_springstreams = new PageContext(application). 'application' here is the application object in TAL-Framework, please read more in springstreams_TAL_attachment.js file.
	3. Initialize the SpringStreams object and call SpringStreams.setPageContext(pageContext_springstreams) function to set the page context.

PlayStation WebMAF:
	1. Please import both springstreams.js and corresponding plug-ins into the project.
	2. Create a pageContext object like this: var pageContext_springstreams = new PageContext();
	3. Call the pageContext_springstreams.setDeviceID(deviceID) function to set PlayStation ID. More info can be found in the springstreams_WebMAF_attachment.js file. 
    4. Initialize the SpringStreams object and call SpringStreams.setPageContext(pageContext_springstreams) function to set the page context.

General Template, customize your own plug-in:
 	1. Implement the springstreams_General_attachment.js functions, more descriptions can be found in the springstreams_General_attachment.js.
 	2. Import both springstreams.js and plug-in into the project.
	3. Create a pageContext object like this: var pageContext_springstreams = new PageContext(). 
	4. Initialize the SpringStreams object and call SpringStreams.setPageContext(pageContext_springstreams) function to set the page context.

The rest of the implementation is kept in the same way as for the springstreams library, please read the documentation (https://kantarmedia.atlassian.net/wiki/spaces/public/pages/159726917/Implementation+of+Stream+Measurement).


