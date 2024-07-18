"use strict";

const SuccessResponse = require("../core/success");
const ExamService = require("../services/exam.service");

class ExamController {
  createNewExam = async (req, res, next) => {
    new SuccessResponse({
      message: "create new Exam ",
      metaData: await ExamService.createNewExam(req.body),
    }).send(res);
  };
  getAllExams = async (req, res, next) => {
    new SuccessResponse({
      message: "get all exams",
      metaData: await ExamService.getAllExams(req.body),
    }).send(res);
  };
  getExam = async (req, res, next) => {
    new SuccessResponse({
      message: "get exam by id",
      metaData: await ExamService.getExamById(req.params),
    }).send(res);
  };
}
module.exports = new ExamController();
