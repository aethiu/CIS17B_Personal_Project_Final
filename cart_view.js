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
                let item = await getItem(sku);
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

root.render(
    <CartItemList cart={controller.cart}></CartItemList>
);