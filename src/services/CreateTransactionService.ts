import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    if (type === 'income') {
      const transaction = this.transactionsRepository.create({
        title,
        value,
        type,
      });
      return transaction;
    } else if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();
      if (balance.total >= value) {
        const transaction = this.transactionsRepository.create({
          title,
          value,
          type,
        });
        return transaction;
      } else {
        throw Error('Balance below outcome value, transaction denied');
      }
    } else {
      throw Error('Transaction type not allowed (income | outcome)');
    }
  }
}

export default CreateTransactionService;
