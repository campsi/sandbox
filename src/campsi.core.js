var Campsi = (function () {

    /**
     * Base class for every component
     * @constructor
     */
    var Component = function () {
    };

    Component.prototype = Object.create({

        withLabel: true,
        withErrors: true,
        withHelp: true,
        defaultValue: null,

        init: function (options, value, context) {

            this.options = options;
            this.value = value || this.defaultValue;
            this.context = context || value;
            this.callbacks = {change: [], error: []};
            this.modifiers = [];
            this.errors = [];

            this.createInitialDomElements();
        },
        createInitialDomElements: function () {
            var d = this.dom = {};
            d.root = $('<div class="field component">').addClass(this.name).addClass(this.parentName);


            if (this.withLabel && this.options.label) {
                d.label = $('<div class="label">');
                d.label.append('<span>').text(this.options.label);
                d.root.append(d.label);
            }

            if (this.withHelp && this.options.help) {
                d.help = $('<div class="help">');
                d.root.append(d.help);
            }

            if (this.options.required && this.options.required === true) {
                d.root.append($('<span class="required">*</span>'));
                d.root.addClass('required');
            }

            d.control = $('<div class="control">');
            d.root.append(d.control);

            if (this.withErrors) {
                d.errors = $('<div class="errors">');
                d.root.append(d.errors);
            }
        },
        val: function (value) {
            if (value === undefined) {
                return this.value;
            }
            this.value = this.process(value);
            this.update();

            return this;
        },
        process: function (value) {

            var errorsRef = this.dom.errors.empty();

            this.errors.length = 0;

            this.validate(value);

            if (this.errors.length > []) {
                this.dom.root.addClass('error');
                this.trigger('error');

                errorsRef.append(this.errors.map(function (err) {
                    return $('<p>').text(err.message);
                }));

                return value;
            } else {
                this.dom.root.removeClass('error');
            }
            return this.applyModifiers(value);
        },
        validate: function (value) {
            if(this.options.required){
                this.addError(String(value) === '', 'Missing required field');
            }
        },
        addError: function (condition, message) {
            if (condition) {
                this.errors.push(new Error(message));
            }
        },
        applyModifiers: function (value) {
            return value;
        },
        focus: function () {
            this.dom.control.find('select,input')[0].focus();
        },
        on: function (eventName, callback) {
            this.callbacks[eventName].push(callback);
        },
        trigger: function (eventName) {
            if (!this.callbacks[eventName]) {
                return;
            }

            var i = 0, length = this.callbacks[eventName].length;
            for (i; i < length; i++) {
                this.callbacks[eventName][i].call(this);
            }
        },
        html: function () {
            return this.dom.root[0];
        },
        update: function () {

        }
    });
    return {
        components: (function () {
            var map = this.components = {
                component: Component
            };

            var get = function (name, onLoad) {
                onLoad.call(this, map[name]);
            };

            var add = function (prototypeFactory) {
                extend('component', prototypeFactory);
            };

            var extend = function (parentName, prototypeFactory) {

                get(parentName, function (Parent) {
                    var prototype = prototypeFactory(Parent.prototype),
                        component = function () {
                            Parent.call(this);
                        };

                    component.prototype = Object.create($.extend({}, Parent.prototype, prototype));
                    component.constructor = Parent;
                    map[prototype.name] = component;
                });
            };

            var create = function (options, value, context, onLoad) {
                get(options.type, function (Component) {
                    var component = new Component();
                    component.init(options, value, context);
                    if (onLoad) onLoad.call(this, component);
                });
            };

            return {
                map: map,
                get: get,
                add: add,
                create: create,
                extend: extend
            }
        })()
    }
})();