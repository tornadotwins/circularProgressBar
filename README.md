# circularProgressBar
Easy to use circular progress bar - draws dynamic SVGs
by Efraim Meulenberg

[HOSTED EXAMPLE](http://tornadotwins.com/github/circularProgressBar)

Requires jQuery

This progress bar allows you to draw a crystal clear svg-based circular progress bar using
only a few lines of js.

The following variables can be given (all optional) when creating a new instance:


    var b = new progressBar(
    { 
        color: "#98BFE0",                       //string: color of the bar: "white", "#ffffff"
        size: "400",                            //width and height of the bar in pixels (it's always square!)
        strokewidth: 15,                        //int: thickness of the bar in pixels
        progress: 0,                            //int: progress percentage it starts off with
        animationSpeed: 2,                      //float: speed in seconds that the bar animates when the values change. Default: 0.35
        id:"bleeh",                             //string: the ID you'd like to give the bar (if not specified, one will be generated)
        container: $('#progressbarContainer')   //Object that will hold the progress bar. The container can be a jQuery object, or a string used in a jQuery constructor.
    });


Almost all values can be updated dynamically after creation, with the exception of setting the container,
which can only be set in the constructor.


    b.setSize(500);                             //width and height of the bar in pixels (it's always square!)
    b.setColor('orange');                       //string: color of the bar: "white", "#ffffff"
    b.setStrokeWidth(5);                        //int: thickness of the bar in pixels
    b.setProgress(80);                          //int: progress percentage to animate towards
    b.setAnimationSpeed(0.35)                   //float: speed in seconds that the bar animates when the values change. Default: 0.35

    
Usage: first, create the progress bar as shown above, then use .setProgress(percentage); to animate it.