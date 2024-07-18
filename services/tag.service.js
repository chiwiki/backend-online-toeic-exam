"use strict";

const { BadRequestError } = require("../core/error");
const Tag = require("../models /tag.model");
const { Types } = require("mongoose");
class TagService {
  static async createNewTag(payload) {
    let { name, parentTagId = null } = payload;
    name = name.trim();
    const tagObject = {
      name,
    };
    if (parentTagId) {
      const foundTagParent = await Tag.findOne({
        _id: new Types.ObjectId(parentTagId),
      });
      if (!foundTagParent) throw new BadRequestError("parent not found");
      tagObject.parent_tag_id = parentTagId;
    }
    const newTag = await Tag.create(tagObject);
    if (parentTagId) {
      const tagParent = await Tag.findOneAndUpdate(
        { _id: parentTagId },
        { $push: { tag_children: newTag._id } }
      );
    }
    return newTag;
  }
  static async getAllTags() {
    return await Tag.find({ parent_tag_id: undefined });
  }
  static async searchTag({ q }) {
    const filter = { name: new RegExp(q, "i") };
    return await Tag.find(filter).lean().select("name");
  }
}
module.exports = TagService;
