import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Announcement, Comments, UserDetail } from 'src/entities';
@Injectable()
export class AnnouncementService {
  constructor(private dataSource: DataSource) {}
  async create(createAnnouncementDto: CreateAnnouncementDto) {
    try {
      let post = JSON.parse(createAnnouncementDto.data);
      console.log(post);
      let data = this.dataSource.manager.create(Announcement, {
        title: post.title,
        teacherID: post.teacherID,
        school_yearID: post.school_yearID,
      });
      await this.dataSource.manager.save(data);
      return {
        msg: 'Save successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async addComment(createAnnouncementDto: CreateAnnouncementDto) {
    try {
      let post = JSON.parse(createAnnouncementDto.data);
      let data = this.dataSource.manager.create(Comments, {
        title: post.title,
        userID: post.userID,
        school_yearID: post.school_yearID,
        postID: post.postID,
      });
      await this.dataSource.manager.save(data);
      return {
        msg: 'Save successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getMyAnnouncement(filter: number, user: any) {
    let announcementData = await this.dataSource
      .createQueryBuilder(Announcement, 'an')
      .select([
        'an.*',
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
      ])
      .leftJoin(UserDetail, 'ud', 'ud.id = an.teacherID')
      .where('an.teacherID = :userID', { userID: user.userdetail.id })
      .andWhere('an.school_yearID = :filter', { filter })
      .orderBy('an.created_at', 'ASC')
      .getRawMany();

    let data = [];
    for (let i = 0; i < announcementData.length; i++) {
      data.unshift({
        text: announcementData[i].title,
        teacherID: announcementData[i].teacherID,
        teacherName: announcementData[i].name,
        postID: announcementData[i].id,
        date: announcementData[i].created_at,
        likes: 0,
        comments: [],
        newComment: '',
        showComment: false,
      });
    }
    for (let i = 0; i < data.length; i++) {
      let getComment = await this.dataSource
        .createQueryBuilder(Comments, 'cm')
        .select([
          'cm.*',
          "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        ])
        .leftJoin(UserDetail, 'ud', 'ud.id = cm.userID')
        .where('cm.postID = :postID', { postID: data[i].postID })
        .andWhere('cm.school_yearID = :filter', { filter })
        .getRawMany();
      for (let index = 0; index < getComment.length; index++) {
        data[i].comments.push(getComment[index]);
      }
    }
    // console.log(data[0].comments);
    return data;
  }
  findAll() {
    return `This action returns all announcement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} announcement`;
  }

  update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    return `This action updates a #${id} announcement`;
  }

  remove(id: number) {
    return `This action removes a #${id} announcement`;
  }
}
