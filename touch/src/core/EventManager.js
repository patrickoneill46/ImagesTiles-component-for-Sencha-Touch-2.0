/**
 * @class Ext.EventManager
 *
 * This object has been deprecated in Sencha Touch 2.0.0. Please refer to the method documentation for specific alternatives.
 *
 * @deprecated 2.0.0
 * @singleton
 * @private
 */

//<deprecated product=touch since=2.0>
Ext.ns('Ext.core');
Ext.core.EventManager =
Ext.EventManager = {
    /**
     * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
     * use {@link Ext.Element#addListener} directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el The html element or id to assign the event handler to.
     * @param {String} eventName The name of the event to listen for.
     * @param {Function} handler The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li>evt : EventObject<div class="sub-desc">The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li>t : Element<div class="sub-desc">The {@link Ext.Element Element} which was the target of the event.
     * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
     * @param {Object} options (optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
     * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
     * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
     * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
     * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
     * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
     * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
     * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
     * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
     * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
     * </ul><br>
     * <p>See {@link Ext.Element#addListener} for examples of how to use these options.</p>
     * @deprecated 2.0.0 Please use {@link Ext.dom.Element#addListener addListener} on an instance of Ext.Element instead.
     */
    addListener: function(element, eventName, fn, scope, options) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.addListener is deprecated, use addListener() directly from an instance of Ext.Element instead", 2);
        //</debug>
        element.on(eventName, fn, scope, options);
    },

    /**
     * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
     * you will use {@link Ext.Element#removeListener} directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el The id or html element from which to remove the listener.
     * @param {String} eventName The name of the event.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @deprecated 2.0.0 Please use {@link Ext.dom.Element#removeListener removeListener} on an instance of Ext.Element instead.
     */
    removeListener: function(element, eventName, fn, scope) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.removeListener is deprecated, use removeListener() directly from an instance of Ext.Element instead", 2);
        //</debug>
        element.un(eventName, fn, scope);
    },

    /**
     * Removes all event handers from an element.  Typically you will use {@link Ext.Element#clearListeners}
     * directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
     * @deprecated 2.0.0 Please use {@link Ext.dom.Element#clearListeners clearListeners} on an instance of Ext.Element instead.
     */
    removeAll: function(element){
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.removeAll is deprecated, use clearListeners() directly from an instance of Ext.Element instead", 3);
        //</debug>
        Ext.get(element).clearListeners();
    },

    /**
     * @removed 2.0.0 Please use {@link Ext#onReady onReady}
     */
    onDocumentReady: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.onDocumentReady has been removed, please use Ext.onReady instead", 3);
        //</debug>
    },

    /**
     * Adds a listener to be notified when the browser window is resized and provides resize event buffering (50 milliseconds),
     * passes new viewport width and height to handlers.
     * @param {Function} fn      The handler function the window resize event invokes.
     * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
     * @param {Boolean}  options Options object as passed to {@link Ext.Element#addListener}
     * @deprecated 2.0.0 Please listen to the {@link Ext.Viewport#event-resize resize} on Ext.Viewport instead.
     */
    onWindowResize: function(fn, scope, options) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.onWindowResize is deprecated, attach listener to Ext.Viewport instead, i.e: Ext.Viewport.on('resize', ...)", 2);
        //</debug>
        Ext.Viewport.on('resize', fn, scope, options);
    },

    onOrientationChange: function(fn, scope, options) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.onOrientationChange is deprecated, attach listener to Ext.Viewport instead, i.e: Ext.Viewport.on('orientationchange', ...)", 2);
        //</debug>
        Ext.Viewport.on('orientationchange', fn, scope, options);
    },

    unOrientationChange: function(fn, scope, options) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.EventManager.unOrientationChange is deprecated, remove listener from Ext.Viewport instead, i.e: Ext.Viewport.un('orientationchange', ...)", 2);
        //</debug>
        Ext.Viewport.un('orientationchange', fn, scope, options);
    }
};

/**
* Appends an event handler to an element.  Shorthand for {@link #addListener}.
* @param {String/HTMLElement} el The html element or id to assign the event handler to
* @param {String} eventName The name of the event to listen for.
* @param {Function} handler The handler function the event invokes.
* @param {Object} scope (optional) (<code>this</code> reference) in which the handler function executes. <b>Defaults to the Element</b>.
* @param {Object} options (optional) An object containing standard {@link #addListener} options
* @member Ext.EventManager
* @method on
* @deprecated 2.0.0 Please use {@link Ext.dom.Element#addListener addListener} on an instance of Ext.Element instead.
*/
Ext.EventManager.on = Ext.EventManager.addListener;

/**
 * Removes an event handler from an element.  Shorthand for {@link #removeListener}.
 * @param {String/HTMLElement} el The id or html element from which to remove the listener.
 * @param {String} eventName The name of the event.
 * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #on} call.</b>
 * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
 * then this must refer to the same object.
 * @member Ext.EventManager
 * @method un
 * @deprecated 2.0.0 Please use {@link Ext.dom.Element#removeListener removeListener} on an instance of Ext.Element instead.
 */
Ext.EventManager.un = Ext.EventManager.removeListener;
//</deprecated>
