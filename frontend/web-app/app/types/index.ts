export type PagedResult<T> = {
    results: T[]
    pageCount: number
    totalCount: number
}

export type Subscription = {
    id: string
    price: string
    features: string[]
    user: User;
    payment?: Payment;
};

export type User = {
    lastName: string;
    firstName: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
};

export type Payment = {
    amount: number;
    currency: string;
    paymentDate: string;
    method: string;
    status: string;
};

export interface UserRegisterDto {
    planId: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string; // Keeping as string for proper JSON serialization
    email: string;
    gender: string; // Enforcing gender as a union type
}

