import { Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull } from 'sequelize-typescript'
import Budget from './Budget';

/* Los decoradores 'Default', 'Unique' y 'AllowNull' son para definir valores por defecto,  únicos y nulos,
y deben colocarse antes de la definición de la columna. */ 

@Table({
  tableName: "users",
})
class User extends Model {
  // Extender Model permite que la clase pueda usar métodos como save(), findAll(), etc.
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare password: string;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare email: string;

  @Column({
    type: DataType.STRING(6),
  })
  declare token: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirmed: string;

  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare budgets: Budget[];
}

export default User;