# Connect IQ | Garmin Code Builder
###Build script for building and deploying ConnectIQ apps from [Visual Studio Code](https://code.visualstudio.com/). 
Can be adapted for other IDE's

## I was tired of using Eclipse to build my ConnectIQ apps
I decided to experiment a bit. 
Naming the extensions of the .mc files fools the IDE into thinking the file is a C# file (would work with .java as well)
Next I wanted to build and deploy from within [Visual Studio Code](https://code.visualstudio.com/) so I went about looking for a way.
The debugging section will serve my purposes nicely as it will allow execution of a nodejs script and node has nice io functions.

The following is a new project structure, a sample app, and 2 methods of building. a deploy to your device and a launch in simulator. 

The build.js file along with the package.json file needs to live in *"your project folder/build/"*

```
Navigate to "your project folder/build/" and do an npm install
```

Your watch app needs to live in *"your project folder/src/"*

To see this in action:
- Load up this entire repo inside Visual Studio Code via the *"Open folder"* menu option.
- Navigate to the debug menu on the left bottom of the toolbar.
- Select either deploy or simulator from the debug selector at the top.
- Click the green play button.

Execution will stop at the top of your build script.

- You can either step through the steps from here
- or
- Add a breakpoint at line 137 and hit play to run through to completion.

This breakpoint will allow you to view the console window and the results of the build.

