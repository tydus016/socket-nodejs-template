import fs from "fs";
import path from "path";

/**
 * 
 * @var content [String] - The content to be logged
 * @var type [String] - debug, access, error
 */
const Logger = (content, type = "debug") => {
  const current_date = new Date().toDateString();
  const file_name = type + "_" + current_date;
  
  const logFilePath = path.join(process.cwd(), "logs", `${file_name}.log`);
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
  const date_now = dateNow();

  logStream.write(date_now + content + "\n");
};

const dateNow = () => {
  const date = new Date().toDateString();
  const time = new Date().toLocaleTimeString();

  return `[${date} ${time}] `;
};

export default Logger;
