Campsi.components.extend('form', function ($super) {


    return {
        name: "designer-collection",

        defaultValue: {
            name: "Untitled collection",
            fields: []
        },

        defaultOptions: {
            props: {
                fields: [{
                    name: "name",
                    label: "Collection name",
                    type: "text"
                }, {
                    name: "designerFields",
                    label: "Champs",
                    type: "collection",
                    props: {
                        withEmptyForm: false,
                        placeholder: 'Drag a component here to create a field',
                        items: {
                            type: "designer-field"
                        }
                    }
                }]
            }
        },

        init: function (options, value, context) {
            var instance = this;

            $super.init.apply(instance, arguments);


            //this.createFields();
        },
        allFieldsCreated: function () {
            var $fieldsList = this.fields['designerFields'].dom.list;
            $fieldsList.addClass('components-list').data('component', this);
        },
        addField: function (options) {
            this.fields['designerFields'].createItemAt(0, options, function () {
            });

        },
        removeField: function () {

        }
    }
});