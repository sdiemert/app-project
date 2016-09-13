/**
 * Created by sdiemert on 2016-08-19.
 */

class Timeline{

    constructor(hours, events){
        this.hours = hours;
        this.events = events;
    }

}

class SliderTimeline extends Timeline{
    constructor(hours, events){
        super(hours, events);

        this.left = 0;
        this.right = hours; 
    }
}
