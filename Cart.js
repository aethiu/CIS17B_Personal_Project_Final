function Cart(items = new Map()) {
    this.items = items;
};

Cart.prototype.get_quantity = function (sku) {
    return this.items.has(sku) ? this.items.get(sku) : 0;
};

Cart.prototype.add_item = function (sku) {
    if (this.items.has(sku)) {
        this.items.set(sku, this.items.get(sku)+1);
    } else {
        this.items.set(sku, 1);
    }
};

Cart.prototype.clear_items = function () {
    this.items.clear();
};

Cart.prototype.num_items = function () {
    let sum = 0;
    for (let [item, quantity] of this.items) {
        sum += quantity;
    }
    return sum;
};

class PersistentCart extends Cart {
    constructor() {
        const cart_cookie_name = "cart";
        const cart_count_cookie_name = "cart_count";

        if (localStorage.getItem(cart_cookie_name)) {
            super(new Map(Object.entries(JSON.parse(localStorage.getItem(cart_cookie_name)))));
        } else {
            super();
        }

        this.cart_cookie_name = cart_cookie_name;
        this.cart_count_cookie_name = cart_count_cookie_name
    }


    add_item(sku) {
        super.add_item(sku);
        this.update_localStorage();
    }

    clear_items() {
        super.clear_items();
        this.update_localStorage();
    }

    update_localStorage() {
        localStorage.setItem(this.cart_count_cookie_name, this.num_items());
        localStorage.setItem(this.cart_cookie_name, JSON.stringify(Object.fromEntries(this.items.entries())));
    }
};