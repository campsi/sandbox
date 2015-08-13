Campsi.components.extend('text', function ($super) {
    return {
        name: 'number',
        init: function () {
            $super.init.apply(this, arguments);
            this.dom.root.addClass('number');
            this.dom.input.attr('type', 'number');
        }
    }
});