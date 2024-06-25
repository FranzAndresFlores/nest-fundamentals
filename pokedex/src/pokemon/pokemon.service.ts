import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon existe en db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException('No se puedo crear el registro - revisar la consola');
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    try {
      let pokemon: Pokemon;

      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term });
        return pokemon;
      }

      if (isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term);
        return pokemon;
      }

      if (!pokemon) {
        pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
        return pokemon;
      }

      if (!pokemon) {
        throw new NotFoundException(`Pokemon con identificador ${term} no fue encontrado`);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se puedo obtener el registro - revisar la consola');
    }
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
