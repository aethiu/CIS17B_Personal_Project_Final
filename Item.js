function Item(sku=0, price=0.0, quantity=0, name="", description="") {
    this.sku = sku;
    this.price = price;
    this.quantity = quantity;
    this.name = name;
    this.description = description;
}

Item.prototype.api_uri = "model/api/items.php";

async function getItem(sku) {
    const response = await fetch(Item.prototype.api_uri+"?sku="+sku);
    const items = await response.json();
    return items && items[0];
}

async function getItems() {
    const response = await fetch(Item.prototype.api_uri);
    return await response.json();
}
