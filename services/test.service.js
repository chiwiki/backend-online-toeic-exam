const Part = require("../models /part.model");
const { Types } = require("mongoose");
const { question: Question, sQuestion } = require("../models /question.model");
const Tag = require("../models /tag.model");
const Exam = require("../models /exam.model");
const { BadRequestError } = require("../core/error");
const ExamResult = require("../models /exam_result.model");
const ResultService = require("./result.service");

class TestService {
  static async checkout({ examId, userId }) {
    const exam = await Exam.findById(examId)
      .populate("exam_tags", "name")
      .lean();
    if (!exam) throw new BadRequestError("not exist exam with this id");
    let results = [];
    if (userId) {
      results = await ResultService.getResultByUserAndTest({
        userId,
        examId,
      });
    }

    const parts = await Part.find({
      part_exam: new Types.ObjectId(examId),
    })
      .select("part_name part_type part_number_of_questions")
      .sort({ part_name: 1 })
      .lean();
    console.log("PART_LIST::", parts);
    let part_list = [];
    for (let i = 0; i < parts.length; i++) {
      const questions = await Question.find({
        question_part: parts[i]._id,
      }).lean();
      let tags = [];
      for (let j = 0; j < questions.length; j++) {
        const question_list = await sQuestion
          .find({
            question_parent: questions[j]._id,
          })
          .populate("question_tags", "name")
          .lean();
        for (let k = 0; k < question_list.length; k++) {
          const question_tags = question_list[k].question_tags.map(
            (tag) => tag.name
          );

          tags = [...new Set([...tags, ...question_tags])];
        }
      }
      tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      console.log({ tags });

      part_list.push({ ...parts[i], tags });

      // part_list.splice(part_list.length, 0, { ...parts[i], tags });
      // console.log({ ...parts[i], tags });
    }

    // console.log("PART_LIST2:::", part_list);
    return { exam_info: exam, part_list, results };
  }

  static async test({ testMode, part_list = [], examId }) {
    const findExam = await Exam.findById(examId).select("exam_name").lean();
    if (!findExam) throw new BadRequestError("Exam id is not valid");
    console.log("PART LIST::", part_list);
    if (typeof part_list === "string") {
      const array = [part_list];
      part_list = array;
    }
    console.log("PART LIST222::", part_list);

    if (testMode === "Practice") {
      if (!part_list.length)
        throw new BadRequestError(
          "You shoud select at least one part to practice"
        );
    } else {
      const parts = await Part.find({ part_exam: examId })
        .select("part_name ")
        .sort({ part_name: 1 })
        .lean();
      for (let i = 0; i < parts.length; i++) {
        part_list.push(parts[i]._id);
      }
      console.log("LIST3::", part_list);
    }
    let questionOfPart = [];
    for (let i = 0; i < part_list.length; i++) {
      const findPart = await Part.findOne({
        _id: new Types.ObjectId(part_list[i]),
      })
        .select("part_name part_type")
        .lean();
      console.log("FINDPART:::", findPart);
      const questions = await Question.aggregate([
        { $match: { question_part: new Types.ObjectId(part_list[i]) } },

        {
          $lookup: {
            from: "singlequestions",
            localField: "_id",
            foreignField: "question_parent",
            as: "singlequestion",
          },
        },
        { $unwind: "$singlequestion" },
        {
          $project: {
            question_images: 1,
            question_audio: 1,
            question_content: 1,
            index: "$singlequestion.index",
            content: "$singlequestion.content",
            choices: "$singlequestion.choices",
            children_id: "$singlequestion._id",
            _id: 1,
          },
        },
        { $sort: { index: 1 } },
        {
          $group: {
            _id: "$_id",
            question_images: { $first: "$question_images" },
            question_audio: { $first: "$question_audio" },
            question_content: { $first: "$question_content" },
            childrenQuestion: {
              $push: {
                index: "$index",
                content: "$content",
                choices: "$choices",
                _id: "$children_id",
              },
            },
            number: { $first: "$index" },
          },
        },
        { $sort: { number: 1 } },
      ]);

      questionOfPart.push({
        part_name: findPart.part_name,
        part_type: findPart.part_type,
        questions,
      });
    }

    return { questionOfPart, exam: findExam };
  }
  static async submitTest({
    part_answer_list,
    exam_mode,
    examId,
    decodedUser,
    time,
  }) {
    const { userId } = decodedUser;
    let examResult = {
      exam: examId,
      user: userId,
      exam_mode,
      time,
    };
    let detailResult = [];
    for (let i = 0; i < part_answer_list.length; i++) {
      const part_answers = part_answer_list[i];
      let skip = 0;
      let correct = 0;
      let incorrect = 0;
      let tags = {};
      let questions = [];
      for (let j = 0; j < part_answers.userAnswers.length; j++) {
        const answer = part_answers.userAnswers[j];
        const question = await sQuestion.aggregate([
          { $match: { _id: new Types.ObjectId(answer._id) } },
          {
            $lookup: {
              from: "Questions",
              localField: "question_parent",
              foreignField: "_id",
              as: "DetailQuestion",
            },
          },
          { $unwind: "$DetailQuestion" },
          {
            $project: {
              question_parent: "$DetailQuestion._id",
              question_audio: "$DetailQuestion.question_audio",
              question_images: "$DetailQuestion.question_images",
              question_content: "$DetailQuestion.question_content",
              question_transcript: "$DetailQuestion.question_transcript",
              question_tags: 1,
              content: 1,
              choices: 1,
              answer: 1,
              explaination: 1,
              index: 1,
            },
          },
          { $unwind: "$question_tags" },
          {
            $lookup: {
              from: "Tags",
              localField: "question_tags",
              foreignField: "_id",
              as: "tags",
            },
          },
          { $unwind: "$tags" },
          {
            $project: {
              question_parent: 1,
              question_audio: 1,
              question_images: 1,
              question_transcript: 1,
              question_content: 1,
              tags: "$tags.name",
              content: 1,
              choices: 1,
              answer: 1,
              explaination: 1,
              index: 1,
            },
          },
          {
            $group: {
              _id: "$_id",
              tag_list: { $push: "$tags" },
              question_parent: { $first: "$question_parent" },
              question_audio: { $first: "$question_audio" },
              question_images: { $first: "$question_images" },
              question_content: { $first: "$question_content" },
              question_transcript: { $first: "$question_transcript" },
              content: { $first: "$content" },
              choices: { $first: "$choices" },
              answer: { $first: "$answer" },
              explaination: { $first: "$explaination" },
              index: { $first: "$index" },
            },
          },
          {
            $project: {
              question_parent: 1,
              question_audio: 1,
              question_images: 1,
              question_transcript: 1,
              question_content: 1,
              tag_list: 1,
              content: 1,
              choices: 1,
              answer: 1,
              explaination: 1,
              index: 1,
            },
          },
          { $sort: { index: 1 } },
        ]);

        if (answer.yourAnswer.length === 0) skip += 1;
        else if (question[0].answer == answer.yourAnswer) {
          question[0].tag_list.map((tag) => {
            if (!tags[tag]) {
              tags[tag] = {
                correct: 1,
                incorrect: 0,
                question: [{ id: question[0]._id, index: question[0].index }],
              };
            } else {
              tags[tag].correct += 1;
              tags[tag].question.push({
                id: question[0]._id,
                index: question[0].index,
              });
            }
          });
          correct += 1;
        } else {
          //   console.log("Question Answer::", question.answer);
          //   console.log("YOUR ANSWER::", answer.answer);
          incorrect += 1;
          question[0].tag_list.map((tag) => {
            if (!tags[tag]) {
              tags[tag] = {
                correct: 0,
                incorrect: 1,
                question: [{ id: question[0]._id, index: question[0].index }],
              };
            } else {
              tags[tag].incorrect += 1;
              tags[tag].question.push({
                id: question[0]._id,
                index: question[0].index,
              });
            }
          });
        }

        questions.push({ ...question[0], yourAnswer: answer.yourAnswer });
      }
      detailResult.push({
        part_name: part_answers.part_name,
        part_type: part_answers.part_type,
        skip,
        correct,
        incorrect,
        tags,
        questions,
      });
    }

    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalSkip = 0;
    let totalListening = 0;
    let totalReading = 0;

    await Promise.all(
      detailResult.map((part) => {
        console.log("PART::", part);
        totalCorrect += part.correct;
        totalIncorrect += part.incorrect;
        totalSkip += part.skip;
        if (part.part_type === "Listening") {
          totalListening += part.correct;
        } else {
          totalReading += part.correct;
        }
      })
    );
    const part_practice = part_answer_list.map((part) => part.part_name);
    examResult.correct = totalCorrect;
    examResult.incorrect = totalIncorrect;
    examResult.skip = totalSkip;
    examResult.exam_part_practice = part_practice;
    examResult.total_listening = totalListening;
    examResult.total_reading = totalReading;
    if (exam_mode === "Test") {
      examResult.listening_score = totalListening * 5;
      examResult.reading_score = totalReading * 5;
    }
    examResult.detail_result = detailResult;

    const newExamResult = await ExamResult.create(examResult);

    return newExamResult;
  }
}

module.exports = TestService;
