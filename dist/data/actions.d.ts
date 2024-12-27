import { ReportSortOption, ReportDataModel, User } from "lib/definitions.js";
export declare const getUser: (email: string) => Promise<any>;
export declare const readReports: () => Promise<any[]>;
export declare const login: (email: string, password: string) => Promise<any>;
export declare const register: (newUser: User) => Promise<any>;
export declare const resetPassword: (email: string, old_password: string, new_password: string) => Promise<any>;
export declare const getReports: (query: string, orderBy: ReportSortOption) => Promise<any[]>;
export declare const getReport: (driver_licence: string) => Promise<any>;
export declare const createReport: (newReport: ReportDataModel) => Promise<{
    penalty_count: number;
    driver_name: string;
    driver_licence: string;
    car_plate: string;
    speed: string;
    report_date: string;
    city: string;
}>;
