/**
 * Created by sdiemert on 2016-08-19.
 */

class SVGFactory{

    /**
     * Creates an SVGFactory element that uses the Snap SVG
     * library to render items
     *
     * @param canvasId {string} - the DOM element ID of an SVG tag to render into (no #).
     */
    constructor(canvasId) {
        this._snap = Snap("#" + canvasId);
    }

}
