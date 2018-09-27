/*
(circular) progressBar Class
by Efraim Meulenberg

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

*/

function progressBar (options = {})
{
    this.constructor = function(options)
    {
        //if the constructor gave us values, assign them
        if(options.size)            { this.setSize(options.size);                       }
        if(options.strokewidth)     { this.setStrokeWidth(options.strokewidth);         }
        if(options.color)           { this.setColor(options.color);                     }
        if(options.container)       { this.setContainer(options.container);             }
        if(options.progress)        { this.currentPercent = Number(options.progress);   }
        if(options.animationSpeed)  { this.setAnimationSpeed(options.animationSpeed);   }
        if(options.id)              { this.setId( options.id );                         }

        this.addProgressBar();
    };

    //set the size of the progressBar to x pixels high and wide
    this.size = 220;
    this.setSize = function (size)
    {
        this.size = Number(size);

        //if the bar is already created
        if(this.circle instanceof jQuery && this.node instanceof jQuery)
        {
            //update the size
            this.updateSize(this.size, this.strokeWidth);
        }
    };

    //set the thickness of the progress bar
    this.strokeWidth = 4;
    this.setStrokeWidth = function (w)
    {
        this.strokeWidth = Number(w);

        //if the bar is already created
        if(this.circle instanceof jQuery && this.node instanceof jQuery)
        {
            //update the size
            this.updateSize(this.size, this.strokeWidth);
        }
    };

    //set the color of the progress bar
    this.color = "gray";
    this.setColor = function (color)
    {
        if(this.isString(color))
        {
            this.color=color;

            if(this.node && this.circle)
            {
                this.circle.attr('stroke', this.color);
            }
        }
    };

    //The container is the jQuery element referecing the DOM container that holds the progressbar
    //This cannot be changed after the progress bar is created, constructor only
    this.container = false;
    this.setContainer = function(container)
    {
        //if we're given a jQuery object
        if(container instanceof jQuery) 
        { 
            //assign it
            this.container = container; 
        }
        //if we're given a string
        else if(this.isString(container))
        {
            //check if it can find it as DOM element using jQuery
            if($(container).length)
            {
                //assign it as jQuery object
                this.container = $(container);
            }
        }
    };

    //define the container/holder of the notifications, or use the document body
    this.findContainer = function()
    {
        //if we don't have a container that holds the progressbar
        if(!this.container)
        {
            //look to see if the default container is there
            if($('#progressbarContainer').length)
            {
                this.container = $('#progressbarContainer');
            }
            else
            {
                //and if it isn't, just add the progressbar to the body
                this.container = $('body');
            }
        }
    }

    this.animationSpeed = 0.35;
    this.setAnimationSpeed = function(s)
    {
        this.animationSpeed = parseFloat(s);
        console.log(this.animationSpeed);

        //if this thing is a thing, change the speed of the thing
        if(this.circle instanceof jQuery)
        {
            this.circle.css('transition', 'stroke-dashoffset '+this.animationSpeed+'s ease 0s');
        }
    }

    //scale the whole thing up (can be called dynamically)
    this.doScale = function (size=null, strokewidth=null)
    {
        if(size)        { this.setSize(size);               }
        if(strokewidth) { this.setStrokeWidth(strokewidth); }

        //scale the objects
        this.updateSize(this.size, this.strokeWidth);
        this.setProgress(this.currentPercent);
    };

    this.id = null;
    this.setId = function (id)
    {
        if(this.isString(id))
        {
            this.id = id;
        }
    };

    this.node = null;
    this.circle = null;
    this.radius = null;
    this.circumference = null;
    this.currentPercent = 0;
    this.addProgressBar = function()
    {
        //don't continue w/o having a container defined
        this.findContainer();

        //don't continue without having an id defined
        if(!this.id)
        {
            this.id = this.generateRandomId();
        }

        /*
        This is what we want in the dom:

        <svg
            id="progressbar1"
            class="progress-ring"
            width="220"
            height="220">
            <circle
                class="progress-ring__circle"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
                fill="transparent"
                r="102"
                cx="110"
                cy="110"/>
        </svg>
        */
        
        //create the circle using makeSVG
        var circle = this.makeSVG('circle', 
            {
                id: this.id+"_circle",
                //transition animation and axis compensation
                style: "transition: "+this.animationSpeed+"s stroke-dashoffset; transform: rotate(-90deg); transform-origin: 50% 50%;", 
                cx: 110, 
                cy: 110, 
                r: 102, 
                stroke: this.color, 
                'stroke-width': this.strokeWidth,
                'stroke-linecap': 'round', 
                fill: 'transparent'
            });
        
        //create the circle's <svg> container using makeSVG
        var node = this.makeSVG('svg', 
            {
                id: this.id,
                class: "progress-ring",
                width: this.size,
                height: this.size
            });

        //shove them into eachother (pen-pineapple-apple-pen anyone?)
        this.container[0].appendChild(node).appendChild(circle);

        //store a reference to them
        this.circle=$('#'+this.id+'_circle');
        this.node=$('#'+this.id);

        //set things in motion by sizing the progressbar, which also sets progress 
        this.updateSize(this.size, this.strokeWidth);
    };

    this.updateSize = function(size, strokewidth)
    {
        this.node[0].setAttribute("width", size);
        this.node[0].setAttribute("height", size);
        this.circle.attr("stroke-width", strokewidth);
        this.circle.attr("cx", size/2);
        this.circle.attr("cy", size/2);
        this.circle.attr("r", (size/2) - (strokewidth * 2) );

        this.radius = this.circle.attr('r'); //this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;

        this.circle.css( 'stroke-dasharray', `${this.circumference} ${this.circumference}` );
        this.circle.css( 'stroke-dashoffset', `${this.circumference}` );

        this.setProgress(this.currentPercent);
    };

    this.setProgress = function (percent)
    {
        const offset = this.circumference - percent / 100 * this.circumference;
        this.circle.css('stroke-dashoffset' , offset);
        this.currentPercent = percent;
    };

    //jquery can't properly parse SVG xml content nor add it to the dom,
    //because the browser will see it as a DOM element using .innerHTML, 
    //which doesn't exist for SVG. So this is a workaround to dynamically  
    //create elements as SVG instead.
    this.makeSVG = function(tag, attrs) 
    {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
        {
            el.setAttribute(k, attrs[k]);
        }
        return el;
    };

    //Generate a random 7-character string that we can use as ID
    //in case one isn't provided
    this.generateRandomId = function()
    {
        return Math.random().toString(36).substring(7);
    };

    /*
    Janitor functions
    */
    this.isString = function(s) 
    {
        return Object.prototype.toString.call(s) === "[object String]";
    };

    //call the constructor last
    this.constructor(options);
}