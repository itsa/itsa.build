/**
 * The ITSA module is an aggregator for all the individual modules that the library uses.
 * The developer is free to use it as it is or tailor it to contain whatever modules
 * he/she might need in the global namespace.
 *
 * The modules themselves work quite well independent of this module and can be used
 * separately without the need of them being integrated under one globa namespace.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module itsa.build
 *
*/
(function (window) {

    "use strict";

    /**
     * The ITSA class provides the core functionality for the ITSA library
     * and is the root namespace for all the additional modules.
     *
     * The ITSA class cannot be instantiated.
     * Instead, the ITSA function takes a configuration object to allow for tailoring of the library.
     * The ITSA function returns itself to allow for further chaining.
     *
     * Calling the ITSA function is optional. If the default configuration is acceptable,
     * the ITSA class can be used directly.
     *
     * The ITSA name is usually used only once in an application, when configuring it
     * and when calling the [`ready`](#method_ready) or [`require`](#method_require) methods.
     * The callback to these two methods provide a reference to ITSA itself as their argument.
     * These methods allow the developer to rename ITSA to a shorter name, usually `P`,
     * for use within the local scope.
     *
     *  ITSA( config )
     *      .require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // If the default configuration is acceptable, you can simply do:
     *  ITSA.require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // If extra modules are to be loaded later, you can simply do:
     *  ITSA( config ).ready
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *  // And if no configuration is needed:
     *  ITSA.ready
     *      .then(function (P) {
     *          // P is an alias of ITSA
     *      });
     *
     *
     *
     * @class ITSA
     * @static
     * @param config {Object} Configuration options for the ITSA Library
     * @return self {Object}
    */

    require('css');
    require('polyfill/polyfill.js'); // want the full version

    var jsExt = require('js-ext/js-ext.js'), // want the full version: include it at the top, so that object.merge is available
        createHashMap = require('js-ext/extra/hashmap.js').createMap;

    window._ITSAmodules || Object.protectedProp(window, '_ITSAmodules', createHashMap());
/*jshint boss:true */
    if (window._ITSAmodules.ITSA) {
/*jshint boss:false */
        return window._ITSAmodules.ITSA; // ITSA was already created
    }

    var ITSA = function (config) {
        ITSA._config.merge(config, {force: true});
        return ITSA;
    };
    /**
     * Global configuration properties for the ITSA object.
     * It can only be set on initialization via the [`ITSA`](#docs-main) function.
     *
     * The config is set at a default-configutation
     *
     * @property _config
     * @type Object
     * @private
    */
    ITSA._config = {
        debug: true,
        base: '/components'
    };

    /**
     * Reference to `Classes` in [js-ext/extra/classes.js](../modules/js-ext.html)
     *
     * @property Classes
     * @type Object
     * @static
    */

    /**
     * Reference to the `LightMap`-Class in [js-ext/extra/lightmap.js](../modules/js-ext.html)
     *
     * @property LightMap
     * @type Class
     * @static
    */

    /**
     * Reference to the `createHashMap` function in [js-ext/extra/hashmap.js](../modules/js-ext.html)
     *
     * @property createHashMap
     * @type function
     * @static
    */

    // Note: we can only merge them after je-ext is required --> ITSA.merge is only then available
    ITSA.merge(jsExt);
    require('window-ext')(window);

    var fakedom = window.navigator.userAgent==='fake',
        Event = fakedom ? require('event') : require('event-mobile')(window),
        io_config = {
            // timeout: 3000,
            debug: true,
            base: '/build'
        },
        dragdrop;

    require('vdom')(window);
    require('icons')(window);

    /**
     * Reference to the `idGenerator` function in [utils](../modules/utils.html)
     *
     * @property idGenerator
     * @type function
     * @static
    */
    require('node-plugin')(window);
    require('constrain')(window);
    require('panel')(window);

    ITSA.merge(require('utils'));
    ITSA.RESERVED_WORDS = require('js-ext/extra/reserved-words.js');

    if (!fakedom) {
        require('event-dom/extra/hover.js')(window);
        require('event-dom/extra/valuechange.js')(window);
        require('event-dom/extra/blurnode.js')(window);
        require('event-dom/extra/focusnode.js')(window);
        // setup dragdrop:
        dragdrop = require('drag-drop')(window);
        ITSA.DD = dragdrop;
        ITSA.DD.init();
        require('focusmanager')(window);
    }

    ITSA.merge(require('messages'));
    require('dialog')(window);
    require('scrollable')(window);

    /**
     * Reference to the [IO](io.html) object
     * @property IO
     * @type Object
     * @static
    */
    ITSA.IO = require('io/extra/io-transfer.js')(window);
    ITSA.IO.config.merge(io_config);
    require('io/extra/io-cors-ie9.js')(window);
    require('io/extra/io-stream.js')(window);
    require('io/extra/io-xml.js')(window);

    /**
     * Reference to the [UserAgent](useragent.html) object
     * @property UA
     * @type Object
     * @static
    */
    ITSA.UA = require('useragent')(window);

    /**
     * [Event](Event.html)-instance
     * @property Event
     * @type Event
     * @static
    */
    ITSA.Event = Event;

    window._ITSAmodules.ITSA = ITSA;

    module.exports = ITSA;

})(global.window || require('node-win'));
