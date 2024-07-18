const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error");
const ExamResult = require("../models /exam_result.model");
const User = require("../models /user.models");

class ResultService {
  static async getResultById({ id }) {
    const result = await ExamResult.findById(id)
      .populate("exam", "exam_name")
      .select("-__v -user -updatedAt")
      .lean();
    if (!result) {
      throw new BadRequestError("Id not valid");
    }
    return result;
  }
  static dateStart({ daysToSubtract = 30 }) {
    const resultDate = new Date();
    resultDate.setDate(resultDate.getDate() - daysToSubtract);
    return resultDate;
  }
  static async getResultByUser({ userId, days = 30, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const findUser = await User.findById(userId);
    if (!findUser) throw new BadRequestError("id not valid");
    const results = await ExamResult.find({
      testedAt: { $gte: ResultService.dateStart({ daysToSubtract: days }) },
      user: new Types.ObjectId(userId),
    })
      .populate("exam", "exam_name")
      .select("-user -__v")
      .skip(skip)
      .limit(limit)
      .sort({ testedAt: -1 })
      .lean();
    return results;
  }
  static async getResultByUserAndTest({
    userId,
    examId,
    page = 1,
    limit = 10,
  }) {
    const skip = (page - 1) * limit;
    const findUser = await User.findById(userId);
    if (!findUser) throw new BadRequestError("id not valid");
    const results = await ExamResult.find({
      exam: new Types.ObjectId(examId),
      user: new Types.ObjectId(userId),
    })
      .populate("exam", "exam_name")
      .select("-user -__v")
      .skip(skip)
      .limit(limit)
      .sort({ testedAt: -1 })
      .lean();
    return results;
  }
}

module.exports = ResultService;
