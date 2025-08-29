import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Receita } from './Receita';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 100, unique: true, nullable: true })
  nome: string;

  @OneToMany(() => Receita, (receita) => receita.categoria)
  receitas: Receita[];
}