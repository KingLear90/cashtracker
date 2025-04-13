import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import Budget from './Budget';

@Table({
    tableName: 'users'
})

class User extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    declare email: string;

    @Column({
        type: DataType.STRING(60),
    })
    declare password: string;
    
}

export default User;    