// Primero se importa, entre otras cosas, lo que se conocen como decoradores de sequelize-typescript
// Los decoradores son funciones que se utilizan para definir las propiedades de un modelo y se escriben empezando con @
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import Expense from './Expense';

@Table({
    tableName: 'budgets'        // Esto genera la tabla de budgets en la base de datos
})

class Budget extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    declare name: string;   // Declare es una palabra reservada de typescript que indica que la propiedad se va a declarar más adelante, 
                            // pero no se va a inicializar aquí. Es como un placeholder.

    @Column({
        type: DataType.DECIMAL,
    })
    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    declare expenses: Expense[]; // Esto genera una relación uno a muchos entre Budget y Expenses.
}

export default Budget;