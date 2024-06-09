const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function OrderReview() {
    const [items, setItems] = React.useState([]);
    const [subtotal, setSubtotal] = React.useState([]);
    const [tax, setTax] = React.useState(0);
    const [shipping, setShipping] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    
    React.useEffect(() => {
        let ignore = false;

        async function fetchOrderItems() {
            const response = await fetch("model/api/checkout.php", {
                method: "GET",
            });
            const checkoutState = await response.json();
            const items = [];
            for (const item of checkoutState.items) {
                items.push(
                    <tr key={item.sku}>
                        <td>{item.sku}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                    </tr>
                );
            }

            if (!ignore) {
                const order = checkoutState.order;
                setSubtotal(order.subtotal);
                setTax(order.tax);
                setShipping(order.shipping);
                setTotal(order.total);
                setItems(items);
            }
        }
        fetchOrderItems();

        return () => ignore = true;
    }, []);

    const handleSubmitClick = async () => {
        await fetch("model/api/checkout.php", {
            method: "PUT"
        }).then(response => {
            if (response.ok) {
                localStorage.removeItem("cart");
                location.assign("index.php");
            }
        });
    }

    return (
<>
    <table>
        <thead>
            <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {items}
        </tbody>
    </table>

    <div>Subtotal: {subtotal}</div>
    <div>Tax: {tax}</div>
    <div>Shipping: {shipping}</div>
    <div>Total: {total}</div>

    <button onClick={handleSubmitClick}>Submit</button>
</>
    );
}

root.render(
<>
    <Navigation />
    <OrderReview />
</>
);