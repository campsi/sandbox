Campsi.components.extend('form', function ($super) {

    function sanitize(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '_')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '_')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    return {

        name: 'designer-field',

        withLabel: false,

        withHelp: false,

        withErrors: false,

        style: ['style.css'],

        init: function (options, value, context, callback) {

            var instance = this;
            var alteredOptions = JSON.parse(JSON.stringify(options));

            Campsi.components.get(value.type, function (component) {

                alteredOptions.props = alteredOptions.props || {};
                alteredOptions.props.fields = [{
                    type: 'text',
                    name: 'label',
                    label: 'Label',
                    required: true,
                    layout: 'horizontal'
                }, {
                    type: 'text',
                    name: 'name',
                    label: 'Name',
                    layout: 'horizontal',
                    props: {
                        matches: '^[a-zA-Z_-][a-zA-Z0-9_-]?'
                    },
                    required: true
                }];


                var componentDesignerFields = component.prototype.getDesignerFields.call();

                if (componentDesignerFields) {
                    alteredOptions.props.fields.push({
                        name: 'props',
                        type: 'form',
                        props: {
                            fields: componentDesignerFields
                        }
                    });
                }

                $super.init.call(instance, alteredOptions, value, context, callback);

                instance.dom.root.addClass('designer-field');

                instance.dom.control.prepend($('<h2 class="type">').text(value.type));


                instance.component = component;
                instance.createFields();


            });
        },
        allFieldsCreated: function () {
            var instance = this;

            $(instance.dom.fields['label']).addClass('label-field');
            $(instance.dom.fields['name']).addClass('name-field');

            instance._fields.label.on('change', function () {
                instance._fields.name.val(sanitize(this.val()));
                instance._fields.name.trigger('change');
            });

            var propsBtn = $('<button class="properties">Properties</button>');

            propsBtn.on('click', function () {
                instance.trigger('showProps');
            });

            this.dom.control.append(propsBtn);
        },

        propsForm: function (callback) {

            var instance = this;

            if (this.propsForm) {
                return callback.call(this, this.propsForm);
            }

            var fields = this.component.prototype.getPropsFormFields();

            Campsi.components.create({
                type: 'form',
                name: 'properties',
                label: 'Component properties',
                props: {
                    fields: fields
                }
            }, {}, {}, function (form) {
                instance.propsForm = form;
                callback.call(instance, form);
            });
        }


    }
});