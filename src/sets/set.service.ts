import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Set } from './schema/set.schema';
import { CreateSetDto } from './dto/create-set.dto';
import { Song, SongDocument } from '../song/schema/song.schema';

@Injectable()
export class SetsService {
  constructor(
    @InjectModel(Set.name) private setModel: Model<Set>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
  ) {}

  async create(data: CreateSetDto, userId: string): Promise<Set> {
    //await this.setModel.updateMany({}, { $set: { active: false } });

    // Crear fecha en zona horaria local para evitar problemas con UTC
    // Si recibimos '2025-10-11', debe ser el 11 de octubre, no el 10
    const [year, month, day] = data.date.split('-').map(Number);
    const setDate = new Date(year, month - 1, day); // month es 0-indexed

    // Generar título automático basado en la fecha si no se proporciona
    const title =
      data.title ||
      `Setlist - ${setDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;

    const newSet = new this.setModel({
      ...data,
      date: setDate,
      title,
      createdBy: userId,
      active: true,
    });
    return newSet.save();
  }

  async findActive(): Promise<Set | null> {
    return this.setModel
      .findOne({ active: true })
      .populate('songs.songId')
      .exec();
  }

  async findAll(): Promise<Set[]> {
    return this.setModel.find().populate('songs.songId').exec();
  }

  async getSongRankings(dateMatch: Record<string, unknown> = {}) {
    return this.setModel
      .aggregate([
        ...(Object.keys(dateMatch).length > 0 ? [{ $match: dateMatch }] : []),
        { $unwind: '$songs' },
        { $match: { 'songs.rating': { $gte: 1, $lte: 5 } } },
        {
          $group: {
            _id: '$songs.songId',
            averageRating: { $avg: '$songs.rating' },
            ratingCount: { $sum: 1 },
            bestRating: { $max: '$songs.rating' },
            lastRatedAt: { $max: '$songs.ratedAt' },
          },
        },
        {
          $lookup: {
            from: 'songs',
            localField: '_id',
            foreignField: '_id',
            as: 'song',
          },
        },
        { $unwind: '$song' },
        {
          $project: {
            _id: 0,
            songId: '$_id',
            title: '$song.title',
            artist: '$song.artist',
            key: '$song.key',
            averageRating: { $round: ['$averageRating', 2] },
            ratingCount: 1,
            bestRating: 1,
            lastRatedAt: 1,
          },
        },
        { $sort: { averageRating: -1, ratingCount: -1, title: 1 } },
      ])
      .exec();
  }

  async getSongReports(from?: string, to?: string) {
    const dateMatch: Record<string, unknown> = {};
    const dateFilter: Record<string, Date> = {};

    if (from) {
      const [year, month, day] = from.split('-').map(Number);
      dateFilter.$gte = new Date(year, month - 1, day);
    }

    if (to) {
      const [year, month, day] = to.split('-').map(Number);
      dateFilter.$lte = new Date(year, month - 1, day, 23, 59, 59, 999);
    }

    if (Object.keys(dateFilter).length > 0) {
      dateMatch.date = dateFilter;
    }

    const [rankings, playStats, totalSongs, totalSetlists] = await Promise.all([
      this.getSongRankings(dateMatch),
      this.setModel
        .aggregate([
          ...(Object.keys(dateMatch).length > 0 ? [{ $match: dateMatch }] : []),
          { $unwind: '$songs' },
          {
            $group: {
              _id: '$songs.songId',
              timesPlayed: { $sum: 1 },
              lastPlayedAt: { $max: '$date' },
            },
          },
          {
            $lookup: {
              from: 'songs',
              localField: '_id',
              foreignField: '_id',
              as: 'song',
            },
          },
          { $unwind: '$song' },
          {
            $project: {
              _id: 0,
              songId: '$_id',
              title: '$song.title',
              artist: '$song.artist',
              key: '$song.key',
              timesPlayed: 1,
              lastPlayedAt: 1,
            },
          },
          { $sort: { timesPlayed: -1, lastPlayedAt: -1, title: 1 } },
        ])
        .exec(),
      this.songModel.countDocuments().exec(),
      this.setModel.countDocuments(dateMatch).exec(),
    ]);

    const playedIds = new globalThis.Set(
      playStats.map((song) => String(song.songId)),
    );
    const neverPlayed = await this.songModel
      .find({ _id: { $nin: Array.from(playedIds) } })
      .sort({ title: 1 })
      .limit(5)
      .select('title artist key')
      .lean()
      .exec();

    const neverPlayedStats = neverPlayed.map((song) => ({
      songId: song._id,
      title: song.title,
      artist: song.artist,
      key: song.key,
      timesPlayed: 0,
      lastPlayedAt: null,
    }));

    const leastPlayed = [
      ...neverPlayedStats,
      ...playStats
        .slice()
        .sort(
          (a, b) =>
            a.timesPlayed - b.timesPlayed || a.title.localeCompare(b.title),
        ),
    ].slice(0, 5);

    const ratedSongs = rankings.length;
    const averageRating =
      ratedSongs > 0
        ? Number(
            (
              rankings.reduce((sum, song) => sum + song.averageRating, 0) /
              ratedSongs
            ).toFixed(2),
          )
        : 0;

    return {
      summary: {
        totalSongs,
        totalSetlists,
        ratedSongs,
        averageRating,
      },
      topRated: rankings.slice(0, 10),
      mostPlayed: playStats.slice(0, 5),
      leastPlayed,
    };
  }

  async rateSong(setId: string, songId: string, rating: number): Promise<Set> {
    const updatedSet = await this.setModel
      .findOneAndUpdate(
        { _id: setId, 'songs.songId': songId },
        {
          $set: {
            'songs.$.rating': rating,
            'songs.$.ratedAt': new Date(),
          },
        },
        { new: true },
      )
      .populate('songs.songId')
      .exec();

    if (!updatedSet) {
      throw new NotFoundException('Setlist o canción no encontrada');
    }

    return updatedSet;
  }

  async update(id: string, data: Partial<CreateSetDto>): Promise<Set | null> {
    return this.setModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
