type User = {
    email: string;
    password: string;
};
type ReportDataModel = {
    driver_name: string;
    driver_licence: string;
    car_plate: string;
    speed: string;
    penalty_count?: number;
    report_date: string;
    city: string;
};
type WebSocketData = {
    message: string;
    speed: number;
    licence_plate: string;
    display_duration: number;
};
type ReportSortOption = "penalty" | "city" | "date" | "speed";
export type { User, WebSocketData, ReportSortOption, ReportDataModel };
