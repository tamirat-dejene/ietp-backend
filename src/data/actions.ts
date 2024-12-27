import { createHash, timingSafeEqual } from "crypto";
import { ReportSortOption, ReportDataModel, User } from "lib/definitions";
import { matchSorter } from "match-sorter";
import dotenv from "dotenv";
import pg from "pg";
import sortBy from "sort-by";
dotenv.config({ path: ".env" });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export const getUser = async (email: string) => {
  const { rows } = await pool.query("SELECT * FROM ietp_users WHERE email=$1", [
    email,
  ]);
  return rows[0];
};

export const readReports = async () => {
  const { rows } = await pool.query("SELECT * FROM ietp_reports");
  return rows;
};

export const login = async (email: string, password: string) => {
  const user = await getUser(email);
  if (!user) throw new Error("User not found");

  const hashedPassword = createHash("SHA256")
    .update(password, "utf8")
    .digest("base64");
  try {
    if (hashedPassword !== user.password) throw new Error("Invalid password");
  } catch (error) {
    throw new Error("Invalid password");
  }
  return { ...user, password: "******" };
};

export const register = async (newUser: User) => {
  const { email, password } = newUser;
  if (await getUser(email)) throw new Error("User already exists");

  const hashedPassword = createHash("SHA256")
    .update(password, "utf8")
    .digest("base64");
  await pool.query("INSERT INTO ietp_users (password, email) VALUES ($1, $2)", [
    hashedPassword,
    email,
  ]);
  return { ...(await getUser(email)), password: "******" };
};

export const resetPassword = async (
  email: string,
  old_password: string,
  new_password: string
) => {
  const user = await getUser(email);
  if (!user) throw new Error("User not found");

  const hashedOldPassword = createHash("SHA256")
    .update(old_password, "utf8")
    .digest("base64");

  try {
    !timingSafeEqual(
      Buffer.from(hashedOldPassword),
      Buffer.from(user.password)
    );
  } catch (error) {
    throw new Error("Invalid old password");
  }

  const hashedNewPassword = createHash("SHA256")
    .update(new_password, "utf8")
    .digest("base64");
  await pool.query("UPDATE ietp_users SET password=$1 WHERE email=$2", [
    hashedNewPassword,
    email,
  ]);
  return { ...user, password: "******" };
};

export const getReports = async (query: string, orderBy: ReportSortOption) => {
  let reports = await readReports();
  if (query) {
    reports = matchSorter(reports, query, {
      keys: [
        "driver_name",
        "driver_licence",
        "car_plate",
        "speed",
        "penalty_count",
        "report_date",
        "city",
      ],
    });
  }
  if (orderBy)
    reports = reports.sort(
      sortBy(orderBy === "penalty" ? "-penalty_count" : orderBy)
    );
  return reports;
};

export const getReport = async (driver_licence: string) => {
  const { rows } = await pool.query(
    "SELECT * FROM ietp_reports WHERE driver_licence=$1",
    [driver_licence]
  );
  return rows[0];
};

export const createReport = async (newReport: ReportDataModel) => {
  const { driver_name, driver_licence, car_plate, speed, report_date, city } =
    newReport;
  // If the driver already exists, update the report, incrementing the penalty_count
  const existingReport = await getReport(driver_licence);
  if (existingReport)
    newReport.penalty_count = existingReport.penalty_count + 1;

  await pool.query(
    "INSERT INTO ietp_reports (driver_name, driver_licence, car_plate, speed, penalty_count, report_date, city) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [driver_name, driver_licence, car_plate, speed, 1, report_date, city]
  );
  return { ...newReport, penalty_count: 1 };
};

// const updateTable = async () => {
//   await pool.query("ALTER TABLE ietp_users DROP COLUMN user_id");
// }

// const defaultUser = {
//   email: "ietp@g98",
//   password: "ietp"
// };

// const insertDefaultUser = async () => {
//   register(defaultUser);
// }

// updateTable();
// insertDefaultUser();
