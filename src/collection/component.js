Campsi.components.add(function ($super) {


    return {

        name: 'collection',

        style: ['style.css'],

        defaultValue: [],

        defaultOptions: {
            props: {withEmptyForm: true}
        },

        init: function (options, value, context) {

            $super.init.apply(this, arguments);

            var instance = this, d = this.dom;

            this.items = [];

            d.list = $('<ul class="items">');

            if (options.props.placeholder) {
                d.list.append($('<li class="placeholder">').text(options.props.placeholder))
            }

            d.root.addClass('collection');

            $(instance.value).each(function (i, item) {
                instance.createItemComponent(i, item, function (component) {
                    d.list.append(instance.createItemDom(i, component));
                    instance.items.push(component);
                });
            });

            d.list.appendTo(d.control);

            if (options.props.withEmptyForm !== false) {
                d.newItem = instance.createEmptyItem();
                d.newItem.appendTo(d.control);
            }

            var drake = dragula([d.list[0]], {
                moves: function (el, container, handle) {
                    return handle.className === 'drag-handle';
                }
            });

            drake.on('drop', function (el, target, source) {
                instance.reorderValueFromDOM();
            });
        },


        reorderValueFromDOM: function () {
            var instance = this, items = this.items.slice(), newValue = [];

            this.dom.list.find('li').each(function (i, el) {
                var j = 0, l = items.length;
                for (j; j < l; j++) {
                    if (items[j].html() == $(el).find('> .field')[0]) {
                        newValue.push(items[j]);
                    }
                }
            });
            instance.value = newValue;
            instance.trigger('change');
        },

        createItemAt: function (index, itemValue, callback) {

            var instance = this;
            instance.createItemComponent(index, itemValue, function (itemComponent) {

                var itemEl = instance.createItemDom(instance.value.length, itemComponent);

                instance.dom.list.find('> li').append(itemEl);
                instance.items.push(index, 0, itemComponent);
                instance.value.push(index, 0, itemValue);
                instance.trigger('change');

                callback.call(instance);
            });
        },

        removeItemAt: function (index) {
            this.dom.list.find('li').eq(index).remove();
            this.items.splice(index, 1);
            this.value.splice(index, 1);
            this.trigger('change');
        },

        createEmptyItem: function () {
            var instance = this,
                $form = $('<form class="collection-empty-item">'),
                $btn = $('<button>'),
                options = $.extend({}, this.options.props.items, {required: false});

            Campsi.components.create(options, undefined, undefined, function (component) {

                $form.on('submit', function () {
                    var value = component.val();
                    instance.createItemAt(instance.value.length, value, function () {
                        component.val(component.defaultValue).focus();
                    });
                    return false;

                });

                $form.append(
                    component.html()).append($('<div>').append($btn.text('Add'))
                );

            });

            return $form;
        },

        createItemComponent: function (index, item, callback) {
            var instance = this;


            console.info("Campsi.components.create", instance.options.props.items, item, instance.context);

            Campsi.components.create(
                instance.options.props.items,
                item,
                instance.context,
                function (comp) {

                    console.info("createdItem(name, options, value)", comp.name, comp.options, comp.value);

                    comp.index = index;

                    comp.on('change', function () {
                        instance.value[index] = this.val();
                        instance.trigger('change');
                    });

                    comp.on('error', function () {

                    });

                    callback.call(instance, comp);

                }
            );
        },

        createItemDom: function (index, component) {
            var instance = this,
                $li = $('<li class="collection-item">'),
                $dragHandle = $('<div class="drag-handle">&VerticalBar;</div>'),
                $removeButton = $('<button class="remove">&times;</button>');

            $removeButton.on('click', function () {
                $li.remove();
                instance.value.splice(index, 1);
                instance.trigger('change');
            });


            $li.append($dragHandle)
                .append(component.html())
                .append($removeButton);

            return $li;
        }
    }
});
