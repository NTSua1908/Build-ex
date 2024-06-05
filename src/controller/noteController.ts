import bcrypt from "bcrypt";
import { log } from "console";
import { Response } from "express";
import { Document } from "mongoose";
import { PaginationResponse } from "../DTOs/common.dto";
import {
  CreateUpdateNote,
  NoteGetAllRequest,
  NoteList,
} from "../DTOs/note.dto";
import { OrderType } from "../config/enum.config";
import {
  checkIsDeleted,
  createDataContent,
  createDataTile,
  reverseString,
  shiftStringUpByOne,
} from "../helper/common.helper";
import Note, { INote } from "../models/Note";
import Tag, { ITag } from "../models/Tag";
import User from "../models/User";
import { JSONBodyRequest, ParamsRequest } from "../request";
import { NoteDetail } from "./../DTOs/note.dto";
import {
  formatData,
  shiftStringDownByOne,
  stringIn,
  stringOut,
} from "./../helper/common.helper";
import { QueryRequest } from "./../request";

class NoteController {
  async CreateNote(req: JSONBodyRequest<CreateUpdateNote>, res: Response) {
    // Process data
    const data = formatData(req.body.content);
    log(data);
    const content = reverseString(
      shiftStringUpByOne(stringIn(data || req.body.content))
    );
    const title = reverseString(shiftStringUpByOne(stringIn(req.body.title)));
    const contents = createDataContent(content);
    const titles = createDataTile(title);

    // Process tags
    const nonExistedTags = await findNonExistentTags(
      req.body.tags.map((tag) => tag.toLowerCase())
    );
    const newTags = await Tag.insertMany(
      nonExistedTags.nonExistentTagNames.map((name) => ({ name }))
    );

    const note = new Note({
      title1: titles[1],
      title2: titles[0],
      content1: contents[2],
      content2: contents[0],
      content3: contents[1],
      createdDate: new Date(),
      isDeleted: data !== undefined,
      shareable: false,
      tags: [
        ...nonExistedTags.existingTagIds,
        ...newTags.map((tag) => tag._id),
      ],
    });

    await note.save();

    return res
      .status(201)
      .json({ id: note._id, isDeleted: data !== undefined });
  }

  async UpdateNote(req: JSONBodyRequest<CreateUpdateNote>, res: Response) {
    const id = req.params.id;
    let note = await Note.findById(id);

    if (!note) {
      return res.status(400).json({ message: "Note can not be found" });
    }
    // Process data
    const data = formatData(req.body.content);

    const content = reverseString(
      shiftStringUpByOne(stringIn(data || req.body.content))
    );
    const title = reverseString(shiftStringUpByOne(stringIn(req.body.title)));
    const contents = createDataContent(content);
    const titles = createDataTile(title);

    // Process tags
    const nonExistedTags = await findNonExistentTags(
      req.body.tags.map((tag) => tag.toLowerCase())
    );
    const newTags = await Tag.insertMany(
      nonExistedTags.nonExistentTagNames.map((name) => ({ name }))
    );

    const updateData = {
      title1: titles[1],
      title2: titles[0],
      content1: contents[2],
      content2: contents[0],
      content3: contents[1],
      isDeleted: data !== undefined,
      shareable: data !== undefined ? false : note.shareable,
      tags: [
        ...nonExistedTags.existingTagIds,
        ...newTags.map((tag) => tag._id),
      ],
      updatedDate: new Date(),
    };

    Object.assign(note, updateData);

    await note.save();

    return res
      .status(200)
      .json({ id: note._id, isDeleted: data !== undefined });
  }

  // ===> Get detail
  async GetDetail(
    req: JSONBodyRequest<{ firstPassword?: string; secondPassword?: string }>,
    res: Response
  ) {
    const id = req.params.id;

    const note = await Note.findById(id).populate("tags").exec();
    if (!note) {
      return res.status(400).json({ message: "Note can not be found" });
    }

    return await getNoteDetail(note, req, res);
  }

  // ===> Get all
  async GetAll(req: QueryRequest<NoteGetAllRequest>, res: Response) {
    const {
      title,
      createdDateFrom,
      createdDateTo,
      content,
      tags,
      orderType = OrderType.Descending,
      page = 0,
      amount = 10,
    } = req.query;

    const tagsName = Array.isArray(tags) ? tags : tags ? [tags] : [];

    const isDeleted = checkIsDeleted(title);

    let query = Note.find({ isDeleted: isDeleted }).populate("tags");
    console.log(
      title,
      createdDateFrom,
      createdDateTo,
      content,
      tagsName,
      orderType,
      page,
      amount
    );

    if (createdDateFrom) {
      query = query.find({ createdDate: { $gte: createdDateFrom } });
    }
    if (createdDateTo) {
      query = query.find({ createdDate: { $lte: createdDateTo } });
    }

    if (tagsName.length != 0) {
      const nonExistedTags = await Tag.find({
        name: {
          $in: tagsName.map((tagName) => new RegExp(`^${tagName}$`, "i")),
        },
      });
      const tagIds = nonExistedTags.map((tag) => tag._id);
      query = query.find({ tags: { $all: tagIds } });
    }

    var noteList: (NoteList & { content: string })[];
    var totalCount = 0;

    let searchText = isDeleted ? title?.substring(10) : title;
    if (searchText || content) {
      var result = await query.exec();
      noteList = parseToNoteList(result);

      if (searchText && searchText.length != 0) {
        noteList = noteList.filter(
          (note) =>
            note.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        );
      }

      if (content) {
        noteList = noteList.filter(
          (note) =>
            note.content.toLowerCase().indexOf(content.toLowerCase()) != -1
        );
      }

      totalCount = noteList.length;
      if (orderType == OrderType.Ascending) {
        noteList = noteList.sort((a, b) =>
          a.createdDate > b.createdDate ? 1 : -1
        );
      } else {
        noteList = noteList.sort((a, b) =>
          a.createdDate > b.createdDate ? -1 : 1
        );
      }
      noteList = noteList.slice(page * amount, (page + 1) * amount);
    } else {
      if (orderType == OrderType.Ascending) {
        query = query.sort({ createdDate: 1 });
      } else {
        query = query.sort({ createdDate: -1 });
      }

      totalCount = await Note.countDocuments(query);

      result = await query
        .skip(page * amount)
        .limit(amount)
        .exec();

      noteList = parseToNoteList(result);
    }

    const paginationResponse: PaginationResponse<NoteList> = {
      page,
      totalCount,
      data: noteList.map(({ id, title, tags, isDeleted, createdDate }) => ({
        id,
        title,
        tags,
        isDeleted,
        createdDate,
      })),
    };

    return res.status(200).json(paginationResponse);
  }

  async ToggleShareable(req: ParamsRequest<{ id: string }>, res: Response) {
    const id = req.params.id;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(400).json({ message: "Note can not be found" });
    } else if (note.isDeleted) {
      return res.status(400).json({ message: "Can not share this note!!!" });
    }

    await Object.assign(note, {
      shareable: !note.shareable,
    });
    await note.save();

    return res.status(200).json(note.shareable);
  }

  // ===> Get detail
  async GetNoteShareDetail(
    req: JSONBodyRequest<{ firstPassword?: string; secondPassword?: string }>,
    res: Response
  ) {
    const id = req.params.id;

    const note = await Note.findById(id).populate("tags").exec();
    if (!note || !note.shareable || note.isDeleted) {
      return res.status(400).json({ message: "Note can not be found" });
    }

    return await getNoteDetail(note, req, res);
  }

  async Delete(req: ParamsRequest<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
      const deletedNote = await Note.findByIdAndDelete(id);

      if (!deletedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      return res.status(200).json({ message: "Note successfully deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting note" });
    }
  }
}

export default new NoteController();

const findNonExistentTags = async (tagNames: string[]) => {
  const existingTags = await Tag.find({
    name: { $in: tagNames.map((tagName) => new RegExp(`^${tagName}$`, "i")) },
  }).exec();
  const existingTagNames = existingTags.map((tag) => tag.name.toLowerCase());

  const nonExistentTagNames = tagNames.filter(
    (tagName) => !existingTagNames.includes(tagName)
  );
  const existingTagIds = existingTags.map((tag) => tag._id);

  return { nonExistentTagNames, existingTagIds };
};

const parseToNoteList = (
  result: (Document<unknown, {}, INote> &
    INote &
    Required<{
      _id: unknown;
    }>)[]
) => {
  const noteList: (NoteList & { content: string })[] = result.map((note) => {
    return {
      id: note._id as string,
      title: stringOut(
        shiftStringDownByOne(reverseString(note.title2 + note.title1))
      ),
      tags: note.tags.map((tag) => tag.name),
      createdDate: note.createdDate,
      isDeleted: note.isDeleted,
      content: stringOut(
        shiftStringDownByOne(
          reverseString(note.content2 + note.content3 + note.content1)
        )
      ),
    };
  });

  return noteList;
};

const getNoteDetail = async (
  note: INote,
  req: JSONBodyRequest<{ firstPassword?: string; secondPassword?: string }>,
  res: Response
) => {
  const { firstPassword, secondPassword } = req.body;

  // Process note is deleted
  if (note.isDeleted) {
    if (!firstPassword || !secondPassword)
      return res.status(400).json({ message: "Note can not be found" });

    const user = await User.findById((req as any).userId);
    if (user) {
      const isFirstPasswordCorrect = bcrypt.compareSync(
        firstPassword,
        user.secondPassword!
      );
      const isSecondPasswordCorrect = bcrypt.compareSync(
        secondPassword,
        user.thirdPassword!
      );

      if (!isFirstPasswordCorrect || !isSecondPasswordCorrect)
        return res.status(400).json({ message: "Incorrect password!!!" });
    }
  }

  const noteDetail: NoteDetail = {
    id: note._id as string,
    title: stringOut(
      shiftStringDownByOne(reverseString(note.title2 + note.title1))
    ),
    content: stringOut(
      shiftStringDownByOne(
        reverseString(note.content2 + note.content3 + note.content1)
      )
    ),
    tags: note.tags.map((tag) => tag.name),
    createdDate: note.createdDate,
    updatedDate: note.updatedDate,
    shareable: note.shareable,
    isDeleted: note.isDeleted,
  };

  return res.status(200).json(noteDetail);
};
