Campsi.components.add(function ($super) {


    return {

        name: 'collection',

        defaultValue: [],

        init: function (options, value, context) {

            $super.init.apply(this, arguments);

            var instance = this, d = this.dom;

            this.items = [];

            d.list = $('<ul class="items">');

            d.root.addClass('collection');

            $(instance.value).each(function (i, item) {
                instance.createItemComponent(i, item, function (component) {
                    d.list.append(instance.createItemDom(i, component));
                    instance.items.push(component);
                });
            });

            d.list.appendTo(d.root);

            d.newItem = instance.createEmptyItem();
            d.newItem.appendTo(d.root);

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
                        //items.splice(j, 1);
                    }
                }
            });
            instance.value = newValue;
            instance.trigger('change');
        },

        createEmptyItem: function () {
            var instance = this,
                $ul = $('<ul>'),
                $li = $('<li>'),
                $btn = $('<button>'),
                options = $.extend({}, this.options.props.items, {required: false});

            Campsi.components.create(options, undefined, undefined, function (component) {

                $btn.on('click', function () {
                    var value = component.val();
                    instance.createItemComponent(instance.value.length, value, function (item) {

                        var itemEl = instance.createItemDom(instance.value.length, item);

                        instance.dom.list.append(itemEl);
                        instance.items.push(item);
                        instance.value.push(value);
                        instance.trigger('change');

                        component.val('').focus();
                    })

                });

                $ul.append(
                    $li.append(component.html()).append($btn.text('Add'))
                );

            });

            return $ul;
        },

        createItemComponent: function (index, item, callback) {
            var instance = this;

            Campsi.components.create(
                this.options.props.items,
                item,
                this.context,
                function (comp) {

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
                $li = $('<li>'),
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
