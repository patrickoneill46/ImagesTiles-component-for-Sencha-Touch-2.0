/**
 * Ext.Direct aims to streamline communication between the client and server by providing a single interface that
 * reduces the amount of common code typically required to validate data and handle returned data packets (reading data,
 * error conditions, etc).
 *
 * The Ext.direct namespace includes several classes for a closer integration with the server-side. The Ext.data
 * namespace also includes classes for working with Ext.data.Stores which are backed by data from an Ext.Direct method.
 *
 * # Specification
 *
 * For additional information consult the [Ext.Direct Specification][1].
 *
 * # Providers
 *
 * Ext.Direct uses a provider architecture, where one or more providers are used to transport data to and from the
 * server. There are several providers that exist in the core at the moment:
 *
 * - {@link Ext.direct.JsonProvider JsonProvider} for simple JSON operations
 * - {@link Ext.direct.PollingProvider PollingProvider} for repeated requests
 * - {@link Ext.direct.RemotingProvider RemotingProvider} exposes server side on the client.
 *
 * A provider does not need to be invoked directly, providers are added via {@link Ext.direct.Manager}.{@link #addProvider}.
 *
 * # Router
 *
 * Ext.Direct utilizes a "router" on the server to direct requests from the client to the appropriate server-side
 * method. Because the Ext.Direct API is completely platform-agnostic, you could completely swap out a Java based server
 * solution and replace it with one that uses C# without changing the client side JavaScript at all.
 *
 * # Server side events
 *
 * Custom events from the server may be handled by the client by adding listeners, for example:
 *
 *     {"type":"event","name":"message","data":"Successfully polled at: 11:19:30 am"}
 *
 *     // add a handler for a 'message' event sent by the server
 *     Ext.direct.Manager.on('message', function(e){
 *         out.append(String.format('<p><i>{0}</i></p>', e.data));
 *         out.el.scrollTo('t', 100000, true);
 *     });
 *
 *    [1]: http://sencha.com/products/extjs/extdirect
 *
 * @singleton
 * @alternateClassName Ext.Direct
 */
Ext.define('Ext.direct.Manager', {
    singleton: true,

    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: ['Ext.util.Collection'],

    alternateClassName: 'Ext.Direct',

    statics: {
        exceptions: {
            TRANSPORT: 'xhr',
            PARSE: 'parse',
            LOGIN: 'login',
            SERVER: 'exception'
        }
    },

    /**
     * @event event
     * Fires after an event.
     * @param {Ext.direct.Event} e The Ext.direct.Event type that occurred.
     * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
     */

    /**
     * @event exception
     * Fires after an event exception.
     * @param {Ext.direct.Event} e The event type that occurred.
     */

    constructor: function() {
        var me = this;

        me.transactions = Ext.create('Ext.util.Collection', this.getKey);
        me.providers = Ext.create('Ext.util.Collection', this.getKey);
    },

    getKey: function(item) {
        return item.getId();
    },

    /**
     * Adds an Ext.Direct Provider and creates the proxy or stub methods to execute server-side methods. If the provider
     * is not already connected, it will auto-connect.
     *
     *     Ext.direct.Manager.addProvider({
     *         type: "remoting",       // create a {@link Ext.direct.RemotingProvider}
     *         url: "php\/router.php", // url to connect to the Ext.Direct server-side router.
     *         actions: {              // each property within the actions object represents a Class
     *             TestAction: [       // array of methods within each server side Class
     *             {
     *                 name: "doEcho", // name of method
     *                 len: 1
     *             },{
     *                 name: "multiply",
     *                 len: 1
     *             },{
     *                 name: "doForm",
     *                 formHandler: true,  // handle form on server with Ext.Direct.Transaction
     *                 len: 1
     *             }]
     *         },
     *         namespace: "myApplication", // namespace to create the Remoting Provider in
     *     });
     *
     * @param {Ext.direct.Provider/Object...} provider
     * Accepts any number of Provider descriptions (an instance or config object for
     * a Provider). Each Provider description instructs Ext.Directhow to create
     * client-side stub methods.
     */
    addProvider : function(provider) {
        var me = this,
            args = Ext.toArray(arguments),
            i = 0, ln;

        if (args.length > 1) {
            for (ln = args.length; i < ln; ++i) {
                me.addProvider(args[i]);
            }
            return;
        }

        // if provider has not already been instantiated
        if (!provider.isProvider) {
            provider = Ext.create('direct.' + provider.type + 'provider', provider);
        }
        me.providers.add(provider);
        provider.on('data', me.onProviderData, me);

        if (!provider.isConnected()) {
            provider.connect();
        }

        return provider;
    },

    /**
     * Retrieves a {@link Ext.direct.Provider provider} by the **{@link Ext.direct.Provider#id id}** specified when the
     * provider is {@link #addProvider added}.
     * @param {String/Ext.direct.Provider} id The id of the provider, or the provider instance.
     */
    getProvider : function(id){
        return id.isProvider ? id : this.providers.get(id);
    },

    /**
     * Removes the provider.
     * @param {String/Ext.direct.Provider} provider The provider instance or the id of the provider.
     * @return {Ext.direct.Provider} The provider, null if not found.
     */
    removeProvider : function(provider) {
        var me = this,
            providers = me.providers;

        provider = provider.isProvider ? provider : providers.get(provider);

        if (provider) {
            provider.un('data', me.onProviderData, me);
            providers.remove(provider);
            return provider;
        }
        return null;
    },

    /**
     * Adds a transaction to the manager.
     * @private
     * @param {Ext.direct.Transaction} transaction The transaction to add
     * @return {Ext.direct.Transaction} transaction
     */
    addTransaction: function(transaction) {
        this.transactions.add(transaction);
        return transaction;
    },

    /**
     * Removes a transaction from the manager.
     * @private
     * @param {String/Ext.direct.Transaction} transaction The transaction/id of transaction to remove
     * @return {Ext.direct.Transaction} transaction
     */
    removeTransaction: function(transaction) {
        transaction = this.getTransaction(transaction);
        this.transactions.remove(transaction);
        return transaction;
    },

    /**
     * Gets a transaction
     * @private
     * @param {String/Ext.direct.Transaction} transaction The transaction/id of transaction to get
     * @return {Ext.direct.Transaction}
     */
    getTransaction: function(transaction) {
        return Ext.isObject(transaction) ? transaction : this.transactions.get(transaction);
    },

    onProviderData : function(provider, event) {
        var me = this,
            i = 0, ln,
            name;

        if (Ext.isArray(event)) {
            for (ln = event.length; i < ln; ++i) {
                me.onProviderData(provider, event[i]);
            }
            return;
        }

        name = event.getName();

        if (name && name != 'event' && name != 'exception') {
            me.fireEvent(name, event);
        } else if (event.getStatus() === false) {
            me.fireEvent('exception', event);
        }

        me.fireEvent('event', event, provider);
    },

    /**
     * Parses a direct function. It may be passed in a string format, for example:
     * "MyApp.Person.read".
     * @protected
     * @param {String/Function} fn The direct function
     * @return {Function} The function to use in the direct call. Null if not found
     */
    parseMethod: function(fn) {
        if (Ext.isString(fn)) {
            var parts = fn.split('.'),
                i = 0,
                ln = parts.length,
                current = window;

            while (current && i < ln) {
                current = current[parts[i]];
                ++i;
            }
            fn = Ext.isFunction(current) ? current : null;
        }
        return fn || null;
    }
});
