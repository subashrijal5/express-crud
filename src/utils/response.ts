interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: T;
}

// Error response type
export const errorResponse = <T>(
    message: string,
    errors?: T
): ApiResponse<T> => {
    return {
        success: false,
        message,
        errors,
    };
};

// Generic success response type
export const successResponse = <T>(
    data: T,
    message: string = "Request successful"
): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};
