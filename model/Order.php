<?php

class Order {
    public $number = 0;
    public $date;
    public $user_id;
    public $items;
    public $subtotal;
    public $tax;
    public $shipping;
    public $total;
    
    const table = "entity_order";
    const itemXrefTable = "xref_order_item";

    public static function get($conn, $number=null) {
        $table = Order::table;
        $xrefTable = Order::itemXrefTable;
        $sql = "SELECT 
                $table.number, 
                $table.date,
                $table.user_id,
                $table.tax,
                $table.subtotal,
                $table.tax,
                $table.shipping,
                $table.total 
            FROM $table";
        if ($number) $sql .= "WHERE number=$number";
        
        $orders = fetchClass($conn, $sql, "Order");

        foreach ($orders as $order) {
            $order->items = $conn->query("SELECT 
                    $xrefTable.sku,
                    $xrefTable.quantity
                FROM $xrefTable
                WHERE $xrefTable.order_number=$order->number")->fetchAll();
        }

        return $orders;
    }
}