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
                    name: 'props',
                    label: 'Properties',
                    type: 'form',
                    props: {
                        'fields': [
                            {
                                name: "fields",
                                label: "Champs",
                                type: "collection",
                                props: {
                                    withEmptyForm: false,
                                    placeholder: 'Drag a component here to create a field',
                                    items: {
                                        type: "designer-field"
                                    }
                                }
                            }
                        ]
                    }

                }]
            }
        },

        allFieldsCreated: function () {
            $super.allFieldsCreated.apply(this, arguments);
        }

        /*
         addField: function (options) {
         this.fields['designerFields'].createItemAt(0, options, function () {
         });

         }
         */
    }
});