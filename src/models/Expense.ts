import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Budget from './Budget';

@Table({
    tableName: 'expenses'
})

class Expense extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    declare name: string;   
                  
    paranoid: true;        

    @Column({
        type: DataType.DECIMAL,
    })
    declare amount: number;

    @BelongsTo(() => Budget)
    declare budget: Budget; // Relación con el modelo Budget

    @ForeignKey(() => Budget)
    declare budgetId: number; // Clave foránea que referencia al modelo Budget
}

export default Expense;