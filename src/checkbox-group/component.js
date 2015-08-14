Campsi.components.add(function($super){

    return {

        name: 'checkbox-group',

        init: function(){
            $super.init.apply(this, arguments);

            this.dom.root.addClass(this.name);



        }
    }
});