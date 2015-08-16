Campsi.components.extend('collection', function($super){

    return {
        name: 'designer-form',
        defaultOptions: {
            props: {
                withEmptyForm: false,
                placeholder: 'Drag a component here to create a field',
                items: {
                    type: "designer-field"
                }
            }
        },

        init: function(){
            $super.init.apply(this, arguments);

            this.dom.list.addClass('component-dropzone').data('component', this);
        }
    }
});