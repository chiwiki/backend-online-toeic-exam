const fs = require("fs");
const mammoth = require("mammoth");

const readWordFile = async (filePath) => {
  try {
    // Đọc nội dung từ file Word
    let result = await mammoth.extractRawText({ path: filePath });
    result = result.value.toString().trim().toLowerCase().replace(/\s+/g, " ");
    const regex = /(\d+\.\s)/g;

    // Sử dụng split với biểu thức chính quy để tách chuỗi, nhưng vẫn giữ lại các số mục trong mảng
    const parts = result.split(regex).filter(Boolean);

    // Ghép số mục với nội dung tương ứng để tạo thành các chuỗi riêng biệt
    const results = [];
    for (let i = 0; i < parts.length; i += 2) {
      results.push(parts[i] + (parts[i + 1] || ""));
    }

    const finalResult = results.map((question) => {
      // Biểu thức chính quy để tìm các mục trả lời có dạng "chữ. "
      const choiceRegex = /([a-zA-Z]\.\s[^a-zA-Z]*)/g;

      const choices = question.split(choiceRegex).filter((choice, i) => {
        if (i >= 2 && i % 2 === 0) {
          return choice.trim();
        }
      });
      //   let match;

      //   while ((match = choiceRegex.exec(question)) !== null) {
      //     choices.push(match[0].trim()); // Loại bỏ khoảng trắng ở đầu và cuối
      //   }
      return {
        question: question.split(choiceRegex)[0].trim(), // Câu hỏi (phần đầu tiên trước các mục trả lời)
        choices: choices,
      };
    });

    console.log(finalResult); // In nội dung file Word
  } catch (err) {
    console.error("Error reading file:", err);
  }
};

// Đường dẫn tới file Word
const filePath = "/Users/minhchi/Downloads/BT1.docx";

// Gọi hàm để đọc file
readWordFile(filePath);
