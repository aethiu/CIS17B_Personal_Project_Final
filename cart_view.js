const controller = new Controller();
const root = ReactDOM.createRoot(document.getElementById("items_container"));

function CartItem({item, quantity}) {
    return (
        <li>{item.sku} {item.name} {quantity}</li>
    );
}

function CartItemList({cart}) {
    let [cartItems, setCartItems] = React.useState([]);

    React.useEffect(() => {
        let ignore = false;
        let items = [];
        async function fillCartItems() {
            for (let [sku, quantity] of cart.items) {
                let item = await Item.prototype.getItem(sku);
                items.push(<CartItem key={item.sku} item={item} quantity={quantity} />);
            }
            if (!ignore) {
                setCartItems(items);
            }
        }
        fillCartItems();

        return () => { ignore = true; };
    }, []);

    return (
        <ul>
            {cartItems}
        </ul>
    );
}

function Cart() {
    const handleSubmitClick = async () => {
        await fetch("model/api/checkout.php", { 
            method: "POST",
            body: JSON.stringify({cart: Object.fromEntries(controller.cart.items)})
        }).then(response => { if (response.ok) location.assign("checkout.php"); });
    };

    return(
<>
    <CartItemList cart={controller.cart} />
    <button type="button" onClick={handleSubmitClick}>Submit order</button>
</>
    );
}

root.render(
<>
    <Navigation />
    <Cart />
</>
);