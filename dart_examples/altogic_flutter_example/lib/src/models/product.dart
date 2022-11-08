class Product {
  Product(
      {required this.id,
      required this.market,
      required this.name,
      required this.price,
      required this.description,
      required this.category,
      required this.createdAt,
      required this.updatedAt,
      required this.amount});

  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(
      id: map['_id'],
      market: map['market'],
      name: map['name'],
      price: map['price'],
      description: map['description'],
      category: map['category'],
      createdAt: map['createdAt'],
      updatedAt: map['updatedAt'],
      amount: map['amount'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'market': market,
      'name': name,
      'price': price,
      'description': description,
      'category': category,
      'amount': 0
    };
  }

  String id;
  String name;
  String description;
  String category;
  String market;
  double price;
  String updatedAt, createdAt;
  int amount;
}
