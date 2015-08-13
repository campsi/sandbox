Campsi.components.add(function ($super) {
    return {

        name: 'form',

        defaultValue: {},

        init: function () {
            $super.init.apply(this, arguments);

            var instance = this, props = this.options.props, fields = this.fields = [];

            $(props.fields).each(function (i, fieldOptions) {
                instance.createField(fieldOptions);
            });

            this.dom.root.addClass('form');

        },

        createField: function (fieldOptions) {
            var instance = this;

            Campsi.components.create(
                fieldOptions,
                instance.value[fieldOptions.name],
                instance.context,
                function (field) {
                    field.on('change', function () {
                        instance.value[fieldOptions.name] = field.val();
                        //var errors = instance.validate(instance.value);
                        instance.trigger('change');
                    });

                    field.on('error', function () {
                        instance.error = true;
                        instance.dom.root.addClass('error');
                        instance.trigger('error');
                    });

                    instance.fields.push(field);
                    instance.dom.control.append(field.html());
                }
            );
        },

        validate: function () {

        }
    }
});