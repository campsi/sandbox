Campsi.components.add(function ($super) {
    return {

        name: 'text',

        init: function (options, value, context) {

            $super.init.apply(this, arguments);

            this.dom.root.addClass('text');

            var instance = this, input = this.dom.input = $('<input type="text">');

            input.on('change', function (event) {
                instance.val(event.target.value);
                instance.trigger('change');
            });

            input.val(this.value);

            this.dom.control.append(input);
        },

        update: function () {
            this.dom.input.val(this.value);
        },

        validate: function (value) {
            $super.validate.call(this, value);

            var props = this.options.props || {};

            if (props['beginsWith']) {
                this.addError((value.indexOf(props['beginsWith']) !== 0), 'value must begins with ' + props['beginsWith'])
            }
        }
    }
});