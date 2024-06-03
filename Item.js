function Item(sku=0, price=0.0, quantity=0, name="", description="") {
    this.sku = sku;
    this.price = price;
    this.quantity = quantity;
    this.name = name;
    this.description = description;
}

Item.prototype.getDto = function () {
    return {
        sku: this.sku,
        price: this.price,
        quantity: this.quantity,
        name: this.name,
        description: this.description
    }
}

Item.prototype.api_uri = "model/api/items.php";

Item.prototype.getItem = async function (sku) {
    const response = await fetch(Item.prototype.api_uri+"?sku="+sku);
    const items = await response.json();
    return items && Object.setPrototypeOf(items[0], Item.prototype);
}

Item.prototype.getItems = async function getItems() {
    const response = await fetch(Item.prototype.api_uri);
    const items = await response.json();
    return items && items.map((item) => Object.setPrototypeOf(item, Item.prototype));
}