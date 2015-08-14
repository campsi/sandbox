Campsi.components.add(function ($super) {
    return {

        name: 'form',

        style: ['style.css'],

        defaultValue: {},

        init: function () {
            $super.init.apply(this, arguments);
            this.dom.root.addClass('form');
            this.dom.fields = {};
            this.fields = {};
            this.fieldsCreated = 0;

            if (this.options.props && this.options.props.fields) {
                this.createFields();
            }


        },

        createFields: function () {
            var instance = this, props = this.options.props;
            $(props.fields).each(function (i, fieldOptions) {
                instance.createField(fieldOptions);
            });
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
                        instance.trigger('change');
                        if (field.errors.length == 0) {
                            instance.dom.root.removeClass('error');
                        }
                    });

                    field.on('error', function () {
                        instance.error = true;
                        instance.dom.root.addClass('error');
                        instance.trigger('error');
                    });

                    instance.fields[fieldOptions.name] = field;
                    instance.fieldsCreated++;

                    if (instance.fieldsCreated === instance.options.props.fields.length) {

                        $(instance.options.props.fields).each(function (i, f) {
                            instance.dom.fields[f.name] = instance.fields[f.name].html();
                            instance.dom.control.append(instance.dom.fields[f.name]);
                        });

                        instance.allFieldsCreated();
                    }
                }
            );
        },

        allFieldsCreated: function () {

        },

        getDesignerFields: function () {
            return [
                {
                    type: "collection",
                    name: "fields",
                    props: {
                        type: "field",
                        withEmptyForm: false
                    }
                }
            ];
        },

        update: function () {
            var value = this.value;

            $.each(this.fields, function (fieldName, field) {
                field.val(value[fieldName]);
            });
        },

        validate: function () {

        }
    }
})
;