/**
 * Created by sdiemert on 2016-08-19.
 */

class Timeline{

    constructor(hours, events, rxString, description){
        this.hours = hours;
        this.events = events;
        this.description = description || null;
        this.rx = rxString || null;
    }

}

class SliderTimeline extends Timeline{
    constructor(hours, events, rx, description, int){
        super(hours, events, rx, description);

        this.left = 0;
        this.right = hours;
        this.interval = int || 12;
    }
}
