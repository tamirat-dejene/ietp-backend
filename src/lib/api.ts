// call api
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.PLATE_RECOGNIZER_API_KEY;

const process_image = async (image: string) => {
  const body = new FormData();
  body.append("upload", fs.createReadStream(image));
  body.append("regions", "us-ca");
  const response = await fetch(
    "https://api.platerecognizer.com/v1/plate-reader/",
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    }
  );
  return response.json();
};

export { process_image };
