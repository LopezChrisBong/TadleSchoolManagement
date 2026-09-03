import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateESigDto } from './dto/create-e-sig.dto';
import { UpdateESigDto } from './dto/update-e-sig.dto';
import { DataSource, Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { ESig } from './entities/e-sig.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ESigsService {
  constructor(
    @InjectRepository(ESig) private readonly esigRepository: Repository<ESig>,
    private dataSource: DataSource,
  ) {}
  async create(createESigDto: CreateESigDto) {
    try {
      let filepath = join(__dirname, `../static/img/esig.png`);
      var fileInsertSQL = 'insert into e_sig(user_detailID, esign) values(?,?)';
      let insert = await this.dataSource.manager.query(fileInsertSQL, [
        '1',
        fs.readFileSync(filepath),
      ]);
      console.log(insert);
      return insert;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async uploadEsign(filename: string, user: any) {
    try {
      let user_esign = await this.esigRepository
        .createQueryBuilder()
        .where('user_detailID = :id', { id: user.userdetail.id })
        .getOne();

      if (user_esign) {
        await this.esigRepository.update(user_esign.id, {
          esign_filename: filename,
        });
        return {
          msg: 'Saving successful!',
          status: HttpStatus.OK,
        };
      } else {
        let newEsign = this.esigRepository.create({
          user_detailID: user.userdetail.id,
          esign_filename: filename,
        });
        await this.esigRepository.save(newEsign);
        return {
          msg: 'Saving successful!',
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async checkForEsig(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(ESig, 'esig')
      .where('esig.user_detailID = :id', { id })
      .getOne();

    if (data != null) {
      return true;
    } else {
      return false;
    }
  }

  async getMyEsign(user: any) {
    // console.log('getMyEsign', user.userdetail.id);
    const sign = await this.dataSource
      .createQueryBuilder(ESig, 'esig')
      .where('esig.user_detailID = :id', { id: user.userdetail.id })
      .getOne();
    if (sign) {
      return [
        {
          hasEsign: true,
          esign: sign,
        },
      ];
    } else {
      return [
        {
          hasEsign: false,
          esign: [],
        },
      ];
    }
  }

  getEmployeeEsign(id: number) {
    return this.dataSource
      .createQueryBuilder(ESig, 'esig')
      .where('esig.user_detailID = :id', { id })
      .getOne();
  }

  findAll() {
    return `This action returns all eSigs`;
  }

  // findOne(id: number) {
  //   return this.dataSource.createQueryBuilder(ESig, 'esig').getOne();
  // }

  update(id: number, updateESigDto: UpdateESigDto) {
    return `This action updates a #${id} eSig`;
  }

  remove(id: number) {
    return `This action removes a #${id} eSig`;
  }
}
