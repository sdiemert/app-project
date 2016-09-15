/**
 * Created by sdiemert on 2016-08-18.
 *
 * A number of helper functions for working with SVG.
 *
 * Uses the SNAP SVG JS Library.
 */

class SVGTimelineFactory extends SVGFactory{

    /**
     * Creates a factory object that will render timelines to the specified SVG element.
     *
     * @param canvas {string} the identifier of the SVG DOM element to draw onto (no #).
     * @param xOffset {number} number of pixels to x-offset the timeline by.
     * @param yOffset {number} number of pixels to y-offset the timeline by.
     * @param timelineSize {number} number of pixels in timeline length
     * @param tickInterval {number} number of hours between timeline ticks.
     * @param hours {number} the number of hours in the timeline
     */
    constructor(canvas, xOffset, yOffset, timelineSize, tickInterval, hours){
        super(canvas);

        this._xOffset = xOffset || 50;
        this._yOffset = yOffset || 50;
        this._size = timelineSize || 700;
        this._interval = tickInterval || 4;
        this._hours = hours || 24;
    }

    /**
     * Draws an SVG timeline axis
     * @param timeline {Timeline} the timeline to draw.
     */
    drawTimelineAxis(timeline){

        var hours = this._hours;
        var TICK_SPACING = this._size/ hours;
        var TICK_HEIGHT = 5;

        // x1, y1, x2, y2
        var backbone = this._snap.line(this._xOffset, this._yOffset, this._xOffset + this._size, this._yOffset)
                           .attr({stroke : "#000000"});

        var g = this._snap.group(backbone);

        // draw ticks
        for(var i = 0; i < hours; i = i + this._interval){

            var tmpX = this._xOffset + i*TICK_SPACING;

            var tickGroup = this._snap.group();

            tickGroup.add(
                this._snap.line(tmpX, this._yOffset - TICK_HEIGHT, tmpX, this._yOffset + TICK_HEIGHT)
                    .attr({stroke : "#000000"})
            );

            tickGroup.add(this._snap.text(tmpX - 20, this._yOffset+TICK_HEIGHT*4, i+":00"));

            g.add(tickGroup);
        }

        // Add last tick.
        var tickGroup = this._snap.group();

        tickGroup.add(
            this._snap.line(this._size + this._xOffset, this._yOffset - TICK_HEIGHT, this._size + this._xOffset, this._yOffset + TICK_HEIGHT)
                .attr({stroke : "#000000"})
        );

        tickGroup.add(this._snap.text(this._size + this._xOffset - 20, this._yOffset+TICK_HEIGHT*4, hours+":00"));

    };

    /**
     * Converts an floating point hour number to the appropriate time (HH:MM).
     * e.g. 12.5 => 12:30
     * @param f {number} a floating point hour value.
     *
     * @return {string} - the time as a string (HH:MM)
     */
    hourFloatToTime(f){
        var hours = Math.floor(f);
        var mins = Math.floor((f - hours)*60);

        return (hours < 10 ? "0"+hours : hours)
            +":"
            +(mins < 10 ? "0"+mins : mins);
    }

    hourToPixelPosition(t, size, offset, hours){
        var h = t/hours;
        return h * size  + offset;
    }

    pixelsToHours(p, size, offset, hours){
        var h = ((p-offset)/size)*hours;
        // rounds to nearest quater of an hour.
        return Math.round(h/0.25)*0.25;
    }

    /**
     * Based on event time, draw the event indicator on the SVG object.
     * Scale time to the length of the timeline.
     * @param event {Event} the event to render to the screen.
     */
    renderEvent(event){

        var RAD = 5;
        var LABEL_UP = 40;
        var LABEL_W = 50;
        var LABEL_H = 33;

        var x = this.hourToPixelPosition(event.time, this._size, this._xOffset, this._hours);
        var y = this._yOffset;

        this._snap.circle(x, y, RAD);

        var labelGroup = this._snap.group();

        labelGroup.add(
            this._snap.line(x,y, x, y - LABEL_UP)
                      .attr({stroke :"#000000", fill:"none"})
        );

        labelGroup.add(
            this._snap.rect(x-5, y - LABEL_UP - LABEL_H, LABEL_W, LABEL_H, 5, 5)
                      .attr({stroke:"#000", fill:"none"})
        );

        labelGroup.add(
            this._snap.text(x, y - LABEL_UP - 20, this.hourFloatToTime(event.time))
                      .attr({"font-size" : 10})
        );

        labelGroup.add(
            this._snap.text(x, y - LABEL_UP - 5, event.dose)
                .attr({"font-size" : 10})
        );

    };

    drawSliders(timeline){

        var SLIDER_W = 12;
        var SLIDER_H = 30;

        var LEFT_SLIDER_FILL = "#01DF3A";
        var LEFT_SLIDER_STROKE = "#80ef9c";
        var RIGHT_SLIDER_FILL = "#FF0000";
        var RIGHT_SLIDER_STROKE = "#F78181";
        var RANGE_FILL = "#A9D0F5";
        var RANGE_FILL_ACTIVE = "#7bb7f0";

        var leftSliderPos = this.hourToPixelPosition(timeline.left, this._size, this._xOffset, this._hours) - SLIDER_W/2;
        var rightSliderPos = this.hourToPixelPosition(timeline.right, this._size, this._xOffset, this._hours) - SLIDER_W/2;

        var sliderGroup = this._snap.group();

        var rangeGhost = this._snap.rect(leftSliderPos + SLIDER_W, this._yOffset - SLIDER_H/8, rightSliderPos - leftSliderPos - SLIDER_W, SLIDER_H/4)
            .attr({fill : RANGE_FILL, "fill-opacity" : 0.65});

        var leftSlider = this._snap.rect(leftSliderPos , this._yOffset - SLIDER_H/2 + 7, SLIDER_W, SLIDER_H, 5,5)
            .attr({fill : LEFT_SLIDER_FILL, stroke : LEFT_SLIDER_STROKE});

        var rightSlider = this._snap.rect(rightSliderPos , this._yOffset - SLIDER_H/2 - 7, SLIDER_W, SLIDER_H, 5,5)
            .attr({fill :  RIGHT_SLIDER_FILL, stroke : RIGHT_SLIDER_STROKE});

        var leftSliderLabel = this._snap.text(leftSliderPos - SLIDER_W/2, this._yOffset + 35, this.hourFloatToTime(timeline.left))
            .attr({"font-size" : 12, "display" : "none"});

        var rightSliderLabel = this._snap.text(rightSliderPos - SLIDER_W/2, this._yOffset + 35, this.hourFloatToTime(timeline.right))
            .attr({"font-size" : 12, "display" : "none"});


        sliderGroup.add(rangeGhost, leftSlider, rightSlider, leftSliderLabel, rightSliderLabel);

        var that = this;

        var svgLeft = $("#svg").position().left;

        var mDownFuncLeft = function(x,y,e){
            leftSliderLabel.attr({"display" : "block"});
            rangeGhost.attr({"fill" : RANGE_FILL_ACTIVE});
            this.attr({"fill" : LEFT_SLIDER_STROKE});
        };

        var mDownFuncRight = function(x,y,e){
            rightSliderLabel.attr({"display" : "block"});
            rangeGhost.attr({"fill" : RANGE_FILL_ACTIVE});
            this.attr({"fill" : RIGHT_SLIDER_STROKE});
        };

        var moveFuncLeftSlider = function(dx, dy, x, y){

            var dest = x - svgLeft;

            var rsx = rightSlider.getBBox().x;

            if(
                x >= (svgLeft + that._xOffset - SLIDER_W/2) &&
                dest <= rsx &&
                dest >= 0
            ) {
                this.attr({x: dest});
                rangeGhost.attr({
                    x: dest,
                    width: rsx - dest
                });
                timeline.left = that.pixelsToHours(dest + SLIDER_W/2, that._size, that._xOffset, that._hours);
                leftSliderLabel.attr({x : dest - SLIDER_W/2, text : that.hourFloatToTime(timeline.left)});
            }

        };

        var moveFuncRightSlider = function(dx, dy, x, y){

            var dest = x - svgLeft;
            var lsx = leftSlider.getBBox().x;

            if(
                x <= svgLeft + that._size + that._xOffset &&
                dest >= lsx &&
                dest >= 0
            ){
                this.attr({x :  dest});
                rangeGhost.attr({
                    width : (x - svgLeft) - lsx
                });
                timeline.right = that.pixelsToHours(dest + SLIDER_W/2, that._size, that._xOffset, that._hours);
                rightSliderLabel.attr({x : dest - SLIDER_W/2, text : that.hourFloatToTime(timeline.right)});
            }
        };

        var mUpFuncLeft = function(x,y,e){
            leftSliderLabel.attr({"display" : "none"});
            rangeGhost.attr({"fill" : RANGE_FILL});
            this.attr({"fill" : LEFT_SLIDER_FILL})
        };

        var mUpFuncRight = function(x,y,e){
            rightSliderLabel.attr({"display" : "none"});
            rangeGhost.attr({"fill" : RANGE_FILL});
            this.attr({"fill" : RIGHT_SLIDER_FILL});
        };

        leftSlider.drag(moveFuncLeftSlider, mDownFuncLeft, mUpFuncLeft);
        rightSlider.drag(moveFuncRightSlider, mDownFuncRight, mUpFuncRight);

        leftSlider.mouseover = function(){};
        leftSlider.mouseout = function(){;};

    };


    /**
     * Renders a timeline and associated event objects to the svg
     * element in the browser (via the snap svg object).
     *
     * @param timeline {Timeline}
     */
    renderTimeline(timeline){

        if(this._hours !== timeline.hours){
            console.log("timeline hour and factory hours mismatch! Using timeline hours");
            this._hours = timeline.hours;
        }

        this.drawTimelineAxis(timeline);

        for(var i = 0; i < timeline.events.length; i++){
            this.renderEvent(timeline.events[i]);
        }

        this.drawSliders(timeline);

    }

}
