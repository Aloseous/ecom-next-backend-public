type CollectionTypes = {
    _id: string;
    title: string;
    description?: string;
    image: string;
    products: ProductType[]; // Assuming the products are referenced by ObjectId
}

type ProductTypes = {
    _id: string;
    title: string;
    description?: string;
    media: [string];
    category: string;
    collections: [CollectionType];
    tags: [string];
    colors: [string];
    sizes: [string];
    price: number;
    expense: number;
    createdAt: Date;
    updatedAt: Date;
}


type OrderTypes = {
    _id: string;
    customer: string;
    products: number;
    totalAmount: number;
    createdAt: Date;
}

type OrderItemType = {
    product: ProductType;
    color: string;
    size: string;
    quantity: number;
}

type CustomerTypes = {
    _id: string;
    clerkId: string;
    name: string;
    email: string;
    orders: [OrderType];
    createdAt: Date;
}   