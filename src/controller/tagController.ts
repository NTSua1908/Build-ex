import { Response } from "express";
import Tag from "../models/Tag";
import { QueryRequest } from "../request";
import { TagSearchRequets } from "../DTOs/tag.dto";

class TagController {
  async GetTag(req: QueryRequest<TagSearchRequets>, res: Response) {
    const { searchText, page = 0, amount = 10 } = req.query;

    let query = Tag.find();
    if (searchText && searchText.length != 0)
      query = query.find({ name: new RegExp(searchText, "i") });
    const tags = await query
      .skip(page * amount)
      .limit(amount)
      .exec();

    return res.status(200).json(tags.map((tag) => ({ value: tag.name })));
  }
}

export default new TagController();
