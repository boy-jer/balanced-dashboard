Balanced.Card = Balanced.FundingInstrument.extend({
    type_name: function() {
        return 'Card';
    }.property(),

    is_bank_account: false,

    description: function () {
        return '{0} ({1})'.format(
            this.get('last_four'),
            this.get('brand')
        );
    }.property('last_four', 'brand')
});
