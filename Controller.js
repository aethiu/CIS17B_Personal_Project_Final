function Controller() {
    this.cart = new PersistentCart();
}

Controller.prototype.add_to_cart = function (item) {
    if (item.quantity > this.cart.get_quantity(item.sku)) {
        this.cart.add_item(item.sku);
    }
};

Controller.prototype.clear_items = function () {
    this.cart.items.clear();
}
