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
                    type: "text",
                    layout: "horizontal",
                    required: true
                }, {
                    name: 'props',
                    label: 'Properties',
                    type: 'form',
                    props: {
                        fields: [
                            {
                                label: 'Fields',
                                name: "fields",
                                type: "designer-form"
                            }
                        ]
                    }

                }]
            }
        }

        /*
         addField: function (options) {
         this.fields['designerFields'].createItemAt(0, options, function () {
         });

         }
         */
    }
});