import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Receita } from './Receita';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 100, nullable: true })
  nome: string;

  @Column({ length: 100, unique: true })
  login: string;

  @Column({ length: 100 })
  senha: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: Date;

  @OneToMany(() => Receita, (receita) => receita.usuario)
  receitas: Receita[];
}