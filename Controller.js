function Controller() {
    this.cart = new PersistentCart();
}

Controller.prototype.addToCart = function (item) {
    if (item.quantity > this.cart.get_quantity(item.sku)) {
        this.cart.add_item(item.sku);
    }
};

Controller.prototype.clearCart = function () {
    this.cart.items.clear();
}

Controller.prototype.updateItem = async function (item) {
    const response = await fetch(item.api_uri+"?sku="+item.sku, {
        method: "PATCH",
        body: JSON.stringify(item)
    });
    return response;
}

Controller.prototype.createItem = async function (item) {
    let formData;
    if (item instanceof FormData) {
        formData = item;
    } else {
        formData = new FormData();
        formData.append("price", item.price);
        formData.append("quantity", item.quantity);
        formData.append("name", item.name);
        formData.append("description", item.description);
    }
    const response = await fetch(Item.prototype.api_uri, {
        method: "POST",
        body: formData 
    })
    return response;
}

Controller.prototype.deleteItem = async function (item) {
    const response = await fetch(item.api_uri+"?id="+item.id, {
        method: "DELETE"
    });
    return response;
}

Controller.prototype.updateUser = async function (user) {
    const response = await fetch(user.api_uri+"?id="+user.id, {
        method: "PATCH",
        body: JSON.stringify(user)
    });
    return response;
}

Controller.prototype.createUser = async function (user) {
    let formData;
    if (user instanceof FormData) {
        formData = user;
    } else {
        formData.append("username", user.username);
        formData.append("password", user.passhash);
        formData.append("admin", user.admin);
    }
    const response = await fetch(User.prototype.api_uri, {
        method: "POST",
        body: formData
    })
    return response;
}

Controller.prototype.deleteUser = async function (user) {
    const response = await fetch(user.api_uri+"?id="+user.id, {
        method: "DELETE"
    });
    return response;
}