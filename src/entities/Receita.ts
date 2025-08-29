import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Categoria } from './Categoria';

@Entity('receitas')
export class Receita {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'id_usuarios', unsigned: true })
  idUsuario: number;

  @Column({ name: 'id_categorias', unsigned: true, nullable: true })
  idCategoria: number;

  @Column({ length: 45, nullable: true })
  nome: string;

  @Column({ name: 'tempo_preparo_minutos', unsigned: true, nullable: true })
  tempoPreparoMinutos: number;

  @Column({ unsigned: true, nullable: true })
  porcoes: number;

  @Column({ name: 'modo_preparo', type: 'text' })
  modoPreparo: string;

  @Column({ type: 'text', nullable: true })
  ingredientes: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.receitas)
  @JoinColumn({ name: 'id_usuarios' })
  usuario: Usuario;

  @ManyToOne(() => Categoria, (categoria) => categoria.receitas)
  @JoinColumn({ name: 'id_categorias' })
  categoria: Categoria;
}