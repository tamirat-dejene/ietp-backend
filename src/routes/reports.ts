import { ReportSortOption, ReportDataModel } from "../lib/definitions.js";
import { createReport, getReports } from "../data/actions.js";
import express from "express";
import { process_image } from "../lib/api.js";

const router = express.Router();

// get request with query parameters
router.get("/", async (req, res) => {
  const { query, sortby } = req.query;
  getReports(query as string, sortby as ReportSortOption)
    .then((reports) => res.json(reports))
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.post("/", async (req, res) => {
  const newReport: ReportDataModel = { ...req.body };
  createReport(newReport)
    .then((report) => res.json(report))
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.post("/plateimage", async (_, res) => {
    process_image("public/uploads/plate2.jpg").then(console.log);
    res.json({ plate: "1234ABC" });
});

export default router;
