"use strict";

const Exam = require("../models /exam.model");
const ExamResult = require("../models /exam_result.model");
const Part = require("../models /part.model");
const { question: Question, sQuestion } = require("../models /question.model");

class ExamService {
  static async createNewExam({ part_info_list, exam_info }) {
    // const { exam_name, exam_time, exam_part, exam_description, exam_tags } =
    //   exam_info;
    const new_exam = await Exam.create(exam_info);
    let parts = [];

    await Promise.all(
      part_info_list.map(async (part) => {
        let partObject = {};
        let questions = [];
        const { question_list, ...part_info } = part;
        const newPart = await Part.create({
          ...part_info,
          part_exam: new_exam._id,
        });
        partObject.part = newPart;

        await Promise.all(
          question_list.map(async (question) => {
            let questionObject = {};
            let childrenQuestions = [];
            let {
              question_images,
              question_audio,
              question_content,
              question_transcript,
              childrenQuestion,
            } = question;
            console.log("QUESTION_IMAGES::", question_images);
            const newQuestion = await Question.create({
              question_images,
              question_audio,
              question_content,
              question_part: newPart._id,
              question_transcript,
            });
            questionObject.question = newQuestion;
            await Promise.all(
              childrenQuestion.map(async (cQuestion) => {
                console.log("CHILDREN QUESTION");
                const newSingleQuestion = await sQuestion.create({
                  ...cQuestion,
                  question_parent: newQuestion._id,
                });
                const updatedQuestion = await Question.findOneAndUpdate(
                  { _id: newQuestion._id },
                  { $push: { question_list: newSingleQuestion._id } }
                );
                childrenQuestions.push(newSingleQuestion);
              })
            );
            questionObject.children = [...childrenQuestions];
            questions.push(questionObject);
          })
        );
        partObject.questions = [...questions];
        console.log("PART_OBJECT::", partObject);
        parts.push(partObject);
        console.log("PARTS::", parts);
      })
    );
    console.log("*********");
    return {
      exam: new_exam,
      parts: parts,
    };
  }
  static async getAllExams({ user_id = undefined }) {
    const exams = await Exam.find()
      .populate("exam_tags", "name")
      .select("-comments")
      .sort({ createdAt: -1 })
      .lean();
    if (user_id) {
      for (let i = 0; i < exams.length; i++) {
        const resultExam = await ExamResult.findOne({
          exam: exams[i]._id,
          user: user_id,
        });
        if (resultExam) {
          exams[i].tested = true;
        }
      }
    }
    return exams;
  }
  static async getExamById({ examId }) {
    const exam = await Exam.findById(examId)
      .select("exam_parent_comments exam_name exam_comments")
      .lean();
    return exam;
  }
  static async editExam({ examId }) {}
}
module.exports = ExamService;
