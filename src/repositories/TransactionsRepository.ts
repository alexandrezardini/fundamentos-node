import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions.find(
      transaction => transaction.type === 'income',
    );

    const outcomes = this.transactions.find(
      transaction => transaction.type === 'outcome',
    );

    const outcome = outcomes
      ? this.transactions
          .filter(transactions => transactions.type === 'outcome')
          .map(filtered => filtered.value)
          .reduce((acc, cur) => acc + cur)
      : 0;
    const income = incomes
      ? this.transactions
          .filter(transactions => transactions.type === 'income')
          .map(filtered => filtered.value)
          .reduce((acc, cur) => acc + cur)
      : 0;

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    const balance = this.getBalance();

    if (balance.income < balance.outcome) {
      this.transactions.pop();
      throw Error('You have no balance to this transaction');
    }

    return transaction;
  }
}

export default TransactionsRepository;
