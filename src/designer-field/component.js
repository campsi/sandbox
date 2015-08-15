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
                    required: true
                }, {
                    type: 'text',
                    name: 'name',
                    label: 'Name',
                    props: {
                        matches: '^[a-zA-Z_-][a-zA-Z0-9_-]?'
                    },
                    required: true
                }];


                var componentDesignerFields = component.prototype.getDesignerFields.call();

                if (componentDesignerFields) {
                    alteredOptions.props.fields = alteredOptions.props.fields.concat(componentDesignerFields);
                }

                $super.init.call(instance, alteredOptions, value,  context, callback);

                instance.dom.root.addClass('designer-field');
                instance.dom.root.append($('<p class="type">').text(alteredOptions.props.type));
                instance.component = component;
                instance.createFields();
            });
        },
        allFieldsCreated: function () {
            console.info(this.name, this.value, this.options);
            var instance = this;/*
            instance.fields.label.on('change', function () {
                instance.fields.name.val(sanitize(this.val()));
                instance.fields.name.trigger('change');
            });
*/
            var propsBtn = $('<button>Properties</button>');

            propsBtn.on('click', function () {
                instance.trigger('showProps');
            });
            this.dom.root.append(propsBtn);
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