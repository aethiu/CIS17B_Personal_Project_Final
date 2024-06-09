function Cart(items = new Map()) {
    this.items = items;
};

Cart.prototype.get_quantity = function (sku) {
    return this.items?.get(sku) ?? 0;
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
        const cookieName = "cart";

        if (localStorage.getItem(cookieName)) {
            super(new Map(Object.entries(JSON.parse(localStorage.getItem(cookieName)))));
        } else {
            super();
        }

        this.cookieName = cookieName;
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
        localStorage.setItem(this.cookieName, JSON.stringify(Object.fromEntries(this.items.entries())));
    }
};