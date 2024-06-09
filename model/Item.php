<?php

class Item {
    public $sku;
    public $price;
    public $quantity;
    public $name;
    public $description;
    const table = "entity_item";

    public static function get($conn, $sku=null) {
        $table = Item::table;
        $sql = "SELECT
            {$table}.sku,
            {$table}.price,
            {$table}.quantity,
            {$table}.name,
            {$table}.description
            FROM {$table}";
        if ($sku) {
             $sql."WHERE sku=$sku";
        } 
        $items = fetchClass($conn, $sql, "Item");
        return $sku ? $items[0] : $items;
    }
}