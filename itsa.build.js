/**
 * The Parcela module is an aggregator for all the individual modules that the library uses.
 * The developer is free to use it as it is or tailor it to contain whatever modules
 * he/she might need in the global namespace.
 *
 * The modules themselves work quite well independent of this module and can be used
 * separately without the need of them being integrated under one globa namespace.
 *
 * @module Parcela
*/
(function (window) {
    "use strict";
    /**
     * The Parcela class provides the core functionality for the Parcela library
     * and is the root namespace for all the additional modules.
     *
     * The Parcela class cannot be instantiated.
     * Instead, the Parcela function takes a configuration object to allow for tailoring of the library.
     * The Parcela function returns itself to allow for further chaining.
     *
     * Calling the Parcela function is optional. If the default configuration is acceptable,
     * the Parcela class can be used directly.
     *
     * The Parcela name is usually used only once in an application, when configuring it
     * and when calling the [`ready`](#method_ready) or [`require`](#method_require) methods.
     * The callback to these two methods provide a reference to Parcela itself as their argument.
     * These methods allow the developer to rename Parcela to a shorter name, usually `P`,
     * for use within the local scope.
     *
     *  Parcela( config )
     *      .require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *
     *  // If the default configuration is acceptable, you can simply do:
     *  Parcela.require('dialog', 'event', ...)
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *
     *  // If extra modules are to be loaded later, you can simply do:
     *  Parcela( config ).ready
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *
     *  // And if no configuration is needed:
     *  Parcela.ready
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *
     *
     *
     * @class Parcela
     * @static
     * @param config {Object} Configuration options for the Parcela Library
     * @return self {Object}
    */
    var Parcela = function (config) {
        var key;
        for (key in config) {
            Parcela._config[key] = config[key];
        }
        return Parcela;
    };
    /**
     * Global configuration properties for the Parcela object.
     * It can only be set on initialization via the [`Parcela`](#docs-main) function.
     *
     * The config is set at a default-configutation
     *
     * @property _config
     * @type Object
     * @private
    */
    Parcela._config = {
        debug: true,
        base: '/components'
    };
     var fakedom = window.navigator.userAgent==='fake',
         Event = fakedom ? require('event') : require('event-mobile')(window),
         io_config = {
             reqTimeout: 3000,
             debug: true,
             base: '/build'
         },
         EVENT_NAME_TIMERS_EXECUTION = 'timers:asyncfunc';

    require('event/event-emitter.js');
    require('event/event-listener.js');
    require('ypromise');
    require('promise-ext');
    require('lang-ext');
    //require('loader');

    /**
    Reference to the `idGenerator` function in [utils](../modules/utils.html)

    @property idGenerator
    @type function
    @static
    */
    /**
    Reference to the `typeOf` function in [utils](../modules/utils.html)

    @property typeOf
    @type function
    @static
    */
    Parcela.merge(require('utils'));


    /**
     * Reference to the [IO](io.html) object
     * @property IO
     * @type Object
     * @static
    */
    Parcela.IO = require('io')(window);
    Parcela.IO.config.merge(io_config);

    /**
     * [Event](Event.html)-instance
     * @property Event
     * @type Event
     * @static
    */
    Parcela.Event = Event;

    // Now we setup `_afterAsyncFn` --> the `timers` module uses this:
    // whenever `async() or `later() is called, it will invoke `_afterAsyncFn` if it is defined
    // By define it in a way that an event is emitted, we make sure the vDOM will be re-rendered.
    // this event cannot be prevented, halted or preventRendered --> if the user wants to prevent
    // vDOM-rendering, the last argument of `async9)` or `later()` should be used.
    Parcela.Event.defineEvent(EVENT_NAME_TIMERS_EXECUTION)
              .unHaltable()
              .unPreventable()
              .unRenderPreventable()
              .unSilencable();
    Parcela._afterAsyncFn = function() {
        console.log('[Parcela]: ', ' emitting '+EVENT_NAME_TIMERS_EXECUTION+' through Parcela._afterAsyncFn()');
        // emittng a `dummy`-event which will re-render the dDOM:
        Parcela.Event.emit(EVENT_NAME_TIMERS_EXECUTION);
    };

    /**
    Reference to the [Parcel](Parcel.html) static class

    @property Parcel
    @type Parcel
    @static
    */
    Parcela.Parcel = require('parcel');
    Parcela.ParcelEv = require('parcel/events.js')(window);

    var vdom = require('virtual-dom')(window);
    /**
    Reference to the virtual DOM [render](vDOM.html#method_render) method

    @property render
    @type Function
    @static
    */
    Parcela.render = vdom.render;
    Parcela.rootApp = vdom.rootApp;
    Parcela.Parcel.vNode = vdom.vNode;

    /**
    Reference to the [routing module](Router.html).

    @property Router
    @type Function
    @static
    */
    Parcela.Router = require('routing')(window);


    module.exports = Parcela;

    var INIT_TIMEOUT = 3000, // timeout within Parcela.ready ought to be finished
        INIT_TIMEOUT_MSG = 'Initialisation timeout';



    /**
     * Returns a promise when the DOM and Parcela library are ready.
     *
     * The callback receives a copy of `Parcela` as its only argument so that the developer can use a shorter name within the application.
     * It is often called simply `P`.
     *
     * Calling the Parcela function is optional. If the default configuration is acceptable,
     * the Parcela class can be used directly.
     *
     * @example
     *  <script>
     *      Parcela.ready
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *  </script>
     *
     * @example
     *  <script>
     *      Parcela({base: '/build'}).ready
     *      .then(function (P) {
     *          // P is an alias of Parcela
     *      });
     *  </script>
     *
     * @property ready
     * @type Promise
    */
    Parcela.ready = function (fn) {
        var initpromise;
        if (Parcela._ready) {
            return Parcela._ready;
        }
        initpromise = new Promise(function (resolve, reject) {
            var promisehash = [];
            // when not initialized within timeout, reject (which can be called allways: resolved promises don't change state)
            setTimeout(function() {reject(INIT_TIMEOUT_MSG);}, INIT_TIMEOUT);
            // do the initializationstuff here, when ready, invoke resolve(P);
            // every async-action can be placed inside 'promisehash'
            Promise.all(promisehash).then(
                function() {
                    resolve(Parcela);
                },
                function(err) {
                    reject(err);
                }
            );
        });
        if (typeof fn === 'function') {
            Parcela._ready = initpromise
                .then(function (P) {
                    return fn(P);
                });
        }
        else {
            Parcela._ready = initpromise;
        }
        return Parcela._ready;
    };

})(global.window || require('fake-dom'));
